// Computes a 0-100 compatibility score between two roommate profiles.
//
// Design notes:
// - Numeric traits (cleanliness, noise, social) are scored by how close
//   the two values are on a 1-5 scale — a difference of 0 is a perfect
//   match, a difference of 4 (opposite ends) scores 0 for that trait.
// - Categorical traits (sleep schedule, study habits) score full points
//   for an exact match, partial credit if either side is "flexible",
//   and 0 for a hard mismatch (e.g. early_bird vs night_owl).
// - Smoking is treated as a near-dealbreaker: mismatched smoking
//   preference tanks the score hard, since it's a much bigger factor
//   in roommate satisfaction than a 1-point difference in tidiness.
// - Budget overlap is measured as how much their budget ranges intersect.
// - Weights are tunable — see WEIGHTS below. They sum to 100 so the
//   final score lands naturally in the 0-100 range.

const WEIGHTS = {
  cleanliness: 18,
  noise: 14,
  social: 10,
  sleepSchedule: 18,
  studyHabits: 10,
  smoking: 14,
  pets: 6,
  budget: 10,
};

function numericTraitScore(a, b, maxDiff = 4) {
  const diff = Math.abs(a - b);
  return Math.max(0, 1 - diff / maxDiff); // 1 = identical, 0 = maximally different
}

function categoricalScore(a, b) {
  if (a === b) return 1;
  if (a === 'flexible' || b === 'flexible') return 0.6;
  return 0; // hard mismatch, e.g. early_bird vs night_owl
}

function smokingScore(smokingA, smokingB) {
  return smokingA === smokingB ? 1 : 0.1; // heavily penalize mismatch, not a flat 0
}

function petsScore(petsA, petsB) {
  // Softer penalty than smoking — pet mismatch (e.g. one has a cat,
  // one doesn't want pets) matters, but is less universally a
  // dealbreaker than smoking, so it doesn't tank the score as hard.
  return petsA === petsB ? 1 : 0.4;
}

function budgetOverlapScore(profileA, profileB) {
  const { budget_min: aMin, budget_max: aMax } = profileA;
  const { budget_min: bMin, budget_max: bMax } = profileB;

  // If either side hasn't specified a budget, treat as neutral rather
  // than penalizing — we don't have enough info to say they clash.
  if (aMin == null || aMax == null || bMin == null || bMax == null) return 0.5;

  const overlapStart = Math.max(aMin, bMin);
  const overlapEnd = Math.min(aMax, bMax);
  const overlap = Math.max(0, overlapEnd - overlapStart);

  const widestRange = Math.max(aMax - aMin, bMax - bMin, 1); // avoid divide-by-zero
  return Math.min(1, overlap / widestRange);
}

export function computeCompatibilityScore(profileA, profileB) {
  const scores = {
    cleanliness: numericTraitScore(profileA.cleanliness_level, profileB.cleanliness_level),
    noise: numericTraitScore(profileA.noise_tolerance, profileB.noise_tolerance),
    social: numericTraitScore(profileA.social_level, profileB.social_level),
    sleepSchedule: categoricalScore(profileA.sleep_schedule, profileB.sleep_schedule),
    studyHabits: categoricalScore(profileA.study_habits, profileB.study_habits),
    smoking: smokingScore(!!profileA.smoking, !!profileB.smoking),
    pets: petsScore(!!profileA.pets, !!profileB.pets),
    budget: budgetOverlapScore(profileA, profileB),
  };

  const weightedTotal = Object.entries(WEIGHTS).reduce(
    (sum, [trait, weight]) => sum + scores[trait] * weight,
    0
  );

  return Math.round(weightedTotal * 100) / 100; // 0-100, 2 decimal places
}
