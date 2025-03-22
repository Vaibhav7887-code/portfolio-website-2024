'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TableOfContents from '@/components/TableOfContents'

interface TOCSection {
  title: string
  slides: string
  items?: Array<{
    title: string
    slides: string
  }>
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
  
  return (
    <>
      {/* Overlay Button */}
      <button
        onClick={() => setShowUI(true)}
        className="fixed top-4 right-4 z-[60] bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[70]"
            onClick={() => setShowUI(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setShowUI(false)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      onClick={onBack}
                      className="text-sm font-opensans text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 8H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 15L1 8L8 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Back to Case Studies
                    </button>
                  </div>
                  <div>
                    <h1 className="font-alice text-2xl text-[#333333] mb-1">{projectTitle}</h1>
                    <p className="text-sm font-opensans text-gray-500">{projectYear}</p>
                  </div>
                </div>

                {/* Table of Contents */}
                <div className="flex-1 overflow-y-auto p-6">
                  <TableOfContents
                    sections={tocSections}
                    currentSlide={currentSlide}
                    onSlideClick={(slideNumber) => {
                      scrollToSlide(slideNumber)
                      setShowUI(false)
                    }}
                  />
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={`${imagePath}/thumbnail.png`}
                        alt="Project thumbnail"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm font-opensans text-gray-700">{projectTitle}</p>
                        <p className="text-xs font-opensans text-gray-500">{projectYear}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-opensans text-gray-500">
                      <span>{currentSlide}</span>
                      <span>/</span>
                      <span>{totalSlides}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 