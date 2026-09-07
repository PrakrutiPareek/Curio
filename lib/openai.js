import OpenAI from 'openai'

let client

function getClient() {
  if (!client) client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  return client
}

export async function generateWithOpenAI(systemPrompt, userPrompt, responseFormat) {
  const response = await getClient().chat.completions.create({
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
