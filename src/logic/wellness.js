const CO2_FACTORS = { walk: 0, cycle: 0, public: 0.5, car: 2.5 }

export function calculateWellnessScore(sleep, energy, mood) {
  const raw = sleep * 0.4 + energy * 0.3 + mood * 0.3
  return Math.min(100, Math.max(0, Math.round(raw * 10)))
}

export function calculateDailyCO2(transport) {
  return CO2_FACTORS[transport] ?? 2.5
}

export function calculateCO2Savings(transport) {
  return Math.max(0, CO2_FACTORS.car - (CO2_FACTORS[transport] ?? 0))
}

export function calculateSustainabilityScore(weeklyCo2Sum) {
  const score = 100 - (weeklyCo2Sum / 20) * 100
  return Math.max(0, Math.min(100, Math.round(score)))
}
