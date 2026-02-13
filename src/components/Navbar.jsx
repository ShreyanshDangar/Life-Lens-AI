import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { BarChart3, Activity, Lightbulb, SlidersHorizontal, Target, User, X, Menu } from 'lucide-react'
import { cn } from '../lib/utils'

const navItems = [
  { path: '/checkin', label: 'Check In', icon: Activity },
  { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/insights', label: 'Insights', icon: Lightbulb },
  { path: '/simulator', label: 'Simulator', icon: SlidersHorizontal },
  { path: '/mission', label: 'Mission', icon: Target },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredPath, setHoveredPath] = useState(null)
  const [isNavHovered, setIsNavHovered] = useState(false)
  const navRef = useRef(null)

  // Mouse position tracking for the glow follower
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 30, mass: 0.5 })
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 30, mass: 0.5 })

  // Glow opacity - fades in on hover, fades out smoothly
  const glowOpacity = useMotionValue(0)
  const smoothGlowOpacity = useSpring(glowOpacity, { stiffness: 200, damping: 25 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const handleNavMouseMove = useCallback((e) => {
    if (!navRef.current) return
    const rect = navRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }, [mouseX, mouseY])

  const handleNavEnter = useCallback(() => {
    setIsNavHovered(true)
    glowOpacity.set(1)
  }, [glowOpacity])

  const handleNavLeave = useCallback(() => {
    setIsNavHovered(false)
    setHoveredPath(null)
    glowOpacity.set(0)
  }, [glowOpacity])

  const indicatorPath = hoveredPath || location.pathname

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled ? 'py-3' : 'py-5'
        )}
      >
        <div
          className={cn(
            'mx-auto flex items-center justify-between px-5 transition-all duration-500 rounded-2xl',
            scrolled
              ? 'max-w-5xl glass-premium shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
              : 'max-w-6xl'
          )}
          style={{ padding: scrolled ? '10px 20px' : undefined }}
        >
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 focus-ring rounded-lg group"
          >
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-health)] flex items-center justify-center overflow-hidden">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="relative z-10">
                <circle cx="8" cy="8" r="3" stroke="#070709" strokeWidth="2" />
                <circle cx="8" cy="8" r="6.5" stroke="#070709" strokeWidth="1" opacity="0.5" />
              </svg>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </div>
            <span className="font-display font-bold text-[var(--color-text)] text-lg tracking-tight">
              LifeLens
            </span>
          </button>

          {/* Desktop Nav with Glow Follower */}
          <div
            ref={navRef}
            className="hidden md:flex items-center gap-1 relative"
            onMouseMove={handleNavMouseMove}
            onMouseEnter={handleNavEnter}
            onMouseLeave={handleNavLeave}
          >
            {/* Mouse-following glow orb - only visible on hover */}
            <motion.div
              className="pointer-events-none absolute"
              style={{
                x: smoothX,
                y: smoothY,
                opacity: smoothGlowOpacity,
                translateX: '-50%',
                translateY: '-50%',
              }}
            >
              <div
                className="w-28 h-28 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(45,212,191,0.12) 0%, rgba(56,189,248,0.06) 40%, transparent 70%)',
                  filter: 'blur(8px)',
                }}
              />
            </motion.div>

            {navItems.map((item) => {
              const active = location.pathname === item.path
              const isHovered = hoveredPath === item.path
              const showIndicator = indicatorPath === item.path

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  onMouseEnter={() => setHoveredPath(item.path)}
                  className={cn(
                    'relative px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-300 focus-ring',
                    active
                      ? 'text-[var(--color-text)]'
                      : isHovered
                        ? 'text-[var(--color-text)]'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                  )}
                >
                  {showIndicator && (
                    <motion.div
                      layoutId="nav-bubble"
                      className="absolute inset-0 rounded-xl overflow-hidden"
                      transition={{
                        type: 'spring',
                        stiffness: 350,
                        damping: 30,
                        mass: 0.8,
                      }}
                    >
                      {/* Base background */}
                      <div
                        className={cn(
                          'absolute inset-0 rounded-xl border backdrop-blur-sm transition-all duration-300',
                          active && !hoveredPath
                            ? 'bg-[var(--color-elevated)]/80 border-[var(--color-border-hover)]'
                            : 'bg-[var(--color-elevated)]/40 border-[var(--color-border)]'
                        )}
                      />

                      {/* Glow effect - only when hovered */}
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 rounded-xl"
                          style={{
                            background: 'linear-gradient(135deg, rgba(45,212,191,0.08) 0%, rgba(56,189,248,0.04) 50%, rgba(129,140,248,0.06) 100%)',
                            boxShadow: '0 0 20px -5px rgba(45,212,191,0.15), inset 0 0 20px -5px rgba(45,212,191,0.05)',
                          }}
                        />
                      )}

                      {/* Animated border light - only when hovered */}
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4 }}
                          className="absolute inset-0 rounded-xl border-light-effect"
                        />
                      )}
                    </motion.div>
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <item.icon
                      size={16}
                      strokeWidth={active ? 2.5 : 2}
                      className={cn(
                        'transition-all duration-300',
                        active ? 'text-[var(--color-accent)]' : isHovered ? 'text-[var(--color-accent)]/80' : ''
                      )}
                    />
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/profile')}
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 focus-ring',
                location.pathname === '/profile'
                  ? 'bg-[var(--color-accent)] text-[var(--color-bg)] shadow-[0_0_20px_-4px_var(--color-accent)]'
                  : 'bg-[var(--color-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:shadow-[0_0_20px_-8px_rgba(45,212,191,0.15)]'
              )}
            >
              <User size={16} />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--color-elevated)] text-[var(--color-text-secondary)] border border-[var(--color-border)] focus-ring"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-72 glass-premium z-50 md:hidden p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-10">
                <span className="font-display font-bold text-lg">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--color-elevated)] text-[var(--color-text-secondary)] border border-[var(--color-border)]"
                >
                  <X size={16} />
                </button>
              </div>
              <nav className="flex flex-col gap-1 flex-1">
                {navItems.map((item, i) => {
                  const active = location.pathname === item.path
                  return (
                    <motion.button
                      key={item.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => navigate(item.path)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3.5 rounded-xl text-left font-medium transition-colors duration-200',
                        active
                          ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-elevated)]'
                      )}
                    >
                      <item.icon size={18} />
                      {item.label}
                    </motion.button>
                  )
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
