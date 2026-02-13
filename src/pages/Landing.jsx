import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowRight, Activity, Brain, CheckCircle,
  Zap, Leaf, TrendingUp, Shield, ChevronRight
} from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import CountUp from 'react-countup'
import Navbar from '../components/Navbar'
import { cn } from '../lib/utils'

gsap.registerPlugin(ScrollTrigger)

const chartData = [
  { day: 'Mon', wellness: 65, co2Saved: 2.0 },
  { day: 'Tue', wellness: 68, co2Saved: 3.5 },
  { day: 'Wed', wellness: 75, co2Saved: 6.0 },
  { day: 'Thu', wellness: 72, co2Saved: 7.8 },
  { day: 'Fri', wellness: 82, co2Saved: 9.5 },
  { day: 'Sat', wellness: 88, co2Saved: 11.2 },
  { day: 'Sun', wellness: 92, co2Saved: 12.5 },
]

const ease = [0.16, 1, 0.3, 1]

function Section({ children, className, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease, delay }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

function StatCard({ value, numValue, label, sub, color, icon: Icon, delay = 0, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.7, ease }}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] } }}
      className="p-6 rounded-2xl glass-card transition-all duration-300 group glow-card"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110", color)}>
          <Icon size={18} />
        </div>
        <span className="text-xs font-semibold tracking-wider uppercase text-[var(--color-text-muted)]">
          {label}
        </span>
      </div>
      <p className="font-display text-4xl font-bold text-[var(--color-text)] mb-1">
        {numValue !== undefined && inView ? (
          <CountUp end={numValue} duration={2.5} separator="," suffix={suffix} />
        ) : value}
      </p>
      <p className="text-sm text-[var(--color-text-secondary)]">{sub}</p>
    </motion.div>
  )
}

function TiltCard({ children, className }) {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -4
    const rotateY = ((x - centerX) / centerX) * 4

    cardRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)'
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)', willChange: 'transform' }}
    >
      {children}
    </div>
  )
}

