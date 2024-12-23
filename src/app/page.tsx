'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import SkillsShowcase from '@/components/SkillsShowcase'
import CaseStudies from '@/components/CaseStudies'
import FlippingCard from '@/components/FlippingCard'
import CustomCursor from '@/components/CustomCursor'

export default function Home() {
  const [currentSection, setCurrentSection] = useState<'hero' | 'case-studies' | 'contact'>('hero')
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start", "end start"]
  })

  // Add loading effect on mount
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }, [])

  // Check for scroll target on mount
  useEffect(() => {
    const shouldScroll = sessionStorage.getItem('shouldScroll')
    const scrollTarget = sessionStorage.getItem('scrollTarget')
    
    if (shouldScroll === 'true' && scrollTarget) {
      sessionStorage.removeItem('shouldScroll')
      sessionStorage.removeItem('scrollTarget')
      
      const targetSection = document.getElementById(scrollTarget)
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [])

  // Update current section based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      
      const caseStudiesSection = document.getElementById('case-studies')
      const contactSection = document.getElementById('contact')
      
      if (contactSection && scrollPosition + windowHeight/2 >= contactSection.offsetTop) {
        setCurrentSection('contact')
      } else if (caseStudiesSection && scrollPosition + windowHeight/2 >= caseStudiesSection.offsetTop) {
        setCurrentSection('case-studies')
      } else {
        setCurrentSection('hero')
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <CustomCursor />
      
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
                Vaibhav Sharma
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
            style={{ 
              scaleX: scrollYProgress,
              transformOrigin: 'left'
            }}
          />
        </motion.div>

        {/* Desktop UI */}
        <motion.div 
          className="fixed top-0 left-0 w-full z-[80] bg-white/80 backdrop-blur-xl shadow-lg"
          initial={{ y: -200 }}
          animate={{ y: currentSection === 'hero' ? -200 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-full px-12 py-8">
            <Navbar isLandingPage={true} />
          </div>
        </motion.div>

        {/* Hero Section */}
        <section id="hero" className="min-h-screen">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-screen flex items-center justify-center">
              {/* Center Card */}
              <div className="absolute transform scale-50 md:scale-[0.425] origin-center z-20">
                <FlippingCard
                  frontVideo="/videos/hero-center-front.mp4"
                  backVideo="/videos/hero-center-back.mp4"
                  isCenter
                />
              </div>

              {/* Left Card */}
              <div className="absolute left-[-32vw] transform scale-40 md:scale-[0.34] origin-center z-10">
                <FlippingCard
                  frontVideo="/videos/hero-left-front.mp4"
                  backVideo="/videos/hero-left-back.mp4"
                />
              </div>

              {/* Right Card */}
              <div className="absolute right-[-32vw] transform scale-40 md:scale-[0.34] origin-center z-10">
                <FlippingCard
                  frontVideo="/videos/hero-right-front.mp4"
                  backVideo="/videos/hero-right-back.mp4"
                />
              </div>
            </div>
          </div>

          {/* Hero Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-30">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="font-alice text-4xl md:text-5xl text-[#333333] mb-4">
                Hi, I&apos;m Vaibhav
              </h1>
              <p className="font-sacramento text-3xl md:text-4xl text-[#FF6B00] mb-8">
                UX Designer & Developer
              </p>
              <p className="font-alice text-lg md:text-xl text-[#333333] max-w-xl mx-auto mb-12">
                I&apos;m passionate about creating delightful digital experiences that make people&apos;s lives easier
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link 
                href="#case-studies"
                className="font-alice text-lg text-[#333333] border-b-2 border-[#FF6B00] pb-1 hover:text-[#FF6B00] transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                View My Work
              </Link>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#333333]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <span className="font-alice text-sm">Scroll to explore</span>
            <motion.div
              className="w-1 h-8 rounded-full bg-[#FF6B00]"
              animate={{
                scaleY: [1, 1.5, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity
              }}
            />
          </motion.div>
        </section>

        {/* Skills Showcase */}
        <SkillsShowcase />

        {/* Case Studies */}
        <section id="case-studies" className="min-h-screen py-32">
          <CaseStudies />
        </section>

        {/* Contact Section */}
        <section id="contact" className="min-h-screen bg-[#F8F8F8] py-32">
          <div className="container mx-auto px-4">
            <h2 className="font-alice text-4xl text-[#333333] text-center mb-16">
              Let&apos;s Connect
            </h2>
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <a 
                  href="mailto:vaibhav.sharma.ux@gmail.com"
                  className="group bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#FF6B00]/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#FF6B00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-alice text-xl text-[#333333] group-hover:text-[#FF6B00] transition-colors">
                        Email
                      </h3>
                      <p className="font-alice text-gray-500">
                        vaibhav.sharma.ux@gmail.com
                      </p>
                    </div>
                  </div>
                </a>

                <a 
                  href="https://www.linkedin.com/in/vaibhav-sharma-ux/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#FF6B00]/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#FF6B00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-alice text-xl text-[#333333] group-hover:text-[#FF6B00] transition-colors">
                        LinkedIn
                      </h3>
                      <p className="font-alice text-gray-500">
                        Connect with me
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="font-alice text-gray-500">
              © 2024 Vaibhav Sharma. All rights reserved.
            </p>
          </div>
        </footer>
      </motion.div>
    </>
  )
}
