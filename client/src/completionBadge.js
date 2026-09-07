const completedExperimentsKey = 'curio-completed-experiments'

export function getCompletedExperiments() {
  if (typeof window === 'undefined') return 0

  const value = Number.parseInt(window.localStorage.getItem(completedExperimentsKey) || '0', 10)
  return Number.isFinite(value) && value >= 0 ? value : 0
}

export function incrementCompletedExperiments() {
  const nextCount = getCompletedExperiments() + 1
  window.localStorage.setItem(completedExperimentsKey, String(nextCount))
  return nextCount
}
