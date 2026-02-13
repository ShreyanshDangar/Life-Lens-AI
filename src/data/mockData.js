export const timelineData = [
  { day: 'Mon', energy: 68, mood: 72, co2: 4.8 },
  { day: 'Tue', energy: 72, mood: 65, co2: 5.2 },
  { day: 'Wed', energy: 60, mood: 58, co2: 6.1 },
  { day: 'Thu', energy: 78, mood: 80, co2: 3.9 },
  { day: 'Fri', energy: 85, mood: 82, co2: 4.2 },
  { day: 'Sat', energy: 75, mood: 70, co2: 5.8 },
  { day: 'Sun', energy: 82, mood: 78, co2: 4.5 },
]

export const insightCards = [
  {
    id: 1,
    title: 'Sleep drives energy',
    description: 'Deep sleep above 90 min correlates with +15% next-day energy.',
    confidence: 92,
    category: 'health',
    sparkline: [40, 55, 48, 62, 70, 65, 78],
  },
  {
    id: 2,
    title: 'Less coffee, better recovery',
    description: 'Limiting caffeine after 2 PM improves sleep onset by 22 min.',
    confidence: 88,
    category: 'health',
    sparkline: [60, 55, 50, 45, 42, 38, 35],
  },
  {
    id: 3,
    title: 'REM suppressed',
    description: 'Alcohol consumption reduces REM sleep duration by 18%.',
    confidence: 88,
    category: 'health',
    sparkline: [70, 65, 58, 52, 48, 50, 45],
  },
  {
    id: 4,
    title: 'Mood peaks with sunlight',
    description: '20+ min morning light exposure boosts mood scores by 12%.',
    confidence: 75,
    category: 'health',
    sparkline: [30, 45, 55, 60, 72, 68, 75],
  },
  {
    id: 5,
    title: 'Protein action',
    description: 'Days with 100g+ protein show sustained energy through afternoon.',
    confidence: 95,
    category: 'health',
    sparkline: [50, 58, 65, 70, 75, 78, 82],
  },
  {
    id: 6,
    title: 'Meditation flow',
    description: '10-min meditation sessions reduce afternoon stress markers.',
    confidence: 82,
    category: 'health',
    sparkline: [65, 60, 55, 48, 42, 38, 35],
  },
  {
    id: 7,
    title: 'Morning run impact',
    description: 'Morning runs reduce daily CO2 footprint when replacing car commute.',
    confidence: 88,
    category: 'eco',
    sparkline: [50, 45, 40, 35, 30, 28, 25],
  },
  {
    id: 8,
    title: 'Moderate intake',
    description: 'Plant-based meals 3x/week lower carbon by 2.1 kg CO2.',
    confidence: 82,
    category: 'eco',
    sparkline: [60, 55, 50, 45, 42, 38, 36],
  },
]

export const sleepCorrelation = [
  { hour: '10pm', efficiency: 60 },
  { hour: '11pm', efficiency: 72 },
  { hour: '12am', efficiency: 80 },
  { hour: '1am', efficiency: 75 },
  { hour: '2am', efficiency: 62 },
  { hour: '3am', efficiency: 50 },
  { hour: '4am', efficiency: 40 },
  { hour: '5am', efficiency: 55 },
  { hour: '6am', efficiency: 70 },
]

export const weeklyMission = {
  title: 'Cycle 3x this week',
  description: 'Replace short car trips with cycling to boost cardiovascular health and cut emissions.',
  energyBoost: '+18%',
  co2Reduction: '-5.2 kg',
  missionData: [
    { day: 'Mon', baseline: 65, projected: 68 },
    { day: 'Tue', baseline: 62, projected: 70 },
    { day: 'Wed', baseline: 68, projected: 75 },
    { day: 'Thu', baseline: 64, projected: 78 },
    { day: 'Fri', baseline: 70, projected: 82 },
    { day: 'Sat', baseline: 66, projected: 80 },
    { day: 'Sun', baseline: 72, projected: 85 },
  ],
}

export const simulatorBaseline = [
  { week: 'W1', energy: 65, co2: 5.8 },
  { week: 'W2', energy: 68, co2: 5.5 },
  { week: 'W3', energy: 66, co2: 5.9 },
  { week: 'W4', energy: 70, co2: 5.4 },
  { week: 'W5', energy: 67, co2: 5.7 },
  { week: 'W6', energy: 72, co2: 5.2 },
]
