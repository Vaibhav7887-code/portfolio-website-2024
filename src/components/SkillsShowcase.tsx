'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface Skill {
  name: string
  color: string
  description: string
  image: string
}

const skills: Skill[] = [
  { 
    name: 'UX', 
    color: '#FF6B00', 
    description: 'User flows & wireframes',
    image: '/Tata Motors - Fleetedge/Portfolio presentation_Vaibhav (2)-21.png'
  },
  { 
    name: 'UI', 
    color: '#FF8533', 
    description: 'Visual design systems',
    image: '/Visa/13.png'
  },
  { 
    name: 'Research', 
    color: '#FF9E66', 
    description: 'User insights & data',
    image: '/Vala/13.png'
  },
  { 
    name: 'Motion', 
    color: '#FFB899', 
    description: 'Motion graphics & animations',
    image: '/Motion.jpg'
  },
  { 
    name: 'Photography', 
    color: '#FFD1B3', 
    description: 'Visual storytelling',
    image: '/Photography/8.jpg'
  },
  { 
    name: 'Illustration', 
    color: '#FFEAD1', 
    description: 'Digital artwork',
    image: '/Illustration/3.png'
  }
]

const OVERLAY_OFFSET = 250

// Desktop Component
function DesktopSkills() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [activeSkillIndex, setActiveSkillIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.matchMedia('(max-width: 768px)').matches
      const landscape = window.matchMedia('(orientation: landscape) and (max-height: 450px)').matches
      setIsMobile(mobile || landscape)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isMobile) return
    setMousePosition({ 
      x: e.clientX,
      y: e.clientY - OVERLAY_OFFSET
    })
  }, [isMobile])

  const handleSkillHover = useCallback((skillName: string) => {
    if (isMobile) return
    setHoveredSkill(skillName)
    const newIndex = skills.findIndex(s => s.name === skillName)
    if (newIndex !== -1) setActiveSkillIndex(newIndex)
  }, [isMobile])

  useEffect(() => {
    if (hoveredSkill || isMobile) return

    const interval = setInterval(() => {
      setActiveSkillIndex((prev) => (prev + 1) % skills.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [hoveredSkill, isMobile])

  return (
    <div 
      className="relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => !isMobile && setHoveredSkill(null)}
    >
      <div className="flex flex-wrap gap-4 sm:gap-8 items-center justify-center font-opensans text-sm md:text-lg lg:text-xl tracking-wider">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            className={`relative transition-colors py-2 px-3 sm:px-4 group`}
            onMouseEnter={() => handleSkillHover(skill.name)}
            style={{
              color: !isMobile && (hoveredSkill === skill.name || (!hoveredSkill && index === activeSkillIndex)) 
                ? '#FF6B00' 
                : undefined,
              fontWeight: !isMobile && (hoveredSkill === skill.name || (!hoveredSkill && index === activeSkillIndex))
                ? '700'
                : '400'
            }}
            animate={{
              scale: !isMobile && (hoveredSkill === skill.name || (!hoveredSkill && index === activeSkillIndex)) ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            {skill.name}
            {!isMobile && (
              <motion.div
                className="absolute inset-0 rounded-lg border-2 border-[#FF6B00] opacity-0 hidden sm:block group-hover:opacity-20"
                initial={false}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0, 0.2, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
            )}
            <AnimatePresence mode="wait">
              {!isMobile && (hoveredSkill === skill.name || (!hoveredSkill && index === activeSkillIndex)) && (
                <motion.div
                  className="absolute bottom-0 left-1/2 w-1 h-1 bg-[#FF6B00] rounded-full"
                  initial={{ opacity: 0, x: '-50%', scale: 0 }}
                  animate={{ opacity: 1, x: '-50%', scale: 1 }}
                  exit={{ opacity: 0, x: '-50%', scale: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {hoveredSkill && !isMobile && (
          <motion.div
            className="fixed pointer-events-none"
            initial={{ 
              opacity: 0,
              scale: 0.9,
              x: mousePosition.x - 110,
              y: mousePosition.y,
              rotate: -10
            }}
            animate={{ 
              opacity: 1,
              scale: 1,
              x: mousePosition.x - 110,
              y: mousePosition.y,
              rotate: 0
            }}
            exit={{ 
              opacity: 0,
              scale: 0.9,
              rotate: 10
            }}
            transition={{ 
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 1
            }}
            style={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              zIndex: 9999
            }}
          >
            <div className="bg-white p-3 pb-6 rounded-lg shadow-lg w-[220px]">
              <motion.div 
                className="w-full h-[160px] mb-4 rounded-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-full h-full"
                  initial={{ scale: 1.2, rotate: -5 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    src={skills.find(s => s.name === hoveredSkill)?.image || ''}
                    alt={hoveredSkill || ''}
                    width={220}
                    height={160}
                    className="w-full h-full object-cover"
                    priority
                  />
                </motion.div>
              </motion.div>
              <motion.p 
                className="text-center text-sm font-opensans text-gray-700"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {skills.find(s => s.name === hoveredSkill)?.description}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function SkillsShowcase() {
  return (
    <>
      <DesktopSkills />
    </>
  )
} 