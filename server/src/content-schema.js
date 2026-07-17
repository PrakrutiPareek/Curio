/**
 * @typedef {Object} DailyBundle
 * @property {string} theme - The day's discovery topic, such as "Volcanoes".
 * @property {string} emoji - One emoji that represents the theme.
 * @property {string} fact - An age-appropriate fact in one or two sentences.
 * @property {string} joke - A kid-friendly, theme-related one-line joke.
 * @property {Object} experiment - A simple, safe experiment related to the theme.
 * @property {string} experiment.title - A short title for the experiment.
 * @property {string[]} experiment.materials - Common household items needed.
 * @property {string[]} experiment.steps - Short, ordered instructions.
 * @property {string} experiment.safetyNote - A clear safety reminder.
 * @property {string} experiment.whyItWorks - A simple explanation of the result.
 */

/**
 * JSON Schema for a complete Curio daily bundle.
 *
 * This can be supplied as the schema value for an AI provider's structured
 * output feature. `additionalProperties: false` keeps responses to this exact
 * shape.
 */
export const dailyBundleSchema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  title: 'Curio Daily Bundle',
  type: 'object',
  additionalProperties: false,
  required: ['theme', 'emoji', 'fact', 'joke', 'experiment'],
  properties: {
    theme: {
      type: 'string',
      description: 'The daily discovery topic, for example "Volcanoes".',
    },
    emoji: {
      type: 'string',
      minLength: 1,
      maxLength: 8,
      description: 'Exactly one emoji representing the theme.',
    },
    fact: {
      type: 'string',
      description: 'An age-appropriate fact written in one or two sentences.',
    },
    joke: {
      type: 'string',
      description: 'A kid-friendly, one-line joke related to the theme.',
    },
    experiment: {
      type: 'object',
      additionalProperties: false,
      required: ['title', 'materials', 'steps', 'safetyNote', 'whyItWorks'],
      properties: {
        title: {
          type: 'string',
          description: 'A short, engaging experiment title.',
        },
        materials: {
          type: 'array',
          description: 'Common household items needed for the experiment.',
          items: { type: 'string' },
        },
        steps: {
          type: 'array',
          description: 'Short, ordered instructions for carrying out the experiment.',
          items: { type: 'string' },
        },
        safetyNote: {
          type: 'string',
          description: 'A concise safety reminder for an adult or child.',
        },
        whyItWorks: {
          type: 'string',
          description: 'A simple explanation of why the experiment produces its result.',
        },
      },
    },
  },
}

export default dailyBundleSchema