function ParallaxText({ children, speed = 0.5, className }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  const y = useTransform(scrollYProgress, [0, 1], [speed * 50, speed * -50])
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })

  return (
    <motion.div ref={ref} style={{ y: smoothY }} className={className}>
      {children}
    </motion.div>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const landingRef = useRef(null)

  // Parallax for hero content
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -120])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.92])
  const heroBlur = useTransform(scrollYProgress, [0, 0.5], [0, 10])

  // GSAP scroll animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the scroll indicator
      gsap.to('.scroll-indicator', {
        opacity: 0,
        y: 20,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '30% top',
          scrub: true,
        }
      })
    }, landingRef)

    return () => ctx.revert()
  }, [])

  const steps = [
    { num: '01', title: 'Check in daily', desc: 'Log sleep, mood, and commute in under 30 seconds.', icon: Activity },
    { num: '02', title: 'See the patterns', desc: 'AI surfaces how your habits shape energy and emissions.', icon: Brain },
    { num: '03', title: 'Take action', desc: 'Weekly missions that improve you and the planet.', icon: CheckCircle },
  ]

  return (
    <div ref={landingRef} className="relative min-h-screen font-body overflow-x-hidden bg-[var(--color-bg)]/80 backdrop-blur-sm">
      <Navbar />

      {/* -- HERO -- */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 pt-24 perspective-1000">
        <motion.div
          style={{
            y: heroY,
            opacity: heroOpacity,
            scale: heroScale,
            filter: useTransform(heroBlur, (v) => `blur(${v}px)`),
          }}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-[var(--color-border)] text-xs font-medium text-[var(--color-text-secondary)] tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
              Personal wellness meets climate intelligence
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-8"
          >
            Your daily habits shape
            <br />
            <span className="text-gradient-animated">health and planet.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease }}
            className="text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-xl mx-auto leading-relaxed mb-10 font-light"
          >
            LifeLens turns sleep, mood, and movement into actionable insights,
            proving self-care is the ultimate climate action.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/dashboard')}
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-[var(--color-accent)] text-[var(--color-bg)] font-display font-semibold text-base btn-magnetic focus-ring"
            >
              Start your journey
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/checkin')}
              className="flex items-center gap-2 px-6 py-4 rounded-2xl glass-card text-[var(--color-text-secondary)] font-medium text-sm hover:text-[var(--color-text)] transition-all duration-300 focus-ring"
            >
              Try a check-in
            </motion.button>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 scroll-indicator">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border-2 border-[var(--color-border-hover)] flex items-start justify-center pt-2"
          >
            <div className="w-1 h-2.5 rounded-full bg-[var(--color-text-muted)]" />
          </motion.div>
        </div>
      </section>

      {/* -- DUAL IMPACT -- */}
      <Section className="py-24 sm:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <ParallaxText speed={0.3}>
            <div className="text-center mb-16">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease }}
                className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-accent)] mb-3"
              >
                Dual Impact System
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1, ease }}
                className="font-display text-3xl sm:text-4xl font-bold tracking-tight"
              >
                One habit improves both.
              </motion.h2>
            </div>
          </ParallaxText>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Health Card */}
            <TiltCard>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease }}
                className="relative rounded-3xl glass-card overflow-hidden group hover-lift"
              >
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="gHealth" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-health)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--color-health)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="wellness" stroke="var(--color-health)" strokeWidth={3} fill="url(#gHealth)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="relative z-10 p-8 sm:p-10 flex flex-col justify-between min-h-[340px]">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[var(--color-health)]/10 flex items-center justify-center text-[var(--color-health)] mb-6 transition-transform duration-300 group-hover:scale-110">
                      <Zap size={22} />
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-3">Internal Health</h3>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                      Boost energy, sleep quality, and mental clarity through active daily choices.
                    </p>
                  </div>
                  <div className="pt-6 mt-6 border-t border-[var(--color-border)]">
                    <div className="flex items-end gap-3">
                      <span className="font-display text-5xl font-bold">92</span>
                      <span className="text-sm font-semibold text-[var(--color-health)] mb-1.5 uppercase tracking-wide">
                        Wellness Score
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TiltCard>

            {/* Eco Card */}
            <TiltCard>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease }}
                className="relative rounded-3xl glass-card overflow-hidden group hover-lift"
              >
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="gEco" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-eco)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--color-eco)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="co2Saved" stroke="var(--color-eco)" strokeWidth={3} fill="url(#gEco)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="relative z-10 p-8 sm:p-10 flex flex-col justify-between min-h-[340px]">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[var(--color-eco)]/10 flex items-center justify-center text-[var(--color-eco)] mb-6 transition-transform duration-300 group-hover:scale-110">
                      <Leaf size={22} />
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-3">External Planet</h3>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                      Reduce your carbon footprint by aligning lifestyle with sustainability.
                    </p>
                  </div>
                  <div className="pt-6 mt-6 border-t border-[var(--color-border)]">
                    <div className="flex items-end gap-3">
                      <span className="font-display text-5xl font-bold">12.5</span>
                      <span className="text-sm font-semibold text-[var(--color-eco)] mb-1.5 uppercase tracking-wide">
                        kg CO2 Saved
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TiltCard>
          </div>
        </div>
      </Section>

      {/* -- HOW IT WORKS -- */}
      <Section className="py-24 sm:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <ParallaxText speed={0.2}>
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease }}
                className="font-display text-3xl sm:text-4xl font-bold tracking-tight"
              >
                How it works
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1, ease }}
                className="text-[var(--color-text-secondary)] mt-4 max-w-lg mx-auto"
              >
                Three steps to a better you and a better planet.
              </motion.p>
            </div>
          </ParallaxText>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-24 left-[17%] right-[17%] h-px overflow-hidden">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent origin-left"
              />
            </div>

            {steps.map((step, i) => (
              <TiltCard key={step.num}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.2, duration: 0.7, ease }}
                  whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] } }}
                  className="relative p-8 rounded-2xl glass-card border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-all duration-300 shimmer-border glow-card group"
                >
                  <div className="absolute -top-3 -right-3 w-12 h-12 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center font-display font-bold text-sm text-[var(--color-text-muted)]">
                    {step.num}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-elevated)] flex items-center justify-center mb-6 text-[var(--color-accent)] transition-transform duration-300 group-hover:scale-110">
                    <step.icon size={20} />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed">{step.desc}</p>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </Section>

      {/* -- AI INSIGHT QUOTE -- */}
      <Section className="py-24 sm:py-36 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-[var(--color-border)] mb-10"
          >
            <Brain size={14} className="text-[var(--color-brand)]" />
            <span className="text-xs font-semibold tracking-wider uppercase text-[var(--color-brand)]">
              AI Insight
            </span>
          </motion.div>
          <ParallaxText speed={0.15}>
            <motion.blockquote
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1, ease }}
              className="font-display text-2xl sm:text-4xl lg:text-5xl font-medium leading-[1.3] tracking-tight text-[var(--color-text)]/90"
            >
              <span className="text-[var(--color-text-muted)]">&ldquo;</span>
              This week, one cycling habit{' '}
              <span className="text-gradient-animated">improved your energy</span>{' '}
              and{' '}
              <span className="text-gradient-eco">prevented emissions</span>{' '}
              equal to planting a tree.
              <span className="text-[var(--color-text-muted)]">&rdquo;</span>
            </motion.blockquote>
          </ParallaxText>
        </div>
      </Section>

      {/* -- STATS ROW -- */}
      <Section className="py-16 sm:py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Zap} value="92" numValue={92} label="Wellness" sub="Average score" color="bg-[var(--color-health)]/10 text-[var(--color-health)]" delay={0} />
          <StatCard icon={Leaf} value="12.5kg" numValue={12.5} suffix="kg" label="CO2 Saved" sub="This week" color="bg-[var(--color-eco)]/10 text-[var(--color-eco)]" delay={0.1} />
          <StatCard icon={TrendingUp} value="+18%" numValue={18} suffix="%" label="Energy" sub="Week over week" color="bg-[var(--color-accent)]/10 text-[var(--color-accent)]" delay={0.2} />
          <StatCard icon={Shield} value="7 days" numValue={7} suffix=" days" label="Streak" sub="Active logging" color="bg-[var(--color-brand)]/10 text-[var(--color-brand)]" delay={0.3} />
        </div>
      </Section>

      {/* -- FINAL CTA -- */}
      <Section className="py-24 sm:py-36 px-6 text-center relative">
        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-8"
          >
            Start seeing your
            <br /><span className="text-gradient-animated">life clearly.</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/dashboard')}
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-[var(--color-accent)] text-[var(--color-bg)] font-display font-semibold text-base btn-magnetic focus-ring"
            >
              Get Started
              <ChevronRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
          </motion.div>
        </div>
      </Section>

      {/* -- FOOTER -- */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="border-t border-[var(--color-border)] py-12 px-6"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-health)] flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="3" stroke="#070709" strokeWidth="2" />
              </svg>
            </div>
            <span className="font-display font-bold text-sm text-[var(--color-text)]">LifeLens AI</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-[var(--color-text-muted)]">
            {[
              { label: 'Dashboard', path: '/dashboard' },
              { label: 'Insights', path: '/insights' },
              { label: 'Mission', path: '/mission' },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative group hover:text-[var(--color-text)] transition-colors duration-300"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--color-accent)] transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>
          <p className="text-xs text-[var(--color-text-muted)]">
            Designed for a healthier you and a healthier planet.
          </p>
        </div>
      </motion.footer>
    </div>
  )
}
