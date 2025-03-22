'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import TableOfContents from '@/components/TableOfContents'
import OrientationWarning from '@/components/OrientationWarning'
import MobileControls from '@/components/MobileControls'
import ProjectSwitcher from '@/components/ProjectSwitcher'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import CaseStudyControls from '@/components/CaseStudyControls'

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
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const totalSlides = 33

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start", "end start"]
  })

  // Create individual transforms for each slide
  const slideTransform0 = useTransform(scrollYProgress, [0, 1/totalSlides], ['0vh', '0vh'])
  const slideTransform1 = useTransform(scrollYProgress, [1/totalSlides, 2/totalSlides], ['100vh', '0vh'])
  const slideTransform2 = useTransform(scrollYProgress, [2/totalSlides, 3/totalSlides], ['100vh', '0vh'])
  const slideTransform3 = useTransform(scrollYProgress, [3/totalSlides, 4/totalSlides], ['100vh', '0vh'])
  const slideTransform4 = useTransform(scrollYProgress, [4/totalSlides, 5/totalSlides], ['100vh', '0vh'])
  const slideTransform5 = useTransform(scrollYProgress, [5/totalSlides, 6/totalSlides], ['100vh', '0vh'])
  const slideTransform6 = useTransform(scrollYProgress, [6/totalSlides, 7/totalSlides], ['100vh', '0vh'])
  const slideTransform7 = useTransform(scrollYProgress, [7/totalSlides, 8/totalSlides], ['100vh', '0vh'])
  const slideTransform8 = useTransform(scrollYProgress, [8/totalSlides, 9/totalSlides], ['100vh', '0vh'])
  const slideTransform9 = useTransform(scrollYProgress, [9/totalSlides, 10/totalSlides], ['100vh', '0vh'])
  const slideTransform10 = useTransform(scrollYProgress, [10/totalSlides, 11/totalSlides], ['100vh', '0vh'])
  const slideTransform11 = useTransform(scrollYProgress, [11/totalSlides, 12/totalSlides], ['100vh', '0vh'])
  const slideTransform12 = useTransform(scrollYProgress, [12/totalSlides, 13/totalSlides], ['100vh', '0vh'])
  const slideTransform13 = useTransform(scrollYProgress, [13/totalSlides, 14/totalSlides], ['100vh', '0vh'])
  const slideTransform14 = useTransform(scrollYProgress, [14/totalSlides, 15/totalSlides], ['100vh', '0vh'])
  const slideTransform15 = useTransform(scrollYProgress, [15/totalSlides, 16/totalSlides], ['100vh', '0vh'])
  const slideTransform16 = useTransform(scrollYProgress, [16/totalSlides, 17/totalSlides], ['100vh', '0vh'])
  const slideTransform17 = useTransform(scrollYProgress, [17/totalSlides, 18/totalSlides], ['100vh', '0vh'])
  const slideTransform18 = useTransform(scrollYProgress, [18/totalSlides, 19/totalSlides], ['100vh', '0vh'])
  const slideTransform19 = useTransform(scrollYProgress, [19/totalSlides, 20/totalSlides], ['100vh', '0vh'])
  const slideTransform20 = useTransform(scrollYProgress, [20/totalSlides, 21/totalSlides], ['100vh', '0vh'])
  const slideTransform21 = useTransform(scrollYProgress, [21/totalSlides, 22/totalSlides], ['100vh', '0vh'])
  const slideTransform22 = useTransform(scrollYProgress, [22/totalSlides, 23/totalSlides], ['100vh', '0vh'])
  const slideTransform23 = useTransform(scrollYProgress, [23/totalSlides, 24/totalSlides], ['100vh', '0vh'])
  const slideTransform24 = useTransform(scrollYProgress, [24/totalSlides, 25/totalSlides], ['100vh', '0vh'])
  const slideTransform25 = useTransform(scrollYProgress, [25/totalSlides, 26/totalSlides], ['100vh', '0vh'])
  const slideTransform26 = useTransform(scrollYProgress, [26/totalSlides, 27/totalSlides], ['100vh', '0vh'])
  const slideTransform27 = useTransform(scrollYProgress, [27/totalSlides, 28/totalSlides], ['100vh', '0vh'])
  const slideTransform28 = useTransform(scrollYProgress, [28/totalSlides, 29/totalSlides], ['100vh', '0vh'])
  const slideTransform29 = useTransform(scrollYProgress, [29/totalSlides, 30/totalSlides], ['100vh', '0vh'])
  const slideTransform30 = useTransform(scrollYProgress, [30/totalSlides, 31/totalSlides], ['100vh', '0vh'])
  const slideTransform31 = useTransform(scrollYProgress, [31/totalSlides, 32/totalSlides], ['100vh', '0vh'])
  const slideTransform32 = useTransform(scrollYProgress, [32/totalSlides, 33/totalSlides], ['100vh', '0vh'])

  // Map transforms to slides
  const transforms = useMemo(() => [
    { y: slideTransform0 }, { y: slideTransform1 }, { y: slideTransform2 },
    { y: slideTransform3 }, { y: slideTransform4 }, { y: slideTransform5 },
    { y: slideTransform6 }, { y: slideTransform7 }, { y: slideTransform8 },
    { y: slideTransform9 }, { y: slideTransform10 }, { y: slideTransform11 },
    { y: slideTransform12 }, { y: slideTransform13 }, { y: slideTransform14 },
    { y: slideTransform15 }, { y: slideTransform16 }, { y: slideTransform17 },
    { y: slideTransform18 }, { y: slideTransform19 }, { y: slideTransform20 },
    { y: slideTransform21 }, { y: slideTransform22 }, { y: slideTransform23 },
    { y: slideTransform24 }, { y: slideTransform25 }, { y: slideTransform26 },
    { y: slideTransform27 }, { y: slideTransform28 }, { y: slideTransform29 },
    { y: slideTransform30 }, { y: slideTransform31 }, { y: slideTransform32 }
  ], [
    slideTransform0, slideTransform1, slideTransform2, slideTransform3,
    slideTransform4, slideTransform5, slideTransform6, slideTransform7,
    slideTransform8, slideTransform9, slideTransform10, slideTransform11,
    slideTransform12, slideTransform13, slideTransform14, slideTransform15,
    slideTransform16, slideTransform17, slideTransform18, slideTransform19,
    slideTransform20, slideTransform21, slideTransform22, slideTransform23,
    slideTransform24, slideTransform25, slideTransform26, slideTransform27,
    slideTransform28, slideTransform29, slideTransform30, slideTransform31,
    slideTransform32
  ])

  // Add loading effect on mount
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }, [])

  // Update current slide based on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', value => {
      const slideNumber = Math.ceil(value * totalSlides)
      setCurrentSlide(Math.min(Math.max(slideNumber, 1), totalSlides))
    })
    return () => unsubscribe()
  }, [scrollYProgress, totalSlides])

  const scrollToSlide = (slideNumber: number) => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    const targetScroll = (scrollHeight * (slideNumber - 1)) / (totalSlides - 1)
    window.scrollTo({ top: targetScroll, behavior: 'smooth' })
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
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="font-alice text-3xl text-[#333333] mb-4">Vala Heritage</h1>
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
          <CaseStudyControls
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            tocSections={tocSections}
            scrollToSlide={scrollToSlide}
            onBack={() => scrollToSection('case-studies')}
            projectTitle="Vala Heritage"
            projectYear="2020"
            imagePath="/Vala"
          />
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
          minHeight: '6000px'
        }} />
      </motion.div>
    </>
  )
} 