import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense } from 'react'
import SmoothScroll from './components/SmoothScroll'
import Experience from './components/three/Experience'
import PageTransition from './components/PageTransition'

const Landing = lazy(() => import('./pages/Landing'))
const CheckIn = lazy(() => import('./pages/CheckIn'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Insights = lazy(() => import('./pages/Insights'))
const Simulator = lazy(() => import('./pages/Simulator'))
const Mission = lazy(() => import('./pages/Mission'))
const Profile = lazy(() => import('./pages/Profile'))

function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg)] transition-opacity duration-500">
      <div className="w-12 h-12 rounded-full border-2 border-[var(--color-accent)] border-t-transparent animate-spin" />
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/checkin" element={<PageTransition><CheckIn /></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/insights" element={<PageTransition><Insights /></PageTransition>} />
        <Route path="/simulator" element={<PageTransition><Simulator /></PageTransition>} />
        <Route path="/mission" element={<PageTransition><Mission /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Global 3D Experience - Persistent across routes */}
      <Experience />

      {/* Smooth Scroll Wrapper - Handles DOM content */}
      <SmoothScroll>
        <div className="grain-overlay" />
        <Suspense fallback={<Loader />}>
          <AnimatedRoutes />
        </Suspense>
      </SmoothScroll>
    </BrowserRouter>
  )
}
