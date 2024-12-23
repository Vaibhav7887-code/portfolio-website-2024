'use client'
import { useEffect, useState, useCallback } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { useMediaQuery } from '../hooks/useMediaQuery'

export default function CustomCursor() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [mousePosition, setMousePosition] = useState<{ x: number, y: number } | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 }
  const mouseXSpring = useSpring(0, springConfig)
  const mouseYSpring = useSpring(0, springConfig)

  const scaleX = useTransform(mouseXSpring, [-100, 100], [0.6, 1.4])
  const scaleY = useTransform(mouseYSpring, [-100, 100], [1.4, 0.6])

  const updateMousePosition = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e
    const lastX = mousePosition?.x ?? clientX
    const lastY = mousePosition?.y ?? clientY
    
    setMousePosition({ x: clientX, y: clientY })
    mouseXSpring.set(clientX - lastX)
    mouseYSpring.set(clientY - lastY)
    if (!isVisible) setIsVisible(true)
  }, [mousePosition, mouseXSpring, mouseYSpring, isVisible])

  useEffect(() => {
    if (isMobile) return // Don't add event listeners on mobile
    
    document.addEventListener('mousemove', updateMousePosition)
    setIsVisible(true)

    return () => {
      document.removeEventListener('mousemove', updateMousePosition)
    }
  }, [updateMousePosition, isMobile])

  if (isMobile || !mousePosition) return null

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full mix-blend-difference pointer-events-none z-[100]"
      animate={{
        x: mousePosition.x - 16,
        y: mousePosition.y - 16,
        opacity: isVisible ? 1 : 0
      }}
      transition={{
        type: "spring",
        mass: 0.2,
        stiffness: 800,
        damping: 40
      }}
    >
      <motion.div 
        className="w-full h-full bg-white rounded-full"
        style={{ scaleX, scaleY }}
      />
    </motion.div>
  )
} 