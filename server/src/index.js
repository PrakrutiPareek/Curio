import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import OpenAI from 'openai'
import { dailyBundleSchema } from './content-schema.js'

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

const unsafeWords = [
  'blood', 'bomb', 'cigarette', 'drugs', 'frightening', 'gore', 'gun', 'horror', 'kill', 'murder',
  'naked', 'sex', 'suicide', 'tobacco', 'violent', 'violence', 'weapon',
]

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const unsafeContentPattern = new RegExp(`\\b(${unsafeWords.map(escapeRegExp).join('|')})\\b`, 'i')

function isValidRequest(body) {
  return body
    && typeof body === 'object'
    && Number.isFinite(body.age)
    && body.age >= 1
    && body.age <= 18
    && Number.isFinite(body.minutes)
    && body.minutes > 0
    && body.minutes <= 180
    && (body.interest === undefined || typeof body.interest === 'string')
}

function isValidAskRequest(body) {
  return body
    && typeof body === 'object'
    && typeof body.question === 'string'
    && body.question.trim().length > 0
    && body.question.length <= 1_000
    && Number.isFinite(body.age)
    && body.age >= 1
    && body.age <= 18
    && typeof body.theme === 'string'
    && body.theme.trim().length > 0
    && body.theme.length <= 200
}

function buildSystemPrompt({ age, interest, minutes }, stricter = false) {
  const interestInstruction = interest.trim()
    ? `Match the content to the child's interest in ${interest.trim()}.`
    : 'Choose a cheerful, broadly interesting theme.'

  return `You are Curio's children's content creator for a ${age}-year-old child.
Write ONLY age-appropriate, safe, non-scary, non-violent content. ${interestInstruction}
Create activities that fit within ${minutes} minutes total. Avoid dangerous actions, adult topics, and any need for unusual equipment.
Always provide the activity in the "experiment" object, including its materials, steps, safety note, and explanation.
Return ONLY valid JSON matching this schema exactly. Do not include Markdown fences, commentary, or a preamble.
${JSON.stringify(dailyBundleSchema)}
${stricter ? 'This is a strict retry: your entire response must be one parseable JSON object and nothing else.' : ''}`
}

function stripMarkdownFences(content) {
  const trimmed = content.trim()
  if (!trimmed.startsWith('```')) return trimmed

  return trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim()
}

function validateBundle(bundle) {
  if (!bundle || typeof bundle !== 'object' || Array.isArray(bundle)) return false
  const bundleKeys = ['theme', 'emoji', 'fact', 'joke', 'experiment']
  if (!hasExactKeys(bundle, bundleKeys)) return false

  const { theme, emoji, fact, joke, experiment } = bundle
  if (![theme, emoji, fact, joke].every((value) => typeof value === 'string' && value.trim())) return false
  if (typeof emoji !== 'string' || [...emoji].length > 8) return false
  if (!experiment || typeof experiment !== 'object' || Array.isArray(experiment)) return false

  const { title, materials, steps, safetyNote, whyItWorks } = experiment
  return hasExactKeys(experiment, ['title', 'materials', 'steps', 'safetyNote', 'whyItWorks'])
    && typeof title === 'string'
    && title.trim().length > 0
    && Array.isArray(materials)
    && materials.every((item) => typeof item === 'string' && item.trim())
    && Array.isArray(steps)
    && steps.every((step) => typeof step === 'string' && step.trim())
    && typeof safetyNote === 'string'
    && safetyNote.trim().length > 0
    && typeof whyItWorks === 'string'
    && whyItWorks.trim().length > 0
}

function hasExactKeys(object, expectedKeys) {
  const actualKeys = Object.keys(object)
  return actualKeys.length === expectedKeys.length
    && expectedKeys.every((key) => Object.hasOwn(object, key))
}

function containsUnsafeContent(bundle) {
  return unsafeContentPattern.test(JSON.stringify(bundle))
}

async function generateWithOpenAI(systemPrompt, userPrompt, responseFormat) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
    max_tokens: 1000,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    ...(responseFormat ? { response_format: responseFormat } : {}),
  })

  return response.choices[0]?.message?.content ?? ''
}

async function generateBundle(input, stricter) {
  const systemPrompt = buildSystemPrompt(input, stricter)
  const content = process.env.OPENAI_API_KEY
    ? await generateWithOpenAI(systemPrompt, 'Generate the daily bundle now.', {
      type: 'json_schema',
      json_schema: {
        name: 'daily_bundle',
        strict: true,
        schema: dailyBundleSchema,
      },
    })
    : null

  if (!content) throw new Error('OpenAI is not configured or returned no content.')

  const bundle = JSON.parse(stripMarkdownFences(content))
  if (!validateBundle(bundle)) throw new Error('The AI response did not match the daily bundle schema.')
  if (containsUnsafeContent(bundle)) throw new Error('The AI response contained unsafe content.')

  return bundle
}

function buildAskAnythingPrompt({ age, theme }) {
  return `You are Curio's friendly children's content creator for a ${age}-year-old child.
Answer the child's question in 2-4 short sentences at an age-appropriate reading level. Stay thematically connected to ${theme} where natural.
Always be safe, kind, and encouraging of curiosity. Do not provide scary, violent, adult, dangerous, or otherwise inappropriate content.
If the question asks for anything inappropriate, scary, or unsafe for children, gently redirect by saying: "That's a great question for a grown-up to help with!"
Return only the answer text with no Markdown, labels, or preamble.`
}

async function askAnything(input) {
  const systemPrompt = buildAskAnythingPrompt(input)
  const userPrompt = `Child's question: ${input.question.trim()}`
  const answer = process.env.OPENAI_API_KEY
    ? await generateWithOpenAI(systemPrompt, userPrompt)
    : null

  if (!answer || !answer.trim()) throw new Error('OpenAI is not configured or returned no content.')

  return answer.trim()
}

app.post('/api/generate-bundle', async (req, res) => {
  if (!isValidRequest(req.body)) {
    return res.status(400).json({
      error: 'Provide age (1-18), interest (optional string), and minutes (a positive number up to 180).',
    })
  }

  const input = {
    age: req.body.age,
    interest: req.body.interest ?? '',
    minutes: req.body.minutes,
  }

  try {
    // A failed parse, schema validation, or moderation check gets one stricter retry.
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        return res.status(200).json(await generateBundle(input, attempt === 1))
      } catch (error) {
        if (attempt === 1) throw error
      }
    }
  } catch (error) {
    console.error('Bundle generation failed:', error.message)
    return res.status(502).json({ error: 'Unable to generate a safe daily bundle right now.' })
  }
})

app.post('/api/ask-anything', async (req, res) => {
  if (!isValidAskRequest(req.body)) {
    return res.status(400).json({
      error: 'Provide a question and theme as non-empty strings, plus an age from 1 to 18.',
    })
  }

  try {
    const answer = await askAnything(req.body)
    if (unsafeContentPattern.test(answer)) {
      return res.status(200).json({
        answer: "That's a great question for a grown-up to help with!",
      })
    }

    return res.status(200).json({ answer })
  } catch (error) {
    console.error('Question answering failed:', error.message)
    return res.status(502).json({ error: 'Unable to answer that question right now.' })
  }
})

app.use((error, _req, res, next) => {
  if (error instanceof SyntaxError && Object.hasOwn(error, 'body')) {
    return res.status(400).json({ error: 'Request body must be valid JSON.' })
  }

  return next(error)
})

app.listen(port, () => {
  console.log(`Curio API listening at http://localhost:${port}`)
})
