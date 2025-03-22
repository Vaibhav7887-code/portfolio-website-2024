'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMediaQuery } from '@/hooks/useMediaQuery'

interface TOCItem {
  title: string
  slides: string
  items?: { title: string; slides: string }[]
}

interface TableOfContentsProps {
  currentSlide: number
  showUI: boolean
  sections: TOCItem[]
  scrollToSlide: (slideNumber: number) => void
  setShowUI: (show: boolean) => void
}

export default function TableOfContents({ currentSlide, showUI, sections, scrollToSlide, setShowUI }: TableOfContentsProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [expandedSection, setExpandedSection] = useState<number | null>(null)

  // Find current section based on slide number
  useEffect(() => {
    const currentSectionIndex = sections.findIndex((section, index) => {
      const startSlide = Number(section.slides.split('-')[0])
      const endSlide = Number(section.slides.split('-')[1]) || startSlide
      
      // Check if current slide is within this section's range
      if (currentSlide >= startSlide && currentSlide <= endSlide) {
        return true
      }

      // Check if current slide is between this section and the next
      const nextSection = sections[index + 1]
      if (nextSection) {
        const nextStartSlide = Number(nextSection.slides.split('-')[0])
        return currentSlide >= startSlide && currentSlide < nextStartSlide
      }

      return false
    })

    // Only update expanded section if it's different from current
    if (currentSectionIndex !== -1 && currentSectionIndex !== expandedSection) {
      setExpandedSection(currentSectionIndex)
    }
  }, [currentSlide, sections])

  // Helper function to check if item is current
  const isItemCurrent = (slideRange: string) => {
    const [start, end] = slideRange.split('-').map(Number)
    return currentSlide >= start && currentSlide <= (end || start)
  }

  // Handle section click
  const handleSectionClick = (section: TOCItem, index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (section.items) {
      // For sections with subsections, toggle expansion
      setExpandedSection(expandedSection === index ? null : index);
    } else {
      // For sections without subsections, navigate and close
      const slideNumber = Number(section.slides.split('-')[0]);
      scrollToSlide(slideNumber);
      setShowUI(false);
    }
  };

  // Handle subsection click
  const handleSubsectionClick = (slideNumber: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    scrollToSlide(slideNumber);
    setShowUI(false);
  };

  if (isMobile) return null

  return (
    <motion.div
      className="fixed left-8 bottom-8 z-[90] bg-white/80 backdrop-blur-xl shadow-lg w-[300px] rounded-lg p-4 table-of-contents"
      initial={{ x: -350 }}
      animate={{ x: showUI ? 0 : -350 }}
      exit={{ x: -350 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="font-alice text-lg mb-4 text-[#333333]">Table of Contents</h3>
      <div className="space-y-2 max-h-[60vh] overflow-y-auto">
        {sections.map((section, index) => (
          <div key={index} className="border-b border-gray-100 last:border-0 pb-2">
            <button
              className={`w-full text-left font-opensans text-sm ${
                isItemCurrent(section.slides) ? 'text-[#FF6B00]' : 'text-gray-700'
              } hover:text-[#FF6B00] transition-colors font-bold`}
              onClick={(e) => handleSectionClick(section, index, e)}
            >
              <span>{section.title}</span>
            </button>
            
            <AnimatePresence>
              {expandedSection === index && section.items && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pl-4 mt-2 space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <button
                        key={itemIndex}
                        className={`w-full text-left text-sm ${
                          isItemCurrent(item.slides) ? 'text-[#FF6B00]' : 'text-gray-600'
                        } hover:text-[#FF6B00] transition-colors`}
                        onClick={(e) => handleSubsectionClick(Number(item.slides.split('-')[0]), e)}
                      >
                        <span className="text-xs">{item.title}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  )
} 