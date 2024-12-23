'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Image from 'next/image'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import OrientationWarning from '@/components/OrientationWarning'
import ProjectSwitcher from '@/components/ProjectSwitcher'

const scrollToSection = (section?: 'case-studies' | 'contact') => {
  sessionStorage.setItem('scrollTarget', section || 'case-studies')
  sessionStorage.setItem('shouldScroll', 'true')
  window.location.href = '/'
}

export default function IllustrationsCase() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isLandscape = useMediaQuery('(orientation: landscape) and (max-height: 450px)')
  const [currentImage, setCurrentImage] = useState(1)
  const [showUI, setShowUI] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mouseTimeout, setMouseTimeout] = useState<NodeJS.Timeout>()
  const totalImages = 6

  // Memoize the image array
  const images = useMemo(() => Array.from({ length: totalImages }, (_, i) => i + 1), [totalImages])

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000)
  }, [])

  // Handle mouse/touch events - only for desktop
  const handleInteraction = useCallback(() => {
    if (!isMobile) {
      setShowUI(true)
      if (mouseTimeout) clearTimeout(mouseTimeout)
      const timeout = setTimeout(() => setShowUI(false), 2000)
      setMouseTimeout(timeout)
    }
  }, [mouseTimeout, isMobile])

  useEffect(() => {
    window.addEventListener('mousemove', handleInteraction)
    window.addEventListener('touchstart', handleInteraction)
    return () => {
      window.removeEventListener('mousemove', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
      if (mouseTimeout) clearTimeout(mouseTimeout)
    }
  }, [handleInteraction, mouseTimeout])

  // Optimize keydown handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      setCurrentImage(prev => prev < totalImages ? prev + 1 : prev)
    } else if (e.key === 'ArrowLeft') {
      setCurrentImage(prev => prev > 1 ? prev - 1 : prev)
    }
  }, [totalImages])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowOverlay(false)
    }
  }

  return (
    <>
      <OrientationWarning />
      <ProjectSwitcher currentProject="Illustrations" />
      
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
            exit={{ 
              opacity: 0,
              transition: { duration: 0.5, ease: "easeOut" }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                transition: {
                  duration: 0.5,
                  ease: "easeOut"
                }
              }}
              exit={{ 
                opacity: 0,
                scale: 1.1,
                transition: {
                  duration: 0.5,
                  ease: "easeIn"
                }
              }}
              className="text-center"
            >
              <h1 className="font-alice text-3xl text-[#333333] mb-4">Illustrations</h1>
              <div className="flex items-center justify-center gap-2">
                <motion.div
                  className="w-3 h-3 rounded-full bg-[#FF6B00]"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: 0
                  }}
                />
                <motion.div
                  className="w-3 h-3 rounded-full bg-[#FF6B00]"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: 0.2
                  }}
                />
                <motion.div
                  className="w-3 h-3 rounded-full bg-[#FF6B00]"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: 0.4
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`min-h-screen bg-white flex flex-col ${isLandscape ? 'h-screen overflow-hidden' : ''}`}>
        {/* Progress Bar */}
        <motion.div 
          className="fixed top-0 left-0 w-full h-1 bg-[#FF6B00]/20 z-[60]"
          initial={false}
        >
          <motion.div
            className="h-full bg-[#FF6B00]"
            style={{ width: `${(currentImage / totalImages) * 100}%` }}
          />
        </motion.div>

        {/* Desktop UI Overlay */}
        {!isMobile && (
          <motion.div
            className="fixed top-0 left-0 w-full z-[80]"
            initial={{ opacity: 0 }}
            animate={{ opacity: showUI ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Top Navigation */}
            <div className="bg-white/80 backdrop-blur-xl shadow-lg">
              <div className="w-full px-12 py-8">
                <Navbar />
              </div>
              <div className="w-full px-8 pb-6 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <Link 
                    href="/"
                    className="font-alice text-lg hover:text-[#FF6B00] transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection('case-studies')
                    }}
                  >
                    ← Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Mobile Floating Buttons */}
        {isMobile && (
          <>
            {/* Back Button */}
            <motion.button
              className="fixed left-4 top-4 z-[70] bg-white/80 backdrop-blur-xl shadow-lg rounded-full w-10 h-10 flex items-center justify-center"
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('case-studies')}
            >
              ←
            </motion.button>
          </>
        )}

        {/* Main Image */}
        <div className={`flex-1 flex items-center justify-center ${isLandscape ? 'h-full pt-0' : isMobile ? 'pt-16' : 'pt-24 sm:pt-32'}`}>
          <motion.div
            key={currentImage}
            className={`relative w-full ${isLandscape ? 'h-full' : 'h-[60vh] sm:h-[80vh]'} px-4 sm:px-0`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {currentImage === totalImages ? (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-sacramento text-4xl sm:text-7xl text-[#FF6B00]">
                  More Coming Soon
                </span>
              </div>
            ) : (
              <Image
                src={`/Illustration/${currentImage}${currentImage === 3 || currentImage === 4 ? '.png' : '.jpg'}`}
                alt={`Illustration ${currentImage}`}
                fill
                className="object-contain"
                priority
                quality={100}
              />
            )}
          </motion.div>
        </div>

        {/* Navigation Arrows - Always visible on mobile */}
        <div className="fixed left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between px-2 sm:px-8 z-[60]">
          <motion.button
            className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/80 backdrop-blur-xl shadow-lg flex items-center justify-center text-lg sm:text-xl"
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentImage(prev => prev > 1 ? prev - 1 : prev)}
            disabled={currentImage === 1}
          >
            ‹
          </motion.button>

          <motion.button
            className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/80 backdrop-blur-xl shadow-lg flex items-center justify-center text-lg sm:text-xl"
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentImage(prev => prev < totalImages ? prev + 1 : prev)}
            disabled={currentImage === totalImages}
          >
            ›
          </motion.button>
        </div>

        {/* Thumbnail Bar with Overlay */}
        <motion.div
          className={`fixed bottom-0 left-0 w-full ${showOverlay ? 'z-[90]' : 'z-[50]'} bg-white/80 backdrop-blur-xl shadow-lg`}
          initial={{ y: 200 }}
          animate={{ y: showOverlay ? 0 : 200 }}
        >
          {isMobile && (
            <div className="flex justify-end p-2 border-b border-gray-100">
              <button
                onClick={() => setShowOverlay(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#FF6B00] transition-colors"
              >
                ✕
              </button>
            </div>
          )}
          <div 
            className={`flex gap-2 sm:gap-4 p-2 sm:p-4 overflow-x-auto ${isLandscape ? 'justify-center' : 'justify-start sm:justify-center'}`}
            onClick={isMobile ? handleOverlayClick : undefined}
          >
            {images.map((index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentImage(index)
                  if (isMobile) setShowOverlay(false)
                }}
                className={`flex-shrink-0 ${isLandscape ? 'w-12 h-12' : 'w-16 h-16 sm:w-24 sm:h-24'} rounded-lg overflow-hidden ${
                  currentImage === index ? 'ring-2 ring-[#FF6B00]' : ''
                }`}
              >
                {index === totalImages ? (
                  <div className="w-full h-full bg-[#FF6B00]/10 flex items-center justify-center">
                    <span className="font-sacramento text-xs sm:text-sm text-[#FF6B00]">
                      More Soon
                    </span>
                  </div>
                ) : (
                  <Image
                    src={`/Illustration/${index}${index === 3 || index === 4 ? '.png' : '.jpg'}`}
                    alt={`Thumbnail ${index}`}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Mobile Thumbnail Toggle Button */}
        {isMobile && (
          <motion.button
            className="fixed bottom-4 right-4 z-[70] bg-white/80 backdrop-blur-xl shadow-lg rounded-full w-10 h-10 flex items-center justify-center"
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowOverlay(true)}
          >
            ≡
          </motion.button>
        )}
      </div>
    </>
  )
} 