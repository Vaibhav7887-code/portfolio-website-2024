'use client'
import { useState, useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  year?: string
  description: string
  color: string
  hoverColor: string
  size: 'large' | 'medium' | 'small'
  aspectRatio: string
  image: string | null
}

const projects: Project[] = [
  {
    id: 'tata-motors',
    title: 'Tata Motors',
    year: '2022',
    description: 'UX Design • UX Research • AI Integration',
    color: '#FF6B00',
    hoverColor: '#FFF4E6',
    size: 'large',
    aspectRatio: 'aspect-[16/9]',
    image: '/Tata Motors - Fleetedge/Portfolio presentation_Vaibhav (2)-06.png'
  },
  {
    id: 'visa-idfc',
    title: 'VISA/IDFC',
    year: '2021',
    description: 'UX Design • UX Research',
    color: '#FF8533',
    hoverColor: '#FFEAD1',
    size: 'medium',
    aspectRatio: 'aspect-[16/9]',
    image: '/Visa/1.png'
  },
  {
    id: 'vala-heritage',
    title: 'Vala Heritage',
    year: '2020',
    description: 'UX Design • UX Research • Brand Identity',
    color: '#FFB899',
    hoverColor: '#FFD1B3',
    size: 'medium',
    aspectRatio: 'aspect-[16/9]',
    image: '/Vala/1.png'
  },
  {
    id: 'photography',
    title: 'Photography',
    description: 'Digital Photography',
    color: '#FFD1B3',
    hoverColor: '#FFE4D6',
    size: 'large',
    aspectRatio: 'aspect-[16/9]',
    image: '/Photography/8.jpg'
  },
  {
    id: 'illustrations',
    title: 'Illustrations',
    description: 'Digital Art • Illustrations',
    color: '#FFEAD1',
    hoverColor: '#FFF4E6',
    size: 'medium',
    aspectRatio: 'aspect-[16/9]',
    image: '/Illustration/1.jpg'
  },
  {
    id: 'brand',
    title: 'Credixio',
    description: 'Coming Soon',
    color: '#FFF4E6',
    hoverColor: '#FFE4D6',
    size: 'medium',
    aspectRatio: 'aspect-[16/9]',
    image: null
  }
]

export default function CaseStudies() {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()

  const scrollToSection = (section: 'case-studies' | 'contact') => {
    const scrollPositions = {
      'case-studies': window.innerHeight * 2.8,
      'contact': window.innerHeight * 5.2
    }
    
    window.scrollTo({
      top: scrollPositions[section],
      behavior: 'smooth'
    })
  }

  return (
    <motion.div 
      ref={containerRef}
      className="min-h-screen py-20 transition-colors duration-500 relative w-full"
      style={{ 
        backgroundColor: hoveredProject ? 
          projects.find(p => p.id === hoveredProject)?.hoverColor || 'white' 
          : 'white',
        position: 'relative'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-48 relative">
        <h2 className="text-4xl sm:text-6xl font-alice mb-12 sm:mb-24 text-[#333333]">
          Case Studies
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 auto-rows-auto gap-8 sm:gap-x-24 sm:gap-y-32">
          {projects.map((project) => (
            <Link 
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
              key={project.id}
              className={`${project.size === 'large' ? 'col-span-1 sm:col-span-2' : 'col-span-1'}`}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              onClick={(e) => {
                if (!['tata-motors', 'visa-idfc', 'vala-heritage', 'photography', 'illustrations'].includes(project.id)) {
                  e.preventDefault()
                  scrollToSection('case-studies')
                }
              }}
            >
              <motion.div 
                className={`overflow-hidden rounded-lg mb-4 sm:mb-6 ${project.aspectRatio} relative`}
                style={{ backgroundColor: project.color }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 20px 30px rgba(0,0,0,0.1)',
                  transition: { duration: 0.3, ease: 'easeOut' }
                }}
              >
                {project.image ? (
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-sacramento text-5xl text-[#FF6B00]">
                      Coming Soon
                    </span>
                  </div>
                )}
              </motion.div>
              <h3 className="text-xl sm:text-2xl font-alice mb-2">{project.title}</h3>
              <p className="text-xs sm:text-sm font-opensans text-gray-500 mb-2">{project.year}</p>
              <p className="text-xs sm:text-sm font-opensans text-gray-700">{project.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-16 sm:mt-32">
          <h3 className="text-xl sm:text-2xl font-alice text-[#333333] mb-8 sm:mb-12 text-center">
            Other Brands I Have Worked For
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 items-center justify-items-center">
            <motion.div 
              className="w-40 h-20 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img 
                src="/Logos/axis-logo.png" 
                alt="Axis Bank" 
                className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
              />
            </motion.div>
            <motion.div 
              className="w-40 h-20 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img 
                src="/Logos/bajaj-logo.png" 
                alt="Bajaj" 
                className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
              />
            </motion.div>
            <motion.div 
              className="w-40 h-20 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img 
                src="/Logos/hdfc-logo.png" 
                alt="HDFC" 
                className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
              />
            </motion.div>
            <motion.div 
              className="w-40 h-20 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img 
                src="/Logos/nedbank-logo.png" 
                alt="Nedbank" 
                className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 