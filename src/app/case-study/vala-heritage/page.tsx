'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, MotionValue } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import TableOfContents from '@/components/TableOfContents'
import OrientationWarning from '@/components/OrientationWarning'
import MobileControls from '@/components/MobileControls'
import ProjectSwitcher from '@/components/ProjectSwitcher'
import { useMediaQuery } from '@/hooks/useMediaQuery'

function useSlideTransforms(scrollYProgress: MotionValue<number>, totalSlides: number): Array<{ y: MotionValue<string> }> {
  return useMemo(() => {
    const transforms = []
    for (let i = 0; i < totalSlides; i++) {
      const startY = i === 0 ? '0vh' : '100vh'
      transforms.push({
        y: useTransform(
          scrollYProgress,
          [i / totalSlides, (i + 1) / totalSlides],
          [startY, '0vh']
        )
      })
    }
    return transforms
  }, [scrollYProgress, totalSlides])
}

const scrollToSection = (section?: 'case-studies' | 'contact') => {
  sessionStorage.setItem('scrollTarget', section || 'case-studies')
  sessionStorage.setItem('shouldScroll', 'true')
  window.location.href = '/'
}

// Add the TOC sections data
const tocSections = [
  {
    title: 'Introduction',
    slides: '3-4',
    items: [
      { title: 'Objectives', slides: '5' }
    ]
  },
  {
    title: 'Market Research',
    slides: '6-15',
    items: [
      { title: 'Secondary Research', slides: '6-8' },
      { title: 'Primary Research', slides: '9-15' }
    ]
  },
  {
    title: 'UX Research',
    slides: '16-28',
    items: [
      { title: 'Research Process', slides: '16-22' },
      { title: 'Insights and Journey Mapping', slides: '23-28' }
    ]
  },
  {
    title: 'Branding and UI/UX',
    slides: '29-32'
  }
]

