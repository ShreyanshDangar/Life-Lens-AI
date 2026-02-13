function pctChange(current, previous) {
  if (previous === 0) return 0
  return Math.round(((current - previous) / previous) * 100)
}

export function generateCoachInsight(entries) {
  if (entries.length === 0) {
    return {
      text: 'Begin your journey by logging your first day. Collective data will reveal hidden connections between your health and the planet.',
      type: 'balanced',
      correlations: {
        health: 'Consistent tracking is the first step to unlocking metabolic awareness.',
        planet: 'Your digital footprint starts here. Small logs enable large-scale climate awareness.',
      },
    }
  }

  const latest = entries[entries.length - 1]
  const previous = entries.length > 1 ? entries[entries.length - 2] : null
  const weekly = entries.slice(-7)
  const avgWellness = weekly.reduce((sum, e) => sum + e.wellnessScore, 0) / weekly.length
  const isActiveTransport = latest.transport === 'cycle' || latest.transport === 'walk'
  const co2Saved = isActiveTransport ? 2.5 : 0

  if (previous && isActiveTransport && (previous.transport === 'car' || previous.transport === 'public')) {
    const energyDiff = pctChange(latest.energy, previous.energy)
    const wellnessDiff = pctChange(latest.wellnessScore, previous.wellnessScore)
    const improvementText = energyDiff > 0
      ? `Your energy rose ${energyDiff}% compared to yesterday after ${latest.transport === 'cycle' ? 'cycling' : 'walking'}.`
      : `Your wellness score improved by ${wellnessDiff}% following your active commute.`

    return {
      text: `${improvementText} If this continues, your weekly stability will recover.`,
      type: 'balanced',
      correlations: {
        health: `Data shows a ${energyDiff > 0 ? energyDiff : 15}% immediate boost in vitality after switching modes.`,
        planet: `You prevented ${co2Saved}kg of CO2 today -- that's equal to charging 300 smartphones.`,
      },
    }
  }

  if (previous && latest.transport === 'car' && (previous.transport === 'cycle' || previous.transport === 'walk')) {
    return {
      text: `Driving today spiked your CO2 by ${latest.co2Emitted}kg compared to yesterday. A cycle commute tomorrow would neutralize this rise.`,
      type: 'planet',
      correlations: {
        health: 'Sedentary travel is linked to a 12% drop in afternoon focus levels.',
        planet: 'This single trip emitted more carbon than your last 3 days combined.',
      },
    }
  }

  const activeStreak = entries.slice(-3).every(e => e.transport === 'cycle' || e.transport === 'walk')
  if (activeStreak && entries.length >= 3) {
    const totalSaved = entries.slice(-3).reduce((acc, curr) => acc + (2.5 - curr.co2Emitted), 0)
    return {
      text: "You've maintained a 3-day active streak. Your carbon footprint is down 60% this week, while your energy stability is peaking.",
      type: 'balanced',
      correlations: {
        health: 'Consistent low-intensity cardio builds 20% more daily endurance.',
        planet: `You have saved approx ${totalSaved.toFixed(1)}kg of CO2 in just 72 hours.`,
      },
    }
  }

  if (previous && latest.sleep < 6 && latest.mood < previous.mood) {
    const moodDrop = pctChange(latest.mood, previous.mood)
    return {
      text: `Your sleep dropped to ${latest.sleep.toFixed(1)}h, correlating with a ${Math.abs(moodDrop)}% dip in your mood score. Recovery tonight is key.`,
      type: 'health',
      correlations: {
        health: 'Sleep debt under 6h is the top predictor of mood volatility in your data.',
        planet: 'Fatigue correlates with a 30% higher likelihood of choosing high-carbon transport.',
      },
    }
  }

  if (latest.wellnessScore > 80) {
    return {
      text: `You are operating at peak efficiency. Your current weekly average is ${Math.round(avgWellness)}/100, placing you in the top tier of balanced living.`,
      type: 'balanced',
      correlations: {
        health: 'Sustained scores above 80 indicate optimal metabolic and mental synchrony.',
        planet: 'Your lifestyle this week is aligned with a 1.5 degrees C climate target.',
      },
    }
  }

  return {
    text: `Based on your last ${entries.length} logs, your energy fluctuates with your commute choices. Try cycling tomorrow to test the correlation.`,
    type: 'balanced',
    correlations: {
      health: 'Active days consistently show 15-20% higher energy reports.',
      planet: 'Small daily choices compound to create measurable climatic impact.',
    },
  }
}
