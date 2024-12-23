'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MobileControlsProps {
  onBack: () => void
  currentSlide: number
  totalSlides: number
  tocSections: any[]
  scrollToSlide: (slideNumber: number) => void
  imagePath?: string
}

export default function MobileControls({ 
  onBack, 
  currentSlide, 
  totalSlides,
  tocSections,
  scrollToSlide,
  imagePath = '/slides'
}: MobileControlsProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [activePanel, setActivePanel] = useState<'overview' | 'preview' | null>(null)
  const lastScrollTime = useRef(Date.now())
  const timeoutId = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const handleScroll = () => {
      lastScrollTime.current = Date.now()
      setIsVisible(true)
      
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }

      timeoutId.current = setTimeout(() => {
        const timeSinceLastScroll = Date.now() - lastScrollTime.current
        if (timeSinceLastScroll > 1000 && !activePanel) {
          setIsVisible(false)
        }
      }, 1000)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }
    }
  }, [activePanel])

  // Show controls when panel is open
  useEffect(() => {
    if (activePanel) {
      setIsVisible(true)
    }
  }, [activePanel])

  useEffect(() => {
    const previewContainer = document.querySelector('.mobile-preview-scroll')
    if (previewContainer && activePanel === 'preview') {
      const scrollToCurrentSlide = () => {
        const slideElement = previewContainer.children[currentSlide - 1] as HTMLElement
        if (slideElement) {
          slideElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
        }
      }
      scrollToCurrentSlide()
    }
  }, [currentSlide, activePanel])

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  }

  const panelVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const getImagePath = (slideNumber: number) => {
    if (imagePath.includes('Tata Motors')) {
      const offset = 5
      return `${imagePath}/Portfolio presentation_Vaibhav (2)-${String(slideNumber + offset).padStart(2, '0')}.png`
    }
    if (imagePath.includes('Vala')) {
      return `${imagePath}/${slideNumber}.png`
    }
    return `${imagePath}/${slideNumber}${imagePath.includes('Photography') ? '.jpg' : '.png'}`
  }

  return (
    <div className="fixed inset-0 z-[90] pointer-events-none">
      {/* Floating Buttons */}
      <motion.div
        className="fixed inset-0 z-[90]"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Back Button - Top Left */}
        <motion.button
          className="fixed top-6 left-6 w-12 h-12 bg-white/80 backdrop-blur-xl shadow-lg rounded-full flex items-center justify-center pointer-events-auto"
          variants={buttonVariants}
          onClick={onBack}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>

        {/* Overview Button - Bottom Left */}
        <motion.button
          className="fixed bottom-6 left-6 w-12 h-12 bg-white/80 backdrop-blur-xl shadow-lg rounded-full flex items-center justify-center pointer-events-auto"
          variants={buttonVariants}
          onClick={() => {
            if (activePanel === 'overview') {
              setActivePanel(null)
            } else {
              setActivePanel('overview')
              setIsVisible(true)
            }
          }}
        >
          {activePanel === 'overview' ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6L18 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 6H20M4 12H20M4 18H20" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </motion.button>

        {/* Preview Button - Bottom Right */}
        <motion.button
          className="fixed bottom-6 right-6 w-12 h-12 bg-white/80 backdrop-blur-xl shadow-lg rounded-full flex items-center justify-center pointer-events-auto"
          variants={buttonVariants}
          onClick={() => {
            if (activePanel === 'preview') {
              setActivePanel(null)
            } else {
              setActivePanel('preview')
              setIsVisible(true)
            }
          }}
        >
          {activePanel === 'preview' ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6L18 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 9L12 3L3 9M21 15L12 21L3 15" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </motion.button>
      </motion.div>

      {/* Panels */}
      <AnimatePresence>
        {activePanel === 'overview' && (
          <motion.div
            className="fixed bottom-24 left-4 right-4 bg-white/80 backdrop-blur-xl rounded-lg shadow-lg p-4 z-[85] max-h-[70vh] overflow-y-auto pointer-events-auto"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={panelVariants}
          >
            <div className="space-y-4">
              {tocSections.map((section, index) => (
                <div key={index} className="border-b border-gray-100 last:border-0 pb-2">
                  <button
                    className="w-full text-left font-opensans text-sm text-gray-700 hover:text-[#FF6B00] transition-colors font-bold"
                    onClick={() => {
                      scrollToSlide(Number(section.slides.split('-')[0]))
                      setActivePanel(null)
                    }}
                  >
                    {section.title}
                  </button>
                  {section.items && (
                    <div className="pl-4 mt-2 space-y-2">
                      {section.items.map((item: any, itemIndex: number) => (
                        <button
                          key={itemIndex}
                          className="w-full text-left text-xs text-gray-600 hover:text-[#FF6B00] transition-colors"
                          onClick={() => {
                            scrollToSlide(Number(item.slides.split('-')[0]))
                            setActivePanel(null)
                          }}
                        >
                          {item.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activePanel === 'preview' && (
          <motion.div
            className="fixed bottom-24 left-4 right-4 bg-white/80 backdrop-blur-xl rounded-lg shadow-lg p-4 z-[85] max-h-[70vh] pointer-events-auto"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={panelVariants}
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
                className="flex gap-2 mt-2 overflow-x-auto pb-2 snap-x snap-mandatory mobile-preview-scroll"
                style={{ scrollbarWidth: 'none' }}
              >
                {[...Array(totalSlides)].map((_, i) => {
                  const slideNum = i + 1
                  return (
                    <button
                      key={i}
                      className={`relative aspect-[4/3] w-[calc(20%-8px)] flex-none snap-center ${
                        slideNum === currentSlide ? 'ring-2 ring-[#FF6B00]' : ''
                      }`}
                      onClick={() => {
                        scrollToSlide(slideNum)
                        setActivePanel(null)
                      }}
                    >
                      <img
                        src={getImagePath(slideNum)}
                        alt={`Slide ${slideNum}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 