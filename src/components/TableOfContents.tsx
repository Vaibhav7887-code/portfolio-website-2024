'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMediaQuery } from '@/hooks/useMediaQuery'

interface TOCItem {
  title: string
  slides: string
  items?: Array<{
    title: string
    slides: string
  }>
}

interface TableOfContentsProps {
  currentSlide: number
  sections: TOCItem[]
  onSlideClick: (slideNumber: number) => void
}

export default function TableOfContents({ currentSlide, sections, onSlideClick }: TableOfContentsProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [expandedSection, setExpandedSection] = useState<number | null>(null)

  // Helper function to check if item is current
  const isItemCurrent = (slideRange: string) => {
    const [start, end] = slideRange.split('-').map(Number)
    return currentSlide >= start && currentSlide <= (end || start)
  }

  // Handle section click
  const handleSectionClick = (section: TOCItem, index: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (section.items) {
      // For sections with subsections, toggle expansion
      setExpandedSection(expandedSection === index ? null : index)
    } else {
      // For sections without subsections, navigate
      const slideNumber = Number(section.slides.split('-')[0])
      onSlideClick(slideNumber)
    }
  }

  // Handle subsection click
  const handleSubsectionClick = (slideNumber: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onSlideClick(slideNumber)
  }

  if (isMobile) return null

  return (
    <div className="space-y-2">
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
  )
} 