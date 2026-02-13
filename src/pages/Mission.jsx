import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import { Target, Zap, Leaf, Bike, Trophy, ArrowUpRight } from 'lucide-react'
import clsx from 'clsx'
import Navbar from '@/components/Navbar'
import { StorageService } from '@/services/storage'
import { INITIAL_MISSION } from '@/logic/mission'
import { weeklyMission } from '@/data/mockData'

const ease = [0.16, 1, 0.3, 1]

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[var(--color-elevated)] border border-[var(--color-border-hover)] rounded-xl px-4 py-2 shadow-xl">
      <p className="text-xs text-[var(--color-text-secondary)] mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-medium" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function Mission() {
  const [mission, setMission] = useState(INITIAL_MISSION)
  const [tab, setTab] = useState('overview')

  useEffect(() => {
    StorageService.init()
    setMission(StorageService.getMissionState())
  }, [])

  const progress = Math.min(100, (mission.currentCount / mission.targetCount) * 100)

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />
      <main className="pt-28 pb-16 px-6 max-w-5xl mx-auto">

        {/* -- Header -- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div>
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-[var(--color-text-muted)] mb-2">
              Weekly Challenge
            </p>
            <h1 className="font-display text-3xl font-bold tracking-tight">Mission Control</h1>
          </div>
          <div className="text-right">
            <p className={clsx(
              'font-display text-xl font-bold',
              mission.completed ? 'text-[var(--color-accent)]' : 'text-[var(--color-brand)]'
            )}>
              {mission.completed ? 'COMPLETED' : 'IN PROGRESS'}
            </p>
          </div>
        </motion.div>

        {/* -- Tab Switcher -- */}
        <div className="flex gap-2 mb-8">
          {['overview', 'tracker'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                'relative px-5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 focus-ring capitalize',
                tab === t ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              )}
            >
              {tab === t && (
                <motion.div
                  layoutId="mission-tab"
                  className="absolute inset-0 rounded-xl bg-[var(--color-elevated)] border border-[var(--color-border-hover)]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{t}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'overview' ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease }}
              className="space-y-6"
            >
              {/* -- Mission Overview Card -- */}
              <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-brand)]/10 flex items-center justify-center text-[var(--color-brand)]">
                    <Target size={20} />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold">{weeklyMission.title}</h2>
                    <p className="text-xs text-[var(--color-text-secondary)]">{weeklyMission.description}</p>
                  </div>
                </div>

                <div className="h-[220px] mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyMission.missionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis
                        dataKey="day" stroke="var(--color-text-muted)" fontSize={12}
                        tickLine={false} axisLine={false} fontFamily="var(--font-body)"
                      />
                      <YAxis stroke="var(--color-text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <Line
                        type="monotone" dataKey="baseline" name="Current"
                        stroke="var(--color-text-muted)" strokeWidth={1.5} strokeDasharray="6 3" dot={false}
                      />
                      <Line
                        type="monotone" dataKey="projected" name="With Mission"
                        stroke="var(--color-accent)" strokeWidth={2.5}
                        dot={{ r: 3, fill: 'var(--color-accent)', strokeWidth: 0 }}
                        animationDuration={1200}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-health)]/5 border border-[var(--color-health)]/15">
                    <Zap size={18} className="text-[var(--color-health)]" />
                    <div>
                      <p className="font-display text-lg font-bold text-[var(--color-health)]">{weeklyMission.energyBoost}</p>
                      <p className="text-[11px] text-[var(--color-text-muted)]">weekly energy</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-eco)]/5 border border-[var(--color-eco)]/15">
                    <Leaf size={18} className="text-[var(--color-eco)]" />
                    <div>
                      <p className="font-display text-lg font-bold text-[var(--color-eco)]">{weeklyMission.co2Reduction}</p>
                      <p className="text-[11px] text-[var(--color-text-muted)]">CO2 saved</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="tracker"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease }}
              className="space-y-6"
            >
              {/* -- Progress Card -- */}
              <div className={clsx(
                'rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] border-l-[4px] p-6 sm:p-10 relative overflow-hidden',
                mission.completed ? 'border-l-[var(--color-accent)]' : 'border-l-[var(--color-brand)]'
              )}>
                {mission.completed && (
                  <div className="absolute top-0 right-0 p-6 opacity-[0.06]">
                    <Trophy size={120} />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
                  <div className={clsx(
                    'p-4 rounded-2xl',
                    mission.completed ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'bg-[var(--color-brand)]/10 text-[var(--color-brand)]'
                  )}>
                    <Bike size={36} />
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <span className={clsx(
                      'text-xs font-bold tracking-[0.15em] uppercase mb-1 block',
                      mission.completed ? 'text-[var(--color-accent)]' : 'text-[var(--color-brand)]'
                    )}>
                      Active Behavioral Loop
                    </span>
                    <h2 className="font-display text-3xl font-bold mb-3">{mission.title}</h2>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-xs font-semibold">
                        <Zap size={12} className="text-[var(--color-health)]" /> +18% Energy
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-xs font-semibold">
                        <Leaf size={12} className="text-[var(--color-eco)]" /> -5.2kg CO2
                      </span>
                    </div>
                  </div>
                </div>

                {/* -- Progress Bar -- */}
                <div className="mb-3 flex justify-between text-sm font-semibold">
                  <span className="text-[var(--color-text-muted)]">Progress</span>
                  <span className={mission.completed ? 'text-[var(--color-accent)]' : 'text-[var(--color-brand)]'}>
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="h-3 rounded-full bg-[var(--color-elevated)] overflow-hidden mb-10">
                  <motion.div
                    className={clsx(
                      'h-full rounded-full',
                      mission.completed ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-brand)]'
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                  />
                </div>

                {/* -- Stats Grid -- */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Energy Gained', value: `+${mission.totalEnergyGained}%`, icon: ArrowUpRight, color: 'var(--color-health)' },
                    { label: 'CO2 Avoided', value: `${mission.totalCo2Saved.toFixed(1)}kg`, icon: Leaf, color: 'var(--color-eco)' },
                    { label: 'Trees Equivalent', value: (mission.totalCo2Saved / 1.5).toFixed(1), icon: Leaf, color: 'var(--color-accent)' },
                  ].map((stat, i) => (
                    <div key={i} className="p-5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-colors duration-300">
                      <p className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">{stat.label}</p>
                      <div className="flex items-end gap-2">
                        <p className="font-display text-3xl font-bold">{stat.value}</p>
                        <stat.icon size={18} style={{ color: stat.color }} className="mb-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* -- Completion Banner -- */}
              <AnimatePresence>
                {mission.completed && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--color-accent)]/8 border border-[var(--color-accent)]/20"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/15 flex items-center justify-center text-[var(--color-accent)]">
                      <Trophy size={22} />
                    </div>
                    <div>
                      <h3 className="font-display font-bold">Mission Accomplished</h3>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        Weekly target reached. Validated by LifeLens behavioral data.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
