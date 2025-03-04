'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMediaQuery } from '../hooks/useMediaQuery'

type Section = 'case-studies' | 'contact'

interface NavItem {
  name: string
  section: Section
}

interface NavbarProps {
  isLandingPage?: boolean;
}

const projects = [
  { id: 'tata-motors', name: 'Tata Motors' },
  { id: 'visa-idfc', name: 'VISA/IDFC' },
  { id: 'vala-heritage', name: 'Vala Heritage' },
  { id: 'photography', name: 'Photography' },
  { id: 'illustrations', name: 'Illustrations' },
  { id: 'brand', name: 'Credixio' }
]

export default function Navbar({ isLandingPage = false }: NavbarProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout>()

  const handleMouseLeave = () => {
    if (!isMobile) {
      dropdownTimeoutRef.current = setTimeout(() => {
        setShowDropdown(false)
        setHoveredItem(null)
      }, 100)
    }
  }

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
    }
  }

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current)
      }
    }
  }, [])

  const scrollToSection = (section?: 'case-studies' | 'contact') => {
    sessionStorage.setItem('scrollTarget', section || 'case-studies')
    sessionStorage.setItem('shouldScroll', 'true')
    window.location.href = '/'
  }

  const navItems: NavItem[] = [
    { name: 'Case studies', section: 'case-studies' },
    { name: 'Contact', section: 'contact' }
  ]

  // Only hide navbar on mobile for non-landing pages
  if (!isLandingPage && isMobile) return null;

  return (
    <nav className={`${!isMobile && !isLandingPage ? 'fixed' : 'relative'} top-0 left-0 w-full z-50`}>
      <div className="flex justify-between items-center text-sm tracking-wider uppercase font-alice px-4 py-6 md:px-12 md:py-8">
        <button 
          onClick={() => scrollToSection()}
          className="hover:opacity-60 transition-opacity"
        >
          Vaibhav sharma
        </button>
        
        <div className="flex gap-6 md:gap-12">
          {navItems.map((item) => (
            <div 
              key={item.name} 
              className="relative"
              onMouseEnter={() => {
                if (!isMobile) {
                  setHoveredItem(item.name)
                  if (item.name === 'Case studies') {
                    setShowDropdown(true)
                  }
                }
              }}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => {
                  scrollToSection(item.section)
                  setShowDropdown(false)
                }}
                className="relative flex items-center gap-1"
              >
                {item.name}
                {item.name === 'Case studies' && !isMobile && (
                  <motion.svg 
                    width="10" 
                    height="6" 
                    viewBox="0 0 10 6" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    animate={{ rotate: showDropdown ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative top-[1px]"
                  >
                    <path 
                      d="M1 1L5 5L9 1" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                )}
                <AnimatePresence mode="wait">
                  {hoveredItem === item.name && !isMobile && (
                    <motion.div
                      className="absolute bg-black h-[2px] left-1/2 bottom-0"
                      initial={{ width: '4px', x: '-50%', opacity: 0 }}
                      animate={{ 
                        width: '100%',
                        x: '-50%',
                        opacity: 1,
                        transition: {
                          type: 'spring',
                          stiffness: 350,
                          damping: 15
                        }
                      }}
                      exit={{ 
                        width: '4px',
                        x: '-50%',
                        opacity: 0,
                        transition: { duration: 0.1 }
                      }}
                    />
                  )}
                </AnimatePresence>
              </button>

              {/* Dropdown Menu - Desktop Only */}
              {item.name === 'Case studies' && !isMobile && showDropdown && (
                <motion.div
                  className="absolute top-full left-0 mt-4 py-4 px-6 bg-white/80 backdrop-blur-md rounded-lg shadow-lg min-w-[200px]"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {projects.map((project) => (
                    <a
                      key={project.id}
                      href={
                        project.id === 'tata-motors' 
                          ? '/case-study/tata-motors' 
                          : project.id === 'visa-idfc'
                            ? '/case-study/visa-idfc'
                            : project.id === 'vala-heritage'
                              ? '/case-study/vala-heritage'
                              : project.id === 'photography'
                                ? '/case-study/photography'
                                : project.id === 'illustrations'
                                  ? '/case-study/illustrations'
                                  : '#'
                      }
                      onClick={(e) => {
                        if (!['tata-motors', 'visa-idfc', 'vala-heritage', 'photography', 'illustrations'].includes(project.id)) {
                          e.preventDefault()
                          scrollToSection('case-studies')
                        }
                      }}
                      className="block py-2 text-sm normal-case font-opensans text-gray-700 hover:text-[#FF6B00] transition-colors"
                    >
                      {project.name}
                    </a>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
          
          {/* Design System Link */}
          <div 
            className="relative"
            onMouseEnter={() => !isMobile && setHoveredItem('Design system')}
            onMouseLeave={handleMouseLeave}
          >
            <a
              href="https://design.system.vaibhav.design/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center"
            >
              Design system
              <AnimatePresence mode="wait">
                {hoveredItem === 'Design system' && !isMobile && (
                  <motion.div
                    className="absolute bg-black h-[2px] left-1/2 bottom-0"
                    initial={{ width: '4px', x: '-50%', opacity: 0 }}
                    animate={{ 
                      width: '100%',
                      x: '-50%',
                      opacity: 1,
                      transition: {
                        type: 'spring',
                        stiffness: 350,
                        damping: 15
                      }
                    }}
                    exit={{ 
                      width: '4px',
                      x: '-50%',
                      opacity: 0,
                      transition: { duration: 0.1 }
                    }}
                  />
                )}
              </AnimatePresence>
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
} 