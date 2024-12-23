'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface Slide {
  id: number
  content: string
  bgColor?: string
}

interface PageProps {
  params: { id: string }
}

const caseStudies = {
  'project1': {
    title: 'Project One',
    slides: [
      { id: 1, content: 'Slide 1', bgColor: '#ffffff' },
      { id: 2, content: 'Slide 2', bgColor: '#f8f8f8' },
    ]
  }
}

export default function CaseStudyPage({ params }: PageProps) {
  const [isPresentationMode, setIsPresentationMode] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()
  
  const { id } = params
  const caseStudy = caseStudies[id as keyof typeof caseStudies]

  if (!caseStudy) {
    router.push('/404')
    return null
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPresentationMode) return
      
      if (e.key === 'ArrowRight') {
        setCurrentSlide(prev => 
          prev < caseStudy.slides.length - 1 ? prev + 1 : prev
        )
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide(prev => prev > 0 ? prev - 1 : prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPresentationMode, caseStudy?.slides?.length])

  return (
    <div className="relative">
      {/* Mode Toggle */}
      <button
        onClick={() => setIsPresentationMode(prev => !prev)}
        className="fixed top-8 right-8 z-50 bg-white rounded-full p-4 shadow-lg"
      >
        {isPresentationMode ? 'Scroll Mode' : 'Presentation Mode'}
      </button>

      {/* Progress Bar */}
      {isPresentationMode && (
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-40">
          <motion.div
            className="h-full bg-[#FF6B00]"
            initial={{ width: '0%' }}
            animate={{ 
              width: `${((currentSlide + 1) / caseStudy.slides.length) * 100}%` 
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Navigation Arrows in Presentation Mode */}
      {isPresentationMode && (
        <>
          <button
            onClick={() => setCurrentSlide(prev => prev > 0 ? prev - 1 : prev)}
            className="fixed left-8 top-1/2 -translate-y-1/2 z-50"
            disabled={currentSlide === 0}
          >
            ←
          </button>
          <button
            onClick={() => setCurrentSlide(prev => 
              prev < caseStudy.slides.length - 1 ? prev + 1 : prev
            )}
            className="fixed right-8 top-1/2 -translate-y-1/2 z-50"
            disabled={currentSlide === caseStudy.slides.length - 1}
          >
            →
          </button>
        </>
      )}

      {/* Slides Container */}
      <div className={isPresentationMode ? 'h-screen overflow-hidden' : ''}>
        {isPresentationMode ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="h-screen"
              style={{ backgroundColor: caseStudy.slides[currentSlide].bgColor }}
            >
              {caseStudy.slides[currentSlide].content}
            </motion.div>
          </AnimatePresence>
        ) : (
          // Scroll Mode
          <div className="min-h-screen">
            {caseStudy.slides.map((slide) => (
              <div 
                key={slide.id}
                className="min-h-screen"
                style={{ backgroundColor: slide.bgColor }}
              >
                {slide.content}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 