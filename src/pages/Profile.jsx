import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  User, Shield, Trash2, LogOut, Award, Star, Zap, Leaf,
  ChevronRight, Save, Pencil, Settings, Trophy, Lock
} from 'lucide-react'
import clsx from 'clsx'
import Navbar from '@/components/Navbar'
import { StorageService } from '@/services/storage'

const ease = [0.16, 1, 0.3, 1]

const badges = [
  { icon: Zap, label: 'Energy Pioneer', color: 'var(--color-health)', check: (s) => s.avgWellness > 70 },
  { icon: Leaf, label: 'Eco Guardian', color: 'var(--color-eco)', check: (s) => s.totalCo2Saved > 5 },
  { icon: Star, label: 'Consistency', color: 'var(--color-brand)', check: (s) => s.totalCheckins > 3 },
  { icon: Trophy, label: 'Early Adopter', color: 'var(--color-warn)', check: () => true },
]

export default function Profile() {
  const [profile, setProfile] = useState({ name: 'User', onboardingCompleted: false })
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [stats, setStats] = useState({ totalCheckins: 0, avgWellness: 0, totalCo2Saved: 0, streak: 0 })

  useEffect(() => {
    StorageService.init()
    const p = StorageService.getUserProfile()
    const entries = StorageService.getEntries()
    const mission = StorageService.getMissionState()
    setProfile(p)
    setEditName(p.name)

    if (entries.length > 0) {
      setStats({
        totalCheckins: entries.length,
        avgWellness: Math.round(entries.reduce((s, e) => s + e.wellnessScore, 0) / entries.length),
        totalCo2Saved: parseFloat(mission.totalCo2Saved.toFixed(1)),
        streak: Math.min(entries.length, 3),
      })
    }
  }, [])

  const handleSave = () => {
    const updated = { ...profile, name: editName }
    StorageService.saveUserProfile(updated)
    setProfile(updated)
    setEditing(false)
  }

  const handleReset = () => {
    if (window.confirm('This will delete all your daily entries and reset progress. Are you sure?')) {
      StorageService.resetData()
      window.location.reload()
    }
  }

  const statCards = [
    { label: 'Check-ins', value: stats.totalCheckins, sub: 'Total days' },
    { label: 'Avg Wellness', value: `${stats.avgWellness}%`, sub: 'Last 7 days' },
    { label: 'CO2 Saved', value: `${stats.totalCo2Saved}kg`, sub: 'Lifetime' },
    { label: 'Streak', value: stats.streak, sub: 'Day streak' },
  ]

  const settingsItems = [
    { icon: Lock, label: 'Privacy Settings', desc: 'Manage local data storage', action: null },
    { icon: Trash2, label: 'Reset All Data', desc: 'Wipe all check-ins and progress', action: handleReset, danger: true },
    { icon: LogOut, label: 'Sign Out', desc: 'Return to start', action: () => (window.location.href = '/') },
  ]

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />
      <main className="pt-28 pb-16 px-6 max-w-4xl mx-auto space-y-8">

        {/* -- Profile Header -- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] p-8"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-brand)] flex items-center justify-center font-display text-4xl font-bold text-[var(--color-bg)]">
              {profile.name[0]?.toUpperCase() || 'U'}
            </div>
            <button
              onClick={() => setEditing(true)}
              className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-lg bg-[var(--color-elevated)] border border-[var(--color-border)] hover:bg-[var(--color-hover)] transition-colors duration-200"
            >
              <Pencil size={12} className="text-[var(--color-text-secondary)]" />
            </button>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
              {editing ? (
                <div className="flex gap-2">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="font-display text-2xl font-bold bg-[var(--color-elevated)] border border-[var(--color-border)] rounded-xl px-4 py-2 w-48 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                    autoFocus
                  />
                  <button
                    onClick={handleSave}
                    className="px-3 py-2 rounded-xl bg-[var(--color-accent)] text-[var(--color-bg)] hover:opacity-90 transition-opacity"
                  >
                    <Save size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="font-display text-3xl font-bold">{profile.name}</h1>
                  <button onClick={() => setEditing(true)}>
                    <Pencil size={16} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors" />
                  </button>
                </>
              )}
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] flex items-center justify-center sm:justify-start gap-2">
              <Shield size={14} className="text-[var(--color-brand)]" />
              Behavioral Intelligence:
              <span className="font-semibold text-[var(--color-brand)]">Level 1 Novice</span>
            </p>
          </div>
        </motion.div>

        {/* -- Stats Grid -- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease }}
              className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] p-5 text-center"
            >
              <p className="font-display text-3xl font-bold mb-1">{s.value}</p>
              <p className="text-xs font-semibold text-[var(--color-brand)] uppercase tracking-wider">{s.label}</p>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* -- Badges -- */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease }}
            className="space-y-4"
          >
            <h3 className="font-display font-bold flex items-center gap-2 px-1">
              <Award size={18} className="text-[var(--color-brand)]" /> Impact Milestones
            </h3>
            <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] p-5 grid grid-cols-2 gap-3">
              {badges.map((b, i) => {
                const active = b.check(stats)
                return (
                  <motion.div
                    key={i}
                    whileHover={active ? { scale: 1.03 } : {}}
                    className={clsx(
                      'flex flex-col items-center p-4 rounded-xl border transition-all duration-200',
                      active
                        ? 'bg-[var(--color-bg)] border-[var(--color-border-hover)]'
                        : 'bg-[var(--color-bg)]/50 border-transparent opacity-35 grayscale'
                    )}
                  >
                    <b.icon size={28} className="mb-2" style={{ color: active ? b.color : 'var(--color-text-muted)' }} />
                    <span className="text-[10px] font-bold uppercase text-center leading-tight tracking-wider">
                      {b.label}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* -- Settings -- */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease }}
            className="space-y-4"
          >
            <h3 className="font-display font-bold flex items-center gap-2 px-1">
              <Settings size={18} className="text-[var(--color-brand)]" /> Account Settings
            </h3>
            <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden">
              {settingsItems.map((item, i) => (
                <button
                  key={i}
                  onClick={item.action || undefined}
                  className={clsx(
                    'w-full flex items-center justify-between p-4 transition-colors duration-200 group',
                    item.danger
                      ? 'hover:bg-[var(--color-danger)]/5 text-[var(--color-danger)]'
                      : 'hover:bg-[var(--color-hover)] text-[var(--color-text)]',
                    i > 0 && 'border-t border-[var(--color-border)]'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className={item.danger ? '' : 'text-[var(--color-text-muted)]'} />
                    <div className="text-left">
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className={clsx('text-xs', item.danger ? 'text-[var(--color-danger)]/60' : 'text-[var(--color-text-muted)]')}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-[var(--color-text-muted)] group-hover:translate-x-0.5 transition-transform duration-200" />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
