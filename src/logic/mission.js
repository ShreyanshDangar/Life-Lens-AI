import { calculateCO2Savings } from './wellness'

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000

export const INITIAL_MISSION = {
  id: 'cycle-commute-1',
  title: 'Cycle to work 3x this week',
  targetCount: 3,
  currentCount: 0,
  completed: false,
  weekStartTimestamp: Date.now(),
  totalEnergyGained: 0,
  totalCo2Saved: 0,
}

export function checkAndResetMissionWeek(mission) {
  if (Date.now() - mission.weekStartTimestamp >= ONE_WEEK_MS) {
    return { ...mission, weekStartTimestamp: Date.now(), currentCount: 0, completed: false }
  }
  return mission
}

export function updateMissionProgress(mission, transport) {
  let next = checkAndResetMissionWeek(mission)

  if (transport === 'cycle') {
    next = { ...next }
    next.totalCo2Saved += calculateCO2Savings('cycle')
    next.totalEnergyGained += 6

    if (!next.completed) {
      next.currentCount += 1
      if (next.currentCount >= next.targetCount) {
        next.completed = true
      }
    }
  }

  return next
}
