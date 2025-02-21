  'use client'
  import { useState, useRef, useEffect, useMemo } from 'react'
  import FlippingCard from '@/components/FlippingCard'
  import Navbar from '@/components/Navbar'
  import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
  import SkillsShowcase from '@/components/SkillsShowcase'
  import FloatingCollage from '@/components/FloatingCollage'
  import CaseStudies from '@/components/CaseStudies'

  export default function Home() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [isMobile, setIsMobile] = useState(false)
    const [isMobileLandscape, setIsMobileLandscape] = useState(false)

    useEffect(() => {
      const checkMobile = () => {
        const mobile = window.matchMedia('(max-width: 768px)').matches
        const landscape = window.matchMedia('(orientation: landscape) and (max-height: 450px)').matches
        setIsMobile(mobile || landscape)
        setIsMobileLandscape(landscape)
      }

      checkMobile()
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ["start", isMobileLandscape ? "end end" : "end start"]
    })

    // Move transform calculations outside useMemo
    const aboutY = useTransform(scrollYProgress, [0, 0.15], ['100vh', '0vh'])
    const aboutScale = useTransform(scrollYProgress, [0, 0.15], [0.9, 1])
    const aboutRadius = useTransform(scrollYProgress, [0, 0.15], [30, 0])
    const aboutShadow = useTransform(
      scrollYProgress,
      [0, 0.15],
      ['0px -20px 50px rgba(0,0,0,0.2)', '0px 0px 0px rgba(0,0,0,0)']
    )
    const caseStudiesY = useTransform(scrollYProgress, [0.25, 0.35], ['100vh', '0vh'])
    const caseStudiesScale = useTransform(scrollYProgress, [0.25, 0.35], [0.9, 1])
    const caseStudiesRadius = useTransform(scrollYProgress, [0.25, 0.35], [30, 0])
    const caseStudiesShadow = useTransform(
      scrollYProgress,
      [0.25, 0.35],
      ['0px -20px 50px rgba(0,0,0,0.2)', '0px 0px 0px rgba(0,0,0,0)']
    )
    const heroOpacity = useTransform(scrollYProgress, [0.2, 0.25], [1, 0])
    const caseStudiesContentY = useTransform(
      scrollYProgress,
      [0.35, isMobileLandscape ? 0.9 : 0.8],
      [0, -2500]
    )
    const contactY = useTransform(
      scrollYProgress, 
      [0.8, 0.85], 
      ['100vh', '0vh']
    )
    const contactScale = useTransform(
      scrollYProgress, 
      [0.8, 0.85], 
      [0.9, 1]
    )
    const contactRadius = useTransform(
      scrollYProgress, 
      [0.8, 0.85], 
      [30, 0]
    )
    const contactShadow = useTransform(
      scrollYProgress,
      [0.8, 0.85],
      ['0px -20px 50px rgba(0,0,0,0.2)', '0px 0px 0px rgba(0,0,0,0)']
    )

    // Memoize transforms object
    const transforms = useMemo(() => ({
      aboutY,
      aboutScale,
      aboutRadius,
      aboutShadow,
      caseStudiesY,
      caseStudiesScale,
      caseStudiesRadius,
      caseStudiesShadow,
      heroOpacity,
      caseStudiesContentY,
      contactY,
      contactScale,
      contactRadius,
      contactShadow
    }), [
      aboutY,
      aboutScale,
      aboutRadius,
      aboutShadow,
      caseStudiesY,
      caseStudiesScale,
      caseStudiesRadius,
      caseStudiesShadow,
      heroOpacity,
      caseStudiesContentY,
      contactY,
      contactScale,
      contactRadius,
      contactShadow
    ])

    // Optimize session storage check
    useEffect(() => {
      const handleInitialScroll = () => {
        const shouldScroll = sessionStorage.getItem('shouldScroll')
        const target = sessionStorage.getItem('scrollTarget')
        
        if (shouldScroll && target) {
          sessionStorage.removeItem('shouldScroll')
          sessionStorage.removeItem('scrollTarget')
          
          requestAnimationFrame(() => {
            const scrollPositions = {
              'case-studies': window.innerHeight * (isMobileLandscape ? 4.2 : isMobile ? 3.2 : 2.8),
              'contact': window.innerHeight * (isMobileLandscape ? 7.4 : isMobile ? 6.4 : 5.4)
            }
            
            window.scrollTo({
              top: scrollPositions[target as keyof typeof scrollPositions],
              behavior: 'smooth'
            })
          })
        }
      }

      handleInitialScroll()
    }, [isMobile, isMobileLandscape])

    // Add intersection observer for performance
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => setIsVisible(entry.isIntersecting),
        { threshold: 0.1 }
      )

      if (containerRef.current) {
        observer.observe(containerRef.current)
      }

      return () => observer.disconnect()
    }, [])

    // Replace current loading effect useEffect
    useEffect(() => {
      const imagesToLoad = ["/mobileRender.jpg", "/LaptopRender2.jpg"];
      const videosToLoad = ["/CrdxFinalAnimVideoH264.mp4", "/SlideAnimVideoH264.mp4"];

      const loadImage = (src: string) => new Promise<void>((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });

      const loadVideo = (src: string) => new Promise<void>((resolve) => {
        const video = document.createElement("video");
        video.src = src;
        video.onloadeddata = () => resolve();
        video.onerror = () => resolve();
      });

      // Asset loading effect with fallback timeout
      const fallbackTimeout = setTimeout(() => {
        console.warn('Fallback timeout reached; dismissing loading screen.');
        setIsLoading(false);
      }, 5000);

      Promise.all([
        ...imagesToLoad.map(loadImage),
        ...videosToLoad.map(loadVideo)
      ]).then(() => {
        clearTimeout(fallbackTimeout);
        setIsLoading(false);
      }).catch(() => {
        clearTimeout(fallbackTimeout);
        setIsLoading(false);
      });
    }, []);

    // Add this new effect near the top of the Home function
    useEffect(() => {
      const imagesToPreload = ["/mobileRender.jpg", "/LaptopRender2.jpg"];
      imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    }, []);

    // Memoize hero content
    const HeroContent = useMemo(() => (
      <motion.section 
        className="min-h-screen landscape:h-[100vh] flex flex-col items-center justify-center fixed top-0 left-0 w-full bg-white pt-20 landscape:pt-2 sm:pt-0"
        style={{ opacity: transforms.heroOpacity, zIndex: 1, willChange: 'transform, opacity' }}
      >
        <motion.h1 
          className="leading-none text-center z-30 mb-8 landscape:mb-8 md:mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="mb-2 sm:mb-0">
            <span className="font-alice text-[#333333] text-[52px] md:text-[60px] lg:text-[120px]">User</span>{' '}
            <span className="font-sacramento text-[#FF6B00] text-[52px] md:text-[60px] lg:text-[120px]">Experience</span>{' '}
          </div>
          <span className="font-alice text-[#333333] text-[52px] md:text-[60px] lg:text-[120px]">Designer</span>
        </motion.h1>

        <div className={`flex items-center justify-center relative ${isMobile ? 'w-full' : ''}`}>
          {!isMobile ? (
            // Desktop Layout
            <>
              <motion.div 
                className="absolute"
                initial={{ x: 0, y: 0, opacity: 0.5 }}
                animate={{ x: -300, y: -40, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              >
                <FlippingCard
                  image="/mobileRender.jpg"
                  zIndex={10}
                  imageOnly
                />
              </motion.div>
              
              <FlippingCard
                frontVideo="/CrdxFinalAnimVideoH264.mp4"
                backVideo="/SlideAnimVideoH264.mp4"
                isCenter
                zIndex={20}
              />
              
              <motion.div 
                className="absolute"
                initial={{ x: 0, y: 0, opacity: 0.5 }}
                animate={{ x: 300, y: 40, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              >
                <FlippingCard
                  image="/LaptopRender2.jpg"
                  zIndex={10}
                  imageOnly
                />
              </motion.div>
            </>
          ) : !isMobileLandscape ? (
            // Mobile Portrait Layout
            <div className="relative flex justify-center items-center h-[140px] my-8">
              <motion.div 
                className="absolute -left-28 z-10"
                initial={{ x: -50, y: 0, opacity: 0 }}
                animate={{ x: 0, y: -16, opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                <FlippingCard
                  image="/mobileRender.jpg"
                  zIndex={10}
                  imageOnly
                />
              </motion.div>

              <motion.div
                className="relative z-20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <FlippingCard
                  frontVideo="/CrdxFinalAnimVideoH264.mp4"
                  backVideo="/SlideAnimVideoH264.mp4"
                  isCenter
                  zIndex={20}
                />
              </motion.div>

              <motion.div
                className="absolute -right-28 z-10"
                initial={{ x: 50, y: 0, opacity: 0 }}
                animate={{ x: 0, y: 16, opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                <FlippingCard
                  image="/LaptopRender2.jpg"
                  zIndex={10}
                  imageOnly
                />
              </motion.div>
            </div>
          ) : (
            // Mobile Landscape Layout for Hero
            <div className="relative flex justify-center items-center h-[60px] my-8">
              <motion.div 
                className="absolute -left-32 z-10"
                initial={{ x: -50, y: 0, opacity: 0 }}
                animate={{ x: 0, y: -16, opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                <FlippingCard
                  image="/mobileRender.jpg"
                  zIndex={10}
                  imageOnly
                />
              </motion.div>

              <motion.div
                className="relative z-20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <FlippingCard
                  frontVideo="/CrdxFinalAnimVideoH264.mp4"
                  backVideo="/SlideAnimVideoH264.mp4"
                  isCenter
                  zIndex={20}
                />
              </motion.div>

              <motion.div
                className="absolute -right-32 z-10"
                initial={{ x: 50, y: 0, opacity: 0 }}
                animate={{ x: 0, y: 16, opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                <FlippingCard
                  image="/LaptopRender2.jpg"
                  zIndex={10}
                  imageOnly
                />
              </motion.div>
            </div>
          )}
        </div>

        <motion.div 
          className={`${isMobile ? 'mt-8 landscape:mt-8 px-4' : 'mt-16'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <SkillsShowcase />
        </motion.div>
      </motion.section>
    ), [transforms.heroOpacity, isMobile, isMobileLandscape])

    return (
      <>
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div 
              className="fixed inset-0 z-[100] bg-white flex items-center justify-center"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h1 className="font-alice text-3xl text-[#333333] mb-4">Welcome</h1>
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
          className="relative h-[800vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.5 }}
        >
          <Navbar isLandingPage={true} />

          {isVisible && (
            <>
              {HeroContent}
              
              {/* About Section */}
              <motion.section 
                className="min-h-screen bg-white fixed top-0 left-0 w-full"
                style={{
                  y: transforms.aboutY,
                  scale: transforms.aboutScale,
                  borderRadius: transforms.aboutRadius,
                  boxShadow: transforms.aboutShadow,
                  transformOrigin: 'center bottom',
                  zIndex: 2,
                  willChange: 'transform, opacity'
                }}
              >
                {/* Desktop Layout - shown above md breakpoint */}
                <div className="hidden md:flex h-screen items-center justify-center">
                  <div className="max-w-7xl mx-auto px-8 flex items-center gap-20">
                    <div className="flex-1">
                      <h2 className="text-4xl mb-8">
                        <span className="font-alice text-[#333333]">Hi, I am </span>
                        <span className="font-sacramento text-[#FF6B00]">Vaibhav</span>
                      </h2>
                      <p className="font-opensans text-base leading-relaxed text-gray-700">
                        I blend design and technology to create intuitive digital experiences. 
                        My playground is the intersection of UX and engineering, where I experiment 
                        with tools and technologies to bring ideas to life.
                      </p>
                      <p className="font-opensans text-base leading-relaxed text-gray-700 mt-4">
                        What drives me is solving problems and coming up with elegant solutions. 
                        Through motion, code, and visual design, I craft experiences that feel 
                        natural and engaging.
                      </p>
                    </div>
                    <div className="flex-1 flex justify-center">
                      <FloatingCollage />
                    </div>
                  </div>
                </div>

                {/* Mobile Layout - shown below md breakpoint */}
                {isMobile && (
                  <>
                    {/* Portrait Layout */}
                    {!isMobileLandscape && (
                      <div className="flex flex-col min-h-screen px-4 justify-center -mt-12">
                        <div className="h-[380px]">
                          <div className="w-full max-w-[340px] mx-auto h-full">
                            <FloatingCollage />
                          </div>
                        </div>
                        <div className="mt-2">
                          <h2 className="text-3xl mb-4 text-center">
                            <span className="font-alice text-[#333333]">Hi, I am </span>
                            <span className="font-sacramento text-[#FF6B00]">Vaibhav</span>
                          </h2>
                          <p className="font-opensans text-base leading-relaxed text-gray-700 text-center">
                            I blend design and technology to create intuitive digital experiences. 
                            My playground is the intersection of UX and engineering, where I experiment 
                            with tools and technologies to bring ideas to life.
                          </p>
                          <p className="font-opensans text-base leading-relaxed text-gray-700 mt-3 text-center">
                            What drives me is solving problems and coming up with elegant solutions. 
                            Through motion, code, and visual design, I craft experiences that feel 
                            natural and engaging.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Landscape Layout */}
                    {isMobileLandscape && (
                      <div className="flex w-full max-w-[900px] items-center gap-8 px-8 sm:px-12">
                        <div className="w-[60%]">
                          <h2 className="text-2xl mb-3">
                            <span className="font-alice text-[#333333]">Hi, I am </span>
                            <span className="font-sacramento text-[#FF6B00]">Vaibhav</span>
                          </h2>
                          <p className="font-opensans text-xs sm:text-sm leading-relaxed text-gray-700">
                            I blend design and technology to create intuitive digital experiences. 
                            My playground is the intersection of UX and engineering, where I experiment 
                            with tools and technologies to bring ideas to life.
                          </p>
                          <p className="font-opensans text-xs sm:text-sm leading-relaxed text-gray-700 mt-2">
                            What drives me is solving problems and coming up with elegant solutions. 
                            Through motion, code, and visual design, I craft experiences that feel 
                            natural and engaging.
                          </p>
                        </div>
                        <div className="w-[40%] flex items-center justify-center">
                          <FloatingCollage />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.section>

              {/* Case Studies Section */}
              <motion.section 
                className="min-h-screen bg-white fixed top-0 left-0 w-full overflow-hidden relative"
                style={{
                  y: transforms.caseStudiesY,
                  scale: transforms.caseStudiesScale,
                  borderRadius: transforms.caseStudiesRadius,
                  boxShadow: transforms.caseStudiesShadow,
                  position: 'fixed',
                  width: '100%',
                  height: '100vh',
                  zIndex: 3,
                  transformOrigin: 'center bottom',
                  willChange: 'transform, opacity'
                }}
              >
                <motion.div 
                  style={{ y: transforms.caseStudiesContentY }}
                  className="h-auto relative"
                >
                  <div className="relative">
                    <CaseStudies />
                  </div>
                </motion.div>
              </motion.section>

              {/* Contact Section */}
              <motion.section 
                className="min-h-screen bg-white fixed top-0 left-0 w-full flex flex-col"
                style={{
                  y: transforms.contactY,
                  scale: transforms.contactScale,
                  borderRadius: transforms.contactRadius,
                  boxShadow: transforms.contactShadow,
                  zIndex: 4,
                  transformOrigin: 'center bottom',
                  willChange: 'transform, opacity'
                }}
              >
                {!isMobile ? (
                  // Desktop Contact Layout
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <motion.h2 
                        className="text-6xl mb-8"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <span className="font-alice text-[#333333]">Let&apos;s </span>
                        <span className="font-sacramento text-[#FF6B00]">Connect</span>
                      </motion.h2>
                      
                      <motion.div
                        className="mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <a 
                          href="mailto:contact@vaibhavsharma.design" 
                          className="text-2xl font-alice text-gray-700 hover:text-[#FF6B00] transition-colors"
                        >
                          contact@vaibhavsharma.design
                        </a>
                      </motion.div>

                      <motion.div
                        className="flex items-center justify-center gap-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <a 
                          href="https://linkedin.com/in/your-profile" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-opensans text-gray-600 hover:text-[#FF6B00] transition-colors"
                        >
                          LinkedIn
                        </a>
                        <a 
                          href="https://behance.net/your-profile" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-opensans text-gray-600 hover:text-[#FF6B00] transition-colors"
                        >
                          Behance
                        </a>
                      </motion.div>
                    </div>
                  </div>
                ) : !isMobileLandscape ? (
                  // Mobile Portrait Layout
                  <div className="flex-1 flex flex-col justify-center px-6">
                    <motion.h2 
                      className="text-3xl mb-6 text-center"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="font-alice text-[#333333]">Let&apos;s </span>
                      <span className="font-sacramento text-[#FF6B00]">Connect</span>
                    </motion.h2>
                    
                    <motion.div
                      className="mb-6 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <a 
                        href="mailto:contact@vaibhavsharma.design" 
                        className="text-base font-alice text-gray-700 hover:text-[#FF6B00] transition-colors break-words"
                      >
                        contact@vaibhavsharma.design
                      </a>
                    </motion.div>

                    <motion.div
                      className="flex justify-center gap-8"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <a 
                        href="https://linkedin.com/in/your-profile" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-opensans text-gray-600 hover:text-[#FF6B00] transition-colors"
                      >
                        LinkedIn
                      </a>
                      <a 
                        href="https://behance.net/your-profile" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-opensans text-gray-600 hover:text-[#FF6B00] transition-colors"
                      >
                        Behance
                      </a>
                    </motion.div>
                  </div>
                ) : (
                  // Mobile Landscape Layout
                  <div className="flex-1 flex flex-col justify-center px-6">
                    <motion.h2 
                      className="text-3xl mb-6 text-center"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="font-alice text-[#333333]">Let&apos;s </span>
                      <span className="font-sacramento text-[#FF6B00]">Connect</span>
                    </motion.h2>
                    
                    <motion.div
                      className="mb-6 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <a 
                        href="mailto:contact@vaibhavsharma.design" 
                        className="text-base font-alice text-gray-700 hover:text-[#FF6B00] transition-colors break-words"
                      >
                        contact@vaibhavsharma.design
                      </a>
                    </motion.div>

                    <motion.div
                      className="flex justify-center gap-8"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <a 
                        href="https://linkedin.com/in/your-profile" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-opensans text-gray-600 hover:text-[#FF6B00] transition-colors"
                      >
                        LinkedIn
                      </a>
                      <a 
                        href="https://behance.net/your-profile" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-opensans text-gray-600 hover:text-[#FF6B00] transition-colors"
                      >
                        Behance
                      </a>
                    </motion.div>
                  </div>
                )}

                {/* Footer - Separate mobile and desktop layouts */}
                {!isMobile ? (
                  // Desktop Footer
                  <footer className="h-24 border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
                      <div>
                        <p className="text-sm font-opensans text-gray-500">
                          © 2024 Vaibhav Sharma. All rights reserved.
                        </p>
                        <p className="text-sm font-opensans text-gray-400 mt-1">
                          Designed in Figma, Blender 3D, Illustrator • Built with Next.js, Framer Motion & Tailwind CSS
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <a 
                          href="https://linkedin.com/in/your-profile" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-opensans text-gray-500 hover:text-[#FF6B00] transition-colors"
                        >
                          LinkedIn
                        </a>
                        <a 
                          href="https://behance.net/your-profile" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-opensans text-gray-500 hover:text-[#FF6B00] transition-colors"
                        >
                          Behance
                        </a>
                      </div>
                    </div>
                  </footer>
                ) : !isMobileLandscape ? (
                  // Mobile Portrait Footer
                  <footer className="border-t border-gray-100 py-6 px-4">
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex flex-col items-center">
                        <p className="text-xs font-opensans text-gray-500 text-center">
                          © 2024 Vaibhav Sharma. All rights reserved.
                        </p>
                        <p className="text-xs font-opensans text-gray-400 mt-2 text-center">
                          Designed in Figma, Blender 3D, Illustrator
                        </p>
                        <p className="text-xs font-opensans text-gray-400 mt-1 text-center">
                          Built with Next.js, Framer Motion & Tailwind CSS
                        </p>
                      </div>
                      <div className="flex items-center gap-6 mt-2">
                        <a 
                          href="https://linkedin.com/in/your-profile" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-opensans text-gray-500 hover:text-[#FF6B00] transition-colors"
                        >
                          LinkedIn
                        </a>
                        <a 
                          href="https://behance.net/your-profile" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-opensans text-gray-500 hover:text-[#FF6B00] transition-colors"
                        >
                          Behance
                        </a>
                      </div>
                    </div>
                  </footer>
                ) : (
                  // Mobile Landscape Footer
                  <footer className="border-t border-gray-100 py-4 px-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs font-opensans text-gray-500">
                          © 2024 Vaibhav Sharma. All rights reserved.
                        </p>
                        <p className="text-xs font-opensans text-gray-400 mt-1">
                          Designed in Figma, Blender 3D, Illustrator • Built with Next.js, Framer Motion & Tailwind CSS
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <a 
                          href="https://linkedin.com/in/your-profile" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-opensans text-gray-500 hover:text-[#FF6B00] transition-colors"
                        >
                          LinkedIn
                        </a>
                        <a 
                          href="https://behance.net/your-profile" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-opensans text-gray-500 hover:text-[#FF6B00] transition-colors"
                        >
                          Behance
                        </a>
                      </div>
                    </div>
                  </footer>
                )}
              </motion.section>
            </>
          )}

          {/* Spacer divs */}
          <div className="h-screen" /> {/* Hero space */}
          <div className="h-screen" /> {/* About space */}
          <div 
            className={`${
              isMobileLandscape 
                ? 'h-[400vh]'          // Reduced height for mobile landscape to reduce scroll jank
                : isMobile 
                  ? 'h-[200vh]'        // Try much shorter height for portrait
                  : 'h-[370vh]'        // Keep desktop the same
            }`} 
          /> {/* Case studies space */}
          <div className={`${isMobileLandscape ? 'h-[150vh]' : 'h-screen'}`} /> {/* Contact space */}
        </motion.div>
      </>
    )
  }