export default function ValaHeritageCase() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [currentSlide, setCurrentSlide] = useState(1)
  const [showUI, setShowUI] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mouseTimeout, setMouseTimeout] = useState<NodeJS.Timeout>()
  const containerRef = useRef<HTMLDivElement>(null)
  const totalSlides = 33

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start", "end start"]
  })

  const transforms = useSlideTransforms(scrollYProgress, totalSlides)

  // Add loading effect on mount
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }, [])

  // Handle mouse movement
  useEffect(() => {
    if (isMobile) {
      setShowUI(false)
      return
    }

    const handleMouseMove = () => {
      const tocElement = document.querySelector('.table-of-contents')
      const isOverToc = tocElement?.matches(':hover')

      if (isOverToc) {
        setShowUI(true)
        if (mouseTimeout) {
          clearTimeout(mouseTimeout)
          setMouseTimeout(undefined)
        }
        return
      }

      setShowUI(true)
      if (mouseTimeout) clearTimeout(mouseTimeout)
      const timeout = setTimeout(() => setShowUI(false), 2000)
      setMouseTimeout(timeout)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (mouseTimeout) clearTimeout(mouseTimeout)
    }
  }, [mouseTimeout, isMobile])

  // Update current slide based on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', value => {
      const slideNumber = Math.ceil(value * totalSlides)
      setCurrentSlide(Math.min(Math.max(slideNumber, 1), totalSlides))
    })
    return () => unsubscribe()
  }, [scrollYProgress, totalSlides])

  // Add this after the other useEffect hooks
  useEffect(() => {
    const previewContainer = document.querySelector('.preview-scroll')
    if (previewContainer) {
      const scrollToCurrentSlide = () => {
        const slideElement = previewContainer.children[currentSlide - 1] as HTMLElement
        if (slideElement) {
          slideElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
        }
      }
      scrollToCurrentSlide()
    }
  }, [currentSlide])

  const scrollToSlide = (slideNumber: number) => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPerSlide = scrollHeight / totalSlides
    const targetScroll = (slideNumber - 1) * scrollPerSlide
    
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    })
  }

  return (
    <>
      <OrientationWarning />
      <ProjectSwitcher currentProject="Vala Heritage" />
      
      {/* Loading Screen */}
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
              <h1 className="font-alice text-3xl text-[#333333] mb-4">
                Vala Heritage
              </h1>
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

      <motion.div 
        ref={containerRef}
        className="relative bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Progress Bar */}
        <motion.div 
          className="fixed top-0 left-0 w-full h-1 bg-[#FF6B00]/20 z-[60]"
          initial={false}
        >
          <motion.div
            className="h-full bg-[#FF6B00]"
            style={{ width: `${(currentSlide / totalSlides) * 100}%` }}
          />
        </motion.div>

        {/* Desktop UI */}
        {!isMobile && (
          <>
            <motion.div 
              className="fixed top-0 left-0 w-full z-[80] bg-white/80 backdrop-blur-xl shadow-lg"
              initial={{ y: -200 }}
              animate={{ y: showUI ? 0 : -200 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full px-12 py-8">
                <Navbar />
              </div>
              <div className="w-full px-8 pb-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="font-alice text-2xl text-[#333333]">
                    Vala Heritage
                  </h1>
                  <span className="font-alice text-lg text-gray-500">2020</span>
                </div>

                <div className="flex justify-between items-center mt-4">
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
                  <div className="font-alice text-lg">
                    {currentSlide}/{totalSlides}
                  </div>
                </div>
              </div>
            </motion.div>

            <TableOfContents 
              currentSlide={currentSlide}
              showUI={showUI}
              sections={tocSections}
              scrollToSlide={scrollToSlide}
              setShowUI={setShowUI}
            />

            {/* Desktop Preview Panel */}
            <div className="fixed right-8 top-1/2 -translate-y-1/2 z-[80]">
              <motion.div
                className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg p-4 w-48"
                initial={{ x: 300 }}
                animate={{ x: showUI ? 0 : 300 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="font-alice text-lg text-[#333333]">
                      Slide Preview
                    </span>
                    <span className="font-alice text-sm text-gray-500">
                      {currentSlide}/{totalSlides}
                    </span>
                  </div>
                  <div className="relative h-1 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-[#FF6B00]"
                      style={{ width: `${(currentSlide / totalSlides) * 100}%` }}
                    />
                  </div>
                  <div 
                    className="flex gap-2 mt-2 overflow-x-auto pb-2 snap-x snap-mandatory preview-scroll"
                  >
                    {[...Array(4)].map((_, i) => {
                      const slideNum = currentSlide + i - 1
                      if (slideNum < 1 || slideNum > totalSlides) {
                        return (
                          <div
                            key={i}
                            className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100"
                          />
                        )
                      }
                      return (
                        <button
                          key={i}
                          className={`relative aspect-[4/3] rounded-lg overflow-hidden ${
                            slideNum === currentSlide ? 'ring-2 ring-[#FF6B00]' : ''
                          }`}
                          onClick={() => scrollToSlide(slideNum)}
                        >
                          <img
                            src={`/Vala/${slideNum}.png`}
                            alt={`Slide ${slideNum}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* Mobile Controls */}
        {isMobile && (
          <MobileControls
            onBack={() => scrollToSection('case-studies')}
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            tocSections={tocSections}
            scrollToSlide={scrollToSlide}
            imagePath="/Vala"
          />
        )}

        {/* Slides Container */}
        <div className="fixed inset-0 w-full h-screen">
          {[...Array(totalSlides)].map((_, index) => {
            const slideNumber = index + 1
            const isInView = Math.abs(currentSlide - slideNumber) <= 2
            if (!isInView) return null

            return (
              <motion.div
                key={slideNumber}
                className="absolute inset-0 w-full h-full"
                style={{
                  y: transforms[index].y,
                  zIndex: index,
                  willChange: 'transform'
                }}
                initial={false}
              >
                <div className="w-full h-full flex items-center justify-center bg-white">
                  <img
                    src={`/Vala/${slideNumber}.png`}
                    alt={`Slide ${slideNumber}`}
                    className="max-w-full max-h-full object-contain"
                    loading="eager"
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Spacer for scrolling */}
        <div style={{ 
          height: `${(totalSlides + 0.5) * 100}vh`,
          minHeight: `${totalSlides * 97}px`
        }} />
      </motion.div>
    </>
  )
} 