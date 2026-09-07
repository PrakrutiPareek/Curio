export const unsafeWords = [
  'blood', 'bomb', 'cigarette', 'drugs', 'frightening', 'gore', 'gun', 'horror', 'kill', 'murder',
  'naked', 'sex', 'suicide', 'tobacco', 'violent', 'violence', 'weapon',
]

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const unsafeContentPattern = new RegExp(`\\b(${unsafeWords.map(escapeRegExp).join('|')})\\b`, 'i')

export function containsUnsafeContent(content) {
  return unsafeContentPattern.test(JSON.stringify(content))
}
