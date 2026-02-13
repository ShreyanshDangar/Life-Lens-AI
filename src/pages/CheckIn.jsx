import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Zap, Heart, Footprints, Bike, Bus, Car, ArrowRight, Check } from 'lucide-react'
import clsx from 'clsx'
import Navbar from '@/components/Navbar'
import { StorageService } from '@/services/storage'
import { calculateWellnessScore, calculateDailyCO2 } from '@/logic/wellness'
import { updateMissionProgress } from '@/logic/mission'

const ease = [0.16, 1, 0.3, 1]

const transportOptions = [
  { value: 'walk', label: 'Walk', icon: Footprints, co2: '0kg', color: 'var(--color-eco)' },
  { value: 'cycle', label: 'Cycle', icon: Bike, co2: '0kg', color: 'var(--color-eco)' },
  { value: 'public', label: 'Transit', icon: Bus, co2: '0.5kg', color: 'var(--color-warn)' },
  { value: 'car', label: 'Car', icon: Car, co2: '2.5kg', color: 'var(--color-danger)' },
]

function SliderInput({ label, icon: Icon, iconColor, value, onChange, min = 0, max = 10, hints }) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconColor}`}>
            <Icon size={16} />
          </div>
          <span className="font-display font-semibold text-sm">{label}</span>
        </div>
        <span className="font-display text-2xl font-bold tabular-nums">{value}</span>
      </div>

      <div className="relative">
        <div className="h-2 rounded-full bg-[var(--color-elevated)] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-health)]"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ touchAction: 'none' }}
        />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[var(--color-text)] shadow-[0_0_0_4px_var(--color-bg),0_0_0_6px_var(--color-accent)] pointer-events-none"
          initial={false}
          animate={{ left: `calc(${pct}% - 10px)` }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        />
      </div>

      {hints && (
        <div className="flex justify-between text-[11px] text-[var(--color-text-muted)]">
          {hints.map((h, i) => <span key={i}>{h}</span>)}
        </div>
      )}
    </div>
  )
}

export default function CheckIn() {
  const navigate = useNavigate()
  const [sleep, setSleep] = useState(7)
  const [energy, setEnergy] = useState(7)
  const [mood, setMood] = useState(7)
  const [transport, setTransport] = useState('public')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const submit = useCallback(async () => {
    setSubmitting(true)
    try {
      StorageService.init()
      const wellness = calculateWellnessScore(sleep, energy, mood)
      const co2 = calculateDailyCO2(transport)
      const now = new Date()

      StorageService.saveEntry({
        id: crypto.randomUUID(),
        date: now.toISOString().split('T')[0],
        timestamp: now.getTime(),
        sleep, energy, mood, transport,
        wellnessScore: wellness,
        co2Emitted: co2,
      })

      const mission = StorageService.getMissionState()
      StorageService.saveMissionState(updateMissionProgress(mission, transport))

      setDone(true)
      setTimeout(() => navigate('/dashboard'), 1800)
    } catch {
      setSubmitting(false)
    }
  }, [sleep, energy, mood, transport, navigate])

  const wellnessPreview = calculateWellnessScore(sleep, energy, mood)
  const co2Preview = calculateDailyCO2(transport)

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />
      <main className="pt-28 pb-16 px-6 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease }}
              className="text-center py-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center mx-auto mb-6"
              >
                <Check size={36} className="text-[var(--color-accent)]" />
              </motion.div>
              <h2 className="font-display text-2xl font-bold mb-3">Check-in saved</h2>
              <p className="text-[var(--color-text-secondary)]">Redirecting to your dashboard...</p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease }}
            >
              <div className="mb-10">
                <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Daily Check-In</h1>
                <p className="text-[var(--color-text-secondary)]">
                  Reflect on today to track your health and environmental impact.
                </p>
              </div>

              {/* -- Preview Banner -- */}
              <motion.div
                layout
                className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] p-5 mb-8 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-semibold tracking-wider uppercase text-[var(--color-text-muted)] mb-1">
                    Live Preview
                  </p>
                  <p className="font-display text-sm text-[var(--color-text-secondary)]">
                    Wellness <span className="text-[var(--color-text)] font-bold">{wellnessPreview}</span>
                    {' / '}
                    CO2 <span className="text-[var(--color-text)] font-bold">{co2Preview}kg</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                </div>
              </motion.div>

              <div className="space-y-8">
                {/* -- Health Section -- */}
                <div>
                  <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[var(--color-health)] mb-6">
                    Health Metrics
                  </h3>
                  <div className="space-y-8">
                    <SliderInput
                      label="Sleep Quality"
                      icon={Moon}
                      iconColor="bg-[var(--color-brand)]/10 text-[var(--color-brand)]"
                      value={sleep}
                      onChange={setSleep}
                      hints={['Poor', 'Okay', 'Deep rest']}
                    />
                    <SliderInput
                      label="Energy Level"
                      icon={Zap}
                      iconColor="bg-[var(--color-warn)]/10 text-[var(--color-warn)]"
                      value={energy}
                      onChange={setEnergy}
                      hints={['Exhausted', 'Normal', 'Energized']}
                    />
                    <SliderInput
                      label="Mood"
                      icon={Heart}
                      iconColor="bg-[var(--color-danger)]/10 text-[var(--color-danger)]"
                      value={mood}
                      onChange={setMood}
                      hints={['Low', 'Balanced', 'Positive']}
                    />
                  </div>
                </div>

                {/* -- Transport Section -- */}
                <div>
                  <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[var(--color-eco)] mb-6">
                    Transport Today
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {transportOptions.map((opt) => {
                      const active = transport === opt.value
                      return (
                        <motion.button
                          key={opt.value}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setTransport(opt.value)}
                          className={clsx(
                            'relative flex flex-col items-center gap-2 p-5 rounded-2xl border transition-all duration-300 focus-ring',
                            active
                              ? 'bg-[var(--color-accent)]/5 border-[var(--color-accent)]/30'
                              : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
                          )}
                        >
                          {active && (
                            <motion.div
                              layoutId="transport-ring"
                              className="absolute inset-0 rounded-2xl border-2 border-[var(--color-accent)]/40"
                              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            />
                          )}
                          <opt.icon size={22} className={active ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'} />
                          <span className={clsx('text-sm font-medium', active ? 'text-[var(--color-text)]' : 'text-[var(--color-text-secondary)]')}>
                            {opt.label}
                          </span>
                          <span className="text-[11px]" style={{ color: opt.color }}>{opt.co2} CO2</span>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* -- Submit -- */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={submit}
                disabled={submitting}
                className="w-full mt-10 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-[var(--color-accent)] text-[var(--color-bg)] font-display font-semibold text-base disabled:opacity-50 transition-all duration-300 focus-ring btn-magnetic"
              >
                {submitting ? 'Saving...' : 'Save & See Impact'}
                {!submitting && <ArrowRight size={18} />}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
