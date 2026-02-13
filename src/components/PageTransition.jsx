import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

export default function PageTransition({ children }) {
    const location = useLocation()

    return (
        <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} // easeOutExpo
            className="w-full"
        >
            {children}
        </motion.div>
    )
}
