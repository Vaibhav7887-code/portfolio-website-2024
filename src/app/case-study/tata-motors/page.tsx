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

const tocSections = [
  {
    title: 'Introduction',
    slides: '1-11',
    items: [
      { title: 'About FleetEdge', slides: '1-6' },
      { title: 'Project Impact', slides: '7' },
      { title: 'Team', slides: '8' },
      { title: 'Overview', slides: '9' },
      { title: 'Problem Statement', slides: '10' },
      { title: 'Objectives', slides: '11' }
    ]
  },
  {
    title: 'Step 1: Increase User Engagement',
    slides: '12-21',
    items: [
      { title: 'Breakdown of Problem', slides: '13-14' },
      { title: 'Data Driven UX Improvements', slides: '15-21' }
    ]
  },
  {
    title: 'Step 2: Design Competitive Features',
    slides: '22-26',
    items: [
      { title: 'Competitor Benchmarking', slides: '23-25' },
      { title: 'Inclusivity & Accessibility', slides: '26' }
    ]
  },
  {
    title: 'Step 3: Complex Webapp to Mobile App',
    slides: '27-34',
    items: [
      { title: 'Problem Statement', slides: '28' },
      { title: 'Example Reworks', slides: '29-30' },
      { title: 'AI Integration', slides: '31' },
      { title: 'Enhancements and UX Audit', slides: '32' },
      { title: 'Accessibility', slides: '33' }
    ]
  },
  {
    title: 'Step 4: Seamless Exchange',
    slides: '35-44',
    items: [
      { title: 'Designing an Ecosystem', slides: '36' },
      { title: 'UX Research', slides: '37-40' },
      { title: 'Snapshot of Ecosystem', slides: '41-44' }
    ]
  },
  {
    title: 'Step 5: Monetising the Platform',
    slides: '45-54',
    items: [
      { title: 'Breaking Down Complexities', slides: '46-49' },
      { title: 'The Marketplace Experiment', slides: '50-52' },
      { title: 'Advocating for Users', slides: '53-54' }
    ]
  },
  {
    title: 'Step 6: Streamline Process',
    slides: '55-58',
    items: [
      { title: 'Our Workflow', slides: '56' },
      { title: 'Design Library', slides: '57-58' }
    ]
  },
  {
    title: 'Results',
    slides: '59-62',
    items: [
      { title: 'Turn Around of Metrics', slides: '59-60' },
      { title: 'Feedback and Reviews', slides: '61-62' }
    ]
  }
]

