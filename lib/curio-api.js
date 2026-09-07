import { dailyBundleSchema } from './content-schema.js'
import { containsUnsafeContent, unsafeContentPattern } from './safety.js'
import { generateWithOpenAI } from './openai.js'

function isValidBundleRequest(body) {
  return body
    && typeof body === 'object'
    && Number.isFinite(body.age) && body.age >= 1 && body.age <= 18
    && Number.isFinite(body.minutes) && body.minutes > 0 && body.minutes <= 180
    && (body.interest === undefined || typeof body.interest === 'string')
}

function isValidAskRequest(body) {
  return body
    && typeof body === 'object'
    && typeof body.question === 'string' && body.question.trim().length > 0 && body.question.length <= 1_000
    && Number.isFinite(body.age) && body.age >= 1 && body.age <= 18
    && typeof body.theme === 'string' && body.theme.trim().length > 0 && body.theme.length <= 200
}

function buildBundleSystemPrompt({ age, interest, minutes }, stricter = false) {
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
  return trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
}

function hasExactKeys(object, expectedKeys) {
  const actualKeys = Object.keys(object)
  return actualKeys.length === expectedKeys.length && expectedKeys.every((key) => Object.hasOwn(object, key))
}

function validateBundle(bundle) {
  if (!bundle || typeof bundle !== 'object' || Array.isArray(bundle)) return false
  if (!hasExactKeys(bundle, ['theme', 'emoji', 'fact', 'joke', 'experiment'])) return false
  const { theme, emoji, fact, joke, experiment } = bundle
  if (![theme, emoji, fact, joke].every((value) => typeof value === 'string' && value.trim())) return false
  if ([...emoji].length > 8 || !experiment || typeof experiment !== 'object' || Array.isArray(experiment)) return false
  const { title, materials, steps, safetyNote, whyItWorks } = experiment
  return hasExactKeys(experiment, ['title', 'materials', 'steps', 'safetyNote', 'whyItWorks'])
    && typeof title === 'string' && title.trim().length > 0
    && Array.isArray(materials) && materials.every((item) => typeof item === 'string' && item.trim())
    && Array.isArray(steps) && steps.every((step) => typeof step === 'string' && step.trim())
    && typeof safetyNote === 'string' && safetyNote.trim().length > 0
    && typeof whyItWorks === 'string' && whyItWorks.trim().length > 0
}

async function generateBundle(input, stricter) {
  if (!process.env.OPENAI_API_KEY) throw new Error('OpenAI is not configured.')
  const content = await generateWithOpenAI(buildBundleSystemPrompt(input, stricter), 'Generate the daily bundle now.', {
    type: 'json_schema',
    json_schema: { name: 'daily_bundle', strict: true, schema: dailyBundleSchema },
  })
  if (!content) throw new Error('OpenAI returned no content.')
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
  if (!process.env.OPENAI_API_KEY) throw new Error('OpenAI is not configured.')
  const answer = await generateWithOpenAI(buildAskAnythingPrompt(input), `Child's question: ${input.question.trim()}`)
  if (!answer || !answer.trim()) throw new Error('OpenAI returned no content.')
  return answer.trim()
}

function onlyPost(req, res) {
  if (req.method === 'POST') return true
  res.setHeader('Allow', 'POST')
  res.status(405).json({ error: 'Method not allowed.' })
  return false
}

const invalidJsonBody = Symbol('invalidJsonBody')

function getRequestBody(req, res) {
  try {
    return req.body
  } catch (error) {
    // The Vercel Node runtime parses JSON lazily. Read it inside this handler
    // so malformed JSON receives a client error instead of crashing the
    // function process during local development.
    res.status(400).json({ error: 'Request body must be valid JSON.' })
    return invalidJsonBody
  }
}

export async function generateBundleHandler(req, res) {
  if (!onlyPost(req, res)) return
  const body = getRequestBody(req, res)
  if (body === invalidJsonBody) return
  if (!isValidBundleRequest(body)) {
    return res.status(400).json({ error: 'Provide age (1-18), interest (optional string), and minutes (a positive number up to 180).' })
  }
  const input = { age: body.age, interest: body.interest ?? '', minutes: body.minutes }
  try {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try { return res.status(200).json(await generateBundle(input, attempt === 1)) } catch (error) { if (attempt === 1) throw error }
    }
  } catch (error) {
    console.error('Bundle generation failed:', error.message)
    return res.status(502).json({ error: 'Unable to generate a safe daily bundle right now.' })
  }
}

export async function askAnythingHandler(req, res) {
  if (!onlyPost(req, res)) return
  const body = getRequestBody(req, res)
  if (body === invalidJsonBody) return
  if (!isValidAskRequest(body)) {
    return res.status(400).json({ error: 'Provide a question and theme as non-empty strings, plus an age from 1 to 18.' })
  }
  try {
    const answer = await askAnything(body)
    return res.status(200).json({ answer: unsafeContentPattern.test(answer) ? "That's a great question for a grown-up to help with!" : answer })
  } catch (error) {
    console.error('Question answering failed:', error.message)
    return res.status(502).json({ error: 'Unable to answer that question right now.' })
  }
}
