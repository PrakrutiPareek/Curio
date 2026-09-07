/**
 * JSON Schema for a complete Curio daily bundle.
 *
 * This schema is shared by the local API adapter and Vercel functions so
 * structured AI responses have the same shape in every environment.
 */
export const dailyBundleSchema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  title: 'Curio Daily Bundle',
  type: 'object',
  additionalProperties: false,
  required: ['theme', 'emoji', 'fact', 'joke', 'experiment'],
  properties: {
    theme: { type: 'string', description: 'The daily discovery topic.' },
    emoji: { type: 'string', minLength: 1, maxLength: 8, description: 'One emoji representing the theme.' },
    fact: { type: 'string', description: 'An age-appropriate fact.' },
    joke: { type: 'string', description: 'A kid-friendly joke related to the theme.' },
    experiment: {
      type: 'object',
      additionalProperties: false,
      required: ['title', 'materials', 'steps', 'safetyNote', 'whyItWorks'],
      properties: {
        title: { type: 'string', description: 'A short experiment title.' },
        materials: { type: 'array', description: 'Common household items needed.', items: { type: 'string' } },
        steps: { type: 'array', description: 'Short ordered instructions.', items: { type: 'string' } },
        safetyNote: { type: 'string', description: 'A concise safety reminder.' },
        whyItWorks: { type: 'string', description: 'A simple explanation of the result.' },
      },
    },
  },
}

export default dailyBundleSchema
