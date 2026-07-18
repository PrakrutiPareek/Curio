const BADGES_KEY = "curio-earned-badges";

/** Canonical list of earnable badge categories, matching OnboardingScreen interests. */
export const BADGE_CATEGORIES = [
  {key: "space", label: "Space", icon: "🚀"},
  {key: "animals", label: "Animals", icon: "🦊"},
  {key: "nature", label: "Nature", icon: "🌿"},
  {key: "ocean", label: "Ocean", icon: "🐋"},
  {key: "dinosaurs", label: "Dinosaurs", icon: "🦕"},
  {key: "weather", label: "Weather", icon: "🌦️"},
  {key: "human body", label: "Human Body", icon: "🫀"},
  {key: "bugs and insects", label: "Bugs & Insects", icon: "🐞"},
  {key: "robots and machines", label: "Robots & Machines", icon: "🤖"},
];

/** Returns an array of earned badge keys (lowercase). */
export function getEarnedBadges() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BADGES_KEY);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Records a badge for the given category key.
 * Returns true if the badge was newly earned, false if already owned.
 */
export function earnBadge(category) {
  if (!category || typeof category !== "string") return false;
  const key = category.toLowerCase();
  const earned = getEarnedBadges();
  if (earned.includes(key)) return false;
  window.localStorage.setItem(BADGES_KEY, JSON.stringify([...earned, key]));
  return true;
}

/** Returns true if the badge for the given category key has been earned. */
export function hasBadge(category) {
  if (!category || typeof category !== "string") return false;
  return getEarnedBadges().includes(category.toLowerCase());
}
