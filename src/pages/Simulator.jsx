import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Zap, Leaf, Brain, RotateCcw, Footprints, Bike, Bus, Car } from 'lucide-react'
import clsx from 'clsx'
import Navbar from '@/components/Navbar'
import { StorageService } from '@/services/storage'
import { calculateWellnessScore } from '@/logic/wellness'

const ease = [0.16, 1, 0.3, 1]
const CO2_MAP = { walk: 0, cycle: 0, public: 0.5, car: 2.5 }

const transportOpts = [
  { val: 'walk', label: 'Walk', icon: Footprints },
  { val: 'cycle', label: 'Cycle', icon: Bike },
  { val: 'public', label: 'Transit', icon: Bus },
  { val: 'car', label: 'Car', icon: Car },
]

function SimSlider({ label, value, onChange, min = 0, max = 10 }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--color-text-secondary)]">{label}</span>
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="font-display text-xl font-bold tabular-nums"
        >
          {value}
        </motion.span>
      </div>
      <div className="relative">
        <div className="h-1.5 rounded-full bg-[var(--color-elevated)]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-health)]"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.15 }}
          />
        </div>
        <input
          type="range" min={min} max={max} step={1} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          style={{ touchAction: 'none' }}
        />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[var(--color-text)] shadow-[0_0_0_3px_var(--color-bg),0_0_0_5px_var(--color-accent)] pointer-events-none"
          initial={false}
          animate={{ left: `calc(${pct}% - 8px)` }}
          transition={{ duration: 0.15 }}
        />
      </div>
    </div>
  )
}

export default function Simulator() {
  const [baseline, setBaseline] = useState({ wellness: 65, co2: 12.5 })
  const [sleep, setSleep] = useState(7)
  const [energy, setEnergy] = useState(6)
  const [mood, setMood] = useState(6)
  const [transport, setTransport] = useState('car')

  const defaults = { sleep: 7, energy: 6, mood: 6, transport: 'car' }

  useEffect(() => {
    StorageService.init()
    const data = StorageService.getEntries()
    if (data.length > 0) {
      const last7 = data.slice(-7)
      const avgW = last7.reduce((s, e) => s + e.wellnessScore, 0) / last7.length
      const oneWeekAgo = Date.now() - 7 * 864e5
      const sumCo2 = data.filter(e => e.timestamp > oneWeekAgo).reduce((s, e) => s + e.co2Emitted, 0)
      setBaseline({ wellness: Math.round(avgW), co2: parseFloat(sumCo2.toFixed(1)) })
      setSleep(Math.round(last7.reduce((s, e) => s + e.sleep, 0) / last7.length) || 7)
      setEnergy(Math.round(last7.reduce((s, e) => s + e.energy, 0) / last7.length) || 6)
      setMood(Math.round(last7.reduce((s, e) => s + e.mood, 0) / last7.length) || 6)
    }
  }, [])

  const simWellness = useMemo(() => calculateWellnessScore(sleep, energy, mood), [sleep, energy, mood])
  const simCo2 = CO2_MAP[transport]
  const wellnessDelta = simWellness - baseline.wellness
  const co2Delta = simCo2 - baseline.co2 / 7

  const reset = () => {
    setSleep(defaults.sleep)
    setEnergy(defaults.energy)
    setMood(defaults.mood)
    setTransport(defaults.transport)
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />
      <main className="pt-28 pb-16 px-6 max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Impact Simulator</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              See how changing daily habits impacts your wellness and footprint.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:border-[var(--color-border-hover)] transition-colors duration-300 focus-ring"
          >
            <RotateCcw size={14} /> Reset
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* -- Controls -- */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease }}
            className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6 sm:p-8 space-y-8"
          >
            <SimSlider label="Sleep Quality" value={sleep} onChange={setSleep} />
            <SimSlider label="Energy Level" value={energy} onChange={setEnergy} />
            <SimSlider label="Mood" value={mood} onChange={setMood} />

            <div>
              <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-4">Transport Mode</p>
              <div className="grid grid-cols-2 gap-3">
                {transportOpts.map((opt) => {
                  const active = transport === opt.val
                  return (
                    <motion.button
                      key={opt.val}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setTransport(opt.val)}
                      className={clsx(
                        'flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200 focus-ring',
                        active
                          ? 'bg-[var(--color-accent)]/8 border-[var(--color-accent)]/30 text-[var(--color-accent)]'
                          : 'bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]'
                      )}
                    >
                      <opt.icon size={16} />
                      <span className="text-sm font-medium">{opt.label}</span>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* -- Results -- */}
          <div className="space-y-5">
            <motion.div
              layout
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease }}
              whileHover={{ y: -3, transition: { duration: 0.3 } }}
              className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] border-l-[3px] border-l-[var(--color-health)] p-7"
              style={{ boxShadow: '0 0 40px -15px var(--color-health)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-semibold tracking-[0.12em] uppercase text-[var(--color-health)]">Projected Wellness</span>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">vs. 7-day average ({baseline.wellness})</p>
                </div>
                <Zap size={18} className={wellnessDelta >= 0 ? 'text-[var(--color-health)]' : 'text-[var(--color-text-muted)]'} />
              </div>
              <div className="flex items-end gap-3">
                <motion.span
                  key={simWellness}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display text-6xl font-bold tabular-nums"
                >
                  {simWellness}
                </motion.span>
                <span className={clsx('text-sm font-bold mb-2', wellnessDelta >= 0 ? 'text-[var(--color-health)]' : 'text-[var(--color-danger)]')}>
                  {wellnessDelta > 0 ? '+' : ''}{wellnessDelta} pts
                </span>
              </div>
            </motion.div>

            <motion.div
              layout
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease }}
              whileHover={{ y: -3, transition: { duration: 0.3 } }}
              className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] border-l-[3px] border-l-[var(--color-eco)] p-7"
              style={{ boxShadow: '0 0 40px -15px var(--color-eco)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-semibold tracking-[0.12em] uppercase text-[var(--color-eco)]">Daily CO2 Impact</span>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">vs. daily avg ({(baseline.co2 / 7).toFixed(1)} kg)</p>
                </div>
                <Leaf size={18} className={co2Delta <= 0 ? 'text-[var(--color-eco)]' : 'text-[var(--color-warn)]'} />
              </div>
              <div className="flex items-end gap-3">
                <motion.span
                  key={simCo2}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display text-6xl font-bold tabular-nums"
                >
                  {simCo2}
                </motion.span>
                <span className="text-xl text-[var(--color-text-muted)] mb-1.5 font-medium">kg</span>
                <div className="mb-1.5">
                  <p className={clsx('text-sm font-bold', co2Delta <= 0 ? 'text-[var(--color-eco)]' : 'text-[var(--color-danger)]')}>
                    {co2Delta > 0 ? '+' : ''}{co2Delta.toFixed(1)} relative
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease }}
              whileHover={{ y: -2, transition: { duration: 0.3 } }}
              className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6 hover:border-[var(--color-border-hover)] transition-colors duration-300"
            >
              <h4 className="font-display font-bold text-sm mb-2 flex items-center gap-2">
                <Brain size={16} className="text-[var(--color-brand)]" /> AI Projection
              </h4>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {wellnessDelta > 10
                  ? 'These adjustments would significantly boost your wellness score.'
                  : co2Delta < -1
                    ? 'This transport switch massively reduces your carbon footprint.'
                    : 'Small adjustments to sleep and mood have compounding effects over time.'}
              </p>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