function useSlideTransforms(scrollYProgress: MotionValue<number>, totalSlides: number): Array<{ y: MotionValue<string> }> {
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
  const slideTransform33 = useTransform(scrollYProgress, [33/totalSlides, 34/totalSlides], ['100vh', '0vh'])
  const slideTransform34 = useTransform(scrollYProgress, [34/totalSlides, 35/totalSlides], ['100vh', '0vh'])
  const slideTransform35 = useTransform(scrollYProgress, [35/totalSlides, 36/totalSlides], ['100vh', '0vh'])
  const slideTransform36 = useTransform(scrollYProgress, [36/totalSlides, 37/totalSlides], ['100vh', '0vh'])
  const slideTransform37 = useTransform(scrollYProgress, [37/totalSlides, 38/totalSlides], ['100vh', '0vh'])
  const slideTransform38 = useTransform(scrollYProgress, [38/totalSlides, 39/totalSlides], ['100vh', '0vh'])
  const slideTransform39 = useTransform(scrollYProgress, [39/totalSlides, 40/totalSlides], ['100vh', '0vh'])
  const slideTransform40 = useTransform(scrollYProgress, [40/totalSlides, 41/totalSlides], ['100vh', '0vh'])
  const slideTransform41 = useTransform(scrollYProgress, [41/totalSlides, 42/totalSlides], ['100vh', '0vh'])
  const slideTransform42 = useTransform(scrollYProgress, [42/totalSlides, 43/totalSlides], ['100vh', '0vh'])
  const slideTransform43 = useTransform(scrollYProgress, [43/totalSlides, 44/totalSlides], ['100vh', '0vh'])
  const slideTransform44 = useTransform(scrollYProgress, [44/totalSlides, 45/totalSlides], ['100vh', '0vh'])
  const slideTransform45 = useTransform(scrollYProgress, [45/totalSlides, 46/totalSlides], ['100vh', '0vh'])
  const slideTransform46 = useTransform(scrollYProgress, [46/totalSlides, 47/totalSlides], ['100vh', '0vh'])
  const slideTransform47 = useTransform(scrollYProgress, [47/totalSlides, 48/totalSlides], ['100vh', '0vh'])
  const slideTransform48 = useTransform(scrollYProgress, [48/totalSlides, 49/totalSlides], ['100vh', '0vh'])
  const slideTransform49 = useTransform(scrollYProgress, [49/totalSlides, 50/totalSlides], ['100vh', '0vh'])
  const slideTransform50 = useTransform(scrollYProgress, [50/totalSlides, 51/totalSlides], ['100vh', '0vh'])
  const slideTransform51 = useTransform(scrollYProgress, [51/totalSlides, 52/totalSlides], ['100vh', '0vh'])
  const slideTransform52 = useTransform(scrollYProgress, [52/totalSlides, 53/totalSlides], ['100vh', '0vh'])
  const slideTransform53 = useTransform(scrollYProgress, [53/totalSlides, 54/totalSlides], ['100vh', '0vh'])
  const slideTransform54 = useTransform(scrollYProgress, [54/totalSlides, 55/totalSlides], ['100vh', '0vh'])
  const slideTransform55 = useTransform(scrollYProgress, [55/totalSlides, 56/totalSlides], ['100vh', '0vh'])
  const slideTransform56 = useTransform(scrollYProgress, [56/totalSlides, 57/totalSlides], ['100vh', '0vh'])
  const slideTransform57 = useTransform(scrollYProgress, [57/totalSlides, 58/totalSlides], ['100vh', '0vh'])
  const slideTransform58 = useTransform(scrollYProgress, [58/totalSlides, 59/totalSlides], ['100vh', '0vh'])
  const slideTransform59 = useTransform(scrollYProgress, [59/totalSlides, 60/totalSlides], ['100vh', '0vh'])
  const slideTransform60 = useTransform(scrollYProgress, [60/totalSlides, 61/totalSlides], ['100vh', '0vh'])
  const slideTransform61 = useTransform(scrollYProgress, [61/totalSlides, 62/totalSlides], ['100vh', '0vh'])

  return useMemo(() => [
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
    { y: slideTransform30 }, { y: slideTransform31 }, { y: slideTransform32 },
    { y: slideTransform33 }, { y: slideTransform34 }, { y: slideTransform35 },
    { y: slideTransform36 }, { y: slideTransform37 }, { y: slideTransform38 },
    { y: slideTransform39 }, { y: slideTransform40 }, { y: slideTransform41 },
    { y: slideTransform42 }, { y: slideTransform43 }, { y: slideTransform44 },
    { y: slideTransform45 }, { y: slideTransform46 }, { y: slideTransform47 },
    { y: slideTransform48 }, { y: slideTransform49 }, { y: slideTransform50 },
    { y: slideTransform51 }, { y: slideTransform52 }, { y: slideTransform53 },
    { y: slideTransform54 }, { y: slideTransform55 }, { y: slideTransform56 },
    { y: slideTransform57 }, { y: slideTransform58 }, { y: slideTransform59 },
    { y: slideTransform60 }, { y: slideTransform61 }
  ], [
    slideTransform0, slideTransform1, slideTransform2, slideTransform3,
    slideTransform4, slideTransform5, slideTransform6, slideTransform7,
    slideTransform8, slideTransform9, slideTransform10, slideTransform11,
    slideTransform12, slideTransform13, slideTransform14, slideTransform15,
    slideTransform16, slideTransform17, slideTransform18, slideTransform19,
    slideTransform20, slideTransform21, slideTransform22, slideTransform23,
    slideTransform24, slideTransform25, slideTransform26, slideTransform27,
    slideTransform28, slideTransform29, slideTransform30, slideTransform31,
    slideTransform32, slideTransform33, slideTransform34, slideTransform35,
    slideTransform36, slideTransform37, slideTransform38, slideTransform39,
    slideTransform40, slideTransform41, slideTransform42, slideTransform43,
    slideTransform44, slideTransform45, slideTransform46, slideTransform47,
    slideTransform48, slideTransform49, slideTransform50, slideTransform51,
    slideTransform52, slideTransform53, slideTransform54, slideTransform55,
    slideTransform56, slideTransform57, slideTransform58, slideTransform59,
    slideTransform60, slideTransform61
  ])
}

const scrollToSection = (section?: 'case-studies' | 'contact') => {
  sessionStorage.setItem('scrollTarget', section || 'case-studies')
  sessionStorage.setItem('shouldScroll', 'true')
  window.location.href = '/'
}

export default function TataMotorsCase() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [currentSlide, setCurrentSlide] = useState(1)
  const [showUI, setShowUI] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mouseTimeout, setMouseTimeout] = useState<NodeJS.Timeout>()
  const containerRef = useRef<HTMLDivElement>(null)
  const totalSlides = 62

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
      <ProjectSwitcher currentProject="Tata Motors" />
      
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
                Tata Motors - FleetEdge
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
                    Tata Motors - FleetEdge
                  </h1>
                  <span className="font-alice text-lg text-gray-500">2022</span>
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
                            src={`/Tata Motors - Fleetedge/Portfolio presentation_Vaibhav (2)-${String(
                              slideNum + 5
                            ).padStart(2, '0')}.png`}
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
            imagePath="/Tata Motors - Fleetedge"
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
                    src={`/Tata Motors - Fleetedge/Portfolio presentation_Vaibhav (2)-${String(
                      slideNumber + 5
                    ).padStart(2, '0')}.png`}
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