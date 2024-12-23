'use client'
import { motion } from 'framer-motion'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useEffect, useState } from 'react'

export default function OrientationWarning() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [isPortrait, setIsPortrait] = useState(false)

  useEffect(() => {
    if (!isMobile) return

    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth)
    }

    // Initial check
    checkOrientation()

    // Add listener for orientation changes
    window.addEventListener('resize', checkOrientation)
    window.addEventListener('orientationchange', checkOrientation)

    return () => {
      window.removeEventListener('resize', checkOrientation)
      window.removeEventListener('orientationchange', checkOrientation)
    }
  }, [isMobile])

  if (!isMobile || !isPortrait) return null

  return (
    <motion.div 
      className="fixed inset-0 z-[200] bg-white flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center px-6">
        <motion.div
          animate={{ rotate: 90 }}
          className="w-12 h-12 mx-auto mb-6"
        >
          📱
        </motion.div>
        <h2 className="text-2xl font-alice text-[#333333] mb-4">
          Please Rotate Your Device
        </h2>
        <p className="text-sm font-opensans text-gray-600">
          This presentation is best viewed in landscape mode
        </p>
      </div>
    </motion.div>
  )
} 