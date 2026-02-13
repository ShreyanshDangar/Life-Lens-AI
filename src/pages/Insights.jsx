import { motion } from 'framer-motion'
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts'
import { Activity, Leaf, TrendingUp, ArrowUpRight } from 'lucide-react'
import clsx from 'clsx'
import Navbar from '@/components/Navbar'
import { insightCards, sleepCorrelation } from '@/data/mockData'

const ease = [0.16, 1, 0.3, 1]

const categoryConfig = {
  health: {
    color: 'var(--color-health)',
    bg: 'bg-[var(--color-health)]/8',
    border: 'border-l-[var(--color-health)]',
    icon: Activity,
    label: 'Health',
  },
  eco: {
    color: 'var(--color-eco)',
    bg: 'bg-[var(--color-eco)]/8',
    border: 'border-l-[var(--color-eco)]',
    icon: Leaf,
    label: 'Eco',
  },
}

function Sparkline({ data, color }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 100
  const h = 28

  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-7" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

function InsightCard({ card, index }) {
  const cat = categoryConfig[card.category] || categoryConfig.health

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: 0.05 + index * 0.06, duration: 0.6, ease }}
      whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] } }}
      className={clsx(
        'p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] border-l-[3px] hover:border-[var(--color-border-hover)] transition-all duration-300 flex flex-col gap-4 glow-card',
        cat.border
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
            className={clsx('w-8 h-8 rounded-lg flex items-center justify-center', cat.bg)}
          >
            <cat.icon size={14} style={{ color: cat.color }} />
          </motion.div>
          <h3 className="font-display text-sm font-bold leading-tight">{card.title}</h3>
        </div>
        <span
          className="shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-md"
          style={{ background: `color-mix(in srgb, ${cat.color} 12%, transparent)`, color: cat.color }}
        >
          {card.confidence}%
        </span>
      </div>

      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{card.description}</p>

      <Sparkline data={card.sparkline} color={cat.color} />

      <div className="h-1 rounded-full bg-[var(--color-elevated)] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: cat.color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${card.confidence}%` }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.06, duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  )
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[var(--color-elevated)] border border-[var(--color-border-hover)] rounded-xl px-4 py-2 shadow-xl">
      <p className="text-xs text-[var(--color-text-secondary)]">{label}</p>
      <p className="text-sm font-bold text-[var(--color-brand)]">{payload[0].value}%</p>
    </div>
  )
}

export default function Insights() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />
      <main className="pt-28 pb-16 px-6 max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="mb-10"
        >
          <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Wellness Intelligence</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Analyzing your lifestyle patterns to uncover actionable insights.
          </p>
        </motion.div>

        {/* -- Insight Grid -- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {insightCards.map((card, i) => (
            <InsightCard key={card.id} card={card} index={i} />
          ))}
        </div>

        {/* -- Sleep Correlation -- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6 sm:p-8 hover:border-[var(--color-border-hover)] transition-colors duration-300"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display text-lg font-bold flex items-center gap-2">
                <TrendingUp size={18} className="text-[var(--color-brand)]" />
                Sleep Efficiency Correlation
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-md">
                On days following 8+ hours of sleep, learning efficiency increases by an average of 23%.
              </p>
            </div>
          </div>

          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sleepCorrelation}>
                <XAxis
                  dataKey="hour"
                  stroke="var(--color-text-muted)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  fontFamily="var(--font-body)"
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="efficiency"
                  fill="var(--color-brand)"
                  radius={[6, 6, 0, 0]}
                  opacity={0.7}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex gap-4 mt-5">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-brand)]/10 text-[var(--color-brand)] text-sm font-semibold border border-[var(--color-brand)]/20 hover:bg-[var(--color-brand)]/20 transition-colors duration-300 focus-ring"
            >
              Explore Analysis <ArrowUpRight size={14} />
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
