'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './Navbar'
import TableOfContents from './TableOfContents'

interface TOCSection {
  title: string
  slides: string
  items?: { title: string; slides: string }[]
}

interface CaseStudyControlsProps {
  currentSlide: number
  totalSlides: number
  tocSections: TOCSection[]
  scrollToSlide: (slideNumber: number) => void
  onBack: () => void
  projectTitle: string
  projectYear: string
  imagePath: string
}

export default function CaseStudyControls({
  currentSlide,
  totalSlides,
  tocSections,
  scrollToSlide,
  onBack,
  projectTitle,
  projectYear,
  imagePath
}: CaseStudyControlsProps) {
  const [showUI, setShowUI] = useState(false)

  // Floating button variants
  const buttonVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
    hover: { scale: 1.05 }
  }

  // Overlay variants
  const overlayVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  }

  return (
    <>
      {/* Back Button - Top Left */}
      <AnimatePresence>
        {!showUI && (
          <motion.button
            className="fixed top-6 left-6 w-12 h-12 bg-white/80 backdrop-blur-xl shadow-lg rounded-full flex items-center justify-center z-[90]"
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            whileHover="hover"
            onClick={onBack}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Toggle Overlay Button - Bottom Right */}
      <motion.button
        className="fixed bottom-6 right-6 w-12 h-12 bg-white/80 backdrop-blur-xl shadow-lg rounded-full flex items-center justify-center z-[90]"
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        onClick={() => setShowUI(!showUI)}
      >
        {!showUI ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 18L18 6M6 6L18 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </motion.button>

      {/* Overlay UI */}
      <AnimatePresence>
        {showUI && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 z-[85]"
              variants={overlayVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => setShowUI(false)}
            />

            {/* Top Navigation */}
            <motion.div 
              className="fixed top-0 left-0 w-full z-[90] bg-white/80 backdrop-blur-xl shadow-lg"
              initial={{ y: -200 }}
              animate={{ y: 0 }}
              exit={{ y: -200 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full px-12 py-8">
                <Navbar />
              </div>
              <div className="w-full px-8 pb-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="font-alice text-2xl text-[#333333]">
                    {projectTitle}
                  </h1>
                  <span className="font-alice text-lg text-gray-500">{projectYear}</span>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => {
                      onBack()
                      setShowUI(false)
                    }}
                    className="font-alice text-lg hover:text-[#FF6B00] transition-colors"
                  >
                    ← Back to Home
                  </button>
                  <div className="font-alice text-lg">
                    {currentSlide}/{totalSlides}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Table of Contents */}
            <TableOfContents 
              currentSlide={currentSlide}
              showUI={showUI}
              sections={tocSections}
              scrollToSlide={(slideNum) => {
                scrollToSlide(slideNum)
                setShowUI(false)
              }}
              setShowUI={setShowUI}
            />

            {/* Preview Panel */}
            <motion.div
              className="fixed right-8 top-1/2 -translate-y-1/2 z-[90] bg-white/80 backdrop-blur-xl rounded-lg shadow-lg p-4 w-48"
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
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

                    // Handle different image paths for each project
                    let imageSrc = ''
                    if (imagePath.includes('Tata Motors')) {
                      imageSrc = `${imagePath}/Portfolio presentation_Vaibhav (2)-${String(slideNum + 5).padStart(2, '0')}.png`
                    } else if (imagePath.includes('Photography')) {
                      imageSrc = `${imagePath}/${slideNum}.jpg`
                    } else {
                      imageSrc = `${imagePath}/${slideNum}.png`
                    }

                    return (
                      <button
                        key={i}
                        className={`relative aspect-[4/3] rounded-lg overflow-hidden ${
                          slideNum === currentSlide ? 'ring-2 ring-[#FF6B00]' : ''
                        }`}
                        onClick={() => {
                          scrollToSlide(slideNum)
                          setShowUI(false)
                        }}
                      >
                        <img
                          src={imageSrc}
                          alt={`Slide ${slideNum}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
} 