'use client'
import { useState, useRef, useEffect, useMemo } from 'react'
import FlippingCard from '@/components/FlippingCard'
import Navbar from '@/components/Navbar'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import SkillsShowcase from '@/components/SkillsShowcase'
import FloatingCollage from '@/components/FloatingCollage'
import CaseStudies from '@/components/CaseStudies'
import { track } from '@vercel/analytics'

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileLandscape, setIsMobileLandscape] = useState(false)

  // Initialize loading state on client side only
  useEffect(() => {
    setIsLoading(true); // Set to true only on client side
  }, []);

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

  // Move transforms calculations outside useMemo
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
  
  // Floating CTAs component - Moved above HeroContent
  const FloatingCTAs = () => {
    const [isInCaseStudiesSection, setIsInCaseStudiesSection] = useState(false)
    
    // Track scroll position to determine if we're in the case studies section
    useEffect(() => {
      const handleScroll = () => {
        // Check if we're in the case studies section based on scroll position
        // These values should match the case studies section scroll triggers
        const scrollPosition = window.scrollY / window.innerHeight
        const inCaseStudiesSection = scrollPosition >= 0.35 && scrollPosition <= 0.8
        setIsInCaseStudiesSection(inCaseStudiesSection)
      }
      
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    
    if (isInCaseStudiesSection) return null
    
    return (
      <motion.div 
        className="fixed bottom-6 right-6 flex flex-col gap-4 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 2 }}
      >
        <motion.button
          onClick={() => {
            const caseStudiesSection = window.innerHeight * (isMobileLandscape ? 4.2 : isMobile ? 3.2 : 2.8)
            window.scrollTo({
              top: caseStudiesSection,
              behavior: 'smooth'
            })
            track('cta_click', { button: 'case_studies' })
          }}
          className="bg-[#FF6B00] text-white font-alice py-2 px-4 rounded-full shadow-lg flex items-center justify-center whitespace-nowrap hover:bg-[#e56200] transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Case Studies
        </motion.button>
        
        <motion.a
          href="https://design.system.vaibhav.design/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#333333] text-white font-alice py-2 px-4 rounded-full shadow-lg flex items-center justify-center whitespace-nowrap hover:bg-black transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => track('cta_click', { button: 'design_system' })}
        >
          Interactive Design System
        </motion.a>
      </motion.div>
    )
  }

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
      // Set a shorter fallback timeout
      const fallbackTimeout = setTimeout(() => {
        console.warn('Fallback timeout reached; dismissing loading screen.');
        setIsLoading(false);
      }, 3000); // Reduced from 5000ms to 3000ms

      // Immediately start loading assets
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

      // Load assets in parallel
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

      // Ensure loading screen is dismissed even if assets fail to load
      return () => clearTimeout(fallbackTimeout);
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
          <span className="font-alice text-[#333333] text-[52px] md:text-[60px] lg:text-[120px]">UX</span>{' '}
          <span className="font-sacramento text-[#FF6B00] text-[52px] md:text-[60px] lg:text-[120px]">Design</span>{' '}
        </div>
        <span className="font-alice text-[#333333] text-[52px] md:text-[60px] lg:text-[120px]">Engineer</span>
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
      
      {/* Floating CTAs */}
      <FloatingCTAs />
    </motion.section>
  ), [transforms.heroOpacity, isMobile, isMobileLandscape, FloatingCTAs])

  // Add analytics tracking
  useEffect(() => {
    const startTime = performance.now()
    const scrollDepthFlags = { 25: false, 50: false, 75: false }

    // Track scroll depth (optimized to track each threshold only once)
    const trackScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      
      Object.entries(scrollDepthFlags).forEach(([threshold, tracked]) => {
        if (!tracked && scrollPercentage >= Number(threshold)) {
          track('scroll_depth', { depth: Number(threshold) })
          scrollDepthFlags[threshold] = true
        }
      })
    }

    // Track exit intent
    const trackExitIntent = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        const scrollDepth = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        const timeSpent = (performance.now() - startTime) / 1000
        track('exit_intent', {
          scrollDepth: Math.round(scrollDepth),
          timeSpent: Math.round(timeSpent)
        })
      }
    }

    // Track time spent
    const trackTimeSpent = () => {
      const timeSpent = (performance.now() - startTime) / 1000
      track('time_on_page', {
        seconds: Math.round(timeSpent)
      })
    }

    // Add event listeners
    window.addEventListener('scroll', trackScroll)
    document.addEventListener('mouseleave', trackExitIntent)
    window.addEventListener('beforeunload', trackTimeSpent)

    // Cleanup
    return () => {
      window.removeEventListener('scroll', trackScroll)
      document.removeEventListener('mouseleave', trackExitIntent)
      window.removeEventListener('beforeunload', trackTimeSpent)
    }
  }, [])

  // Testimonials Carousel Component
  const TestimonialsCarousel = ({ compact = false }) => {
    const testimonials = [
      {
        name: "Prateek Bandyopadhyay",
        role: "Lead UI Designer",
        linkedin: "https://www.linkedin.com/in/prateek-bandyopadhyay/",
        leadership: "You lead the project with complete ownership. You are a good negotiator with clients. You managed the project with good efficiency. For example, with so much happening in the project, you made sure we never worked over the weekends. Neither did we have late evening calls.",
        strengths: ["Proactive", "Critical thinker", "Efficiency", "Good negotiator"],
        impact: "You drive the project that we are working on. You set the expectations right with the client with clear communication and also managed to build trust with the client."
      },
      {
        name: "Reet Singh Tomar",
        role: "UX Designer",
        linkedin: "https://www.linkedin.com/in/reetsinghtomar1601/",
        leadership: "Since the day one, Vaibhav took responsibility very diligently. He has all the skills that a leader needs, be it decision-making or guiding someone when stuck. The best thing about his work is his honest response to the work and never hesitating to point out the right thing. At the same time, he gives space to allies to explore and listens to them with an open mind.",
        strengths: ["Attention to detail", "Leadership skills", "Respecting others"],
        impact: "Made the process of problem-solving easy by contributing actively in brainstorming and giving accurate feedback."
      },
      {
        name: "Siddharth Sury",
        role: "UX Designer",
        linkedin: "https://www.linkedin.com/in/sidauski/",
        quote: "Handles pressure like a pro, doesn't flinch at the face of adversity that the client throws at him."
      }
    ];
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    const resetTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    
    const nextSlide = () => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    };
    
    const prevSlide = () => {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
      );
    };
    
    useEffect(() => {
      // Add keyboard event listeners for arrow key navigation
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
          nextSlide();
          setIsPaused(true);
          setTimeout(() => setIsPaused(false), 5000); // Resume auto-rotation after 5 seconds
        } else if (e.key === 'ArrowLeft') {
          prevSlide();
          setIsPaused(true);
          setTimeout(() => setIsPaused(false), 5000); // Resume auto-rotation after 5 seconds
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [nextSlide, prevSlide]);
    
    // Auto-rotation effect
    useEffect(() => {
      resetTimeout();
      
      if (!isPaused) {
        timeoutRef.current = setTimeout(() => {
          nextSlide();
        }, 4000); // Rotate every 4 seconds
      }
      
      return () => {
        resetTimeout();
      };
    }, [currentIndex, isPaused, nextSlide, resetTimeout]);
    
    const testimonial = testimonials[currentIndex];
    
    const handleMouseEnter = () => {
      setIsPaused(true);
    };
    
    const handleMouseLeave = () => {
      setIsPaused(false);
    };
    
    // Calculate a proper height for the container based on content
    const containerHeight = compact ? 'min-h-[240px]' : 'min-h-[380px]';
    
    return (
      <div 
        className={`relative ${compact ? 'w-full sm:w-[350px] md:w-[400px]' : 'w-full sm:w-[450px] md:w-[550px]'} mx-auto`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Heading is completely separate from the card container */}
        <motion.h3
          className={`${compact ? 'text-2xl' : 'text-3xl md:text-4xl'} text-center mb-4`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-alice text-[#333333]">What </span>
          <span className="font-sacramento text-[#FF6B00]">People Say</span>
        </motion.h3>
        
        {/* Navigation dots positioned below heading and above card */}
        <div className="flex justify-center gap-2 mb-4">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsPaused(true);
                setTimeout(() => setIsPaused(false), 5000);
              }}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? 'bg-[#FF6B00]' : 'bg-gray-300'
              } transition-colors`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Fixed position container for testimonial cards */}
        <div className={`relative ${containerHeight}`}>
          {/* Navigation arrows positioned at fixed distance from top */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
              setIsPaused(true);
              setTimeout(() => setIsPaused(false), 5000);
            }}
            className="absolute top-12 -left-4 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-50 z-10"
            aria-label="Previous testimonial"
          >
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 1L1 5L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
              setIsPaused(true);
              setTimeout(() => setIsPaused(false), 5000);
            }}
            className="absolute top-12 -right-4 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-50 z-10"
            aria-label="Next testimonial"
          >
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          
          {/* Testimonial cards that are top-aligned and animate in/out */}
          <div className="absolute top-0 left-0 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-100 w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-4">
                  <div>
                    <h4 className="font-alice text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <a 
                      href={testimonial.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#FF6B00] hover:underline mt-1 inline-block"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                </div>
                
                {testimonial.quote ? (
                  <p className="text-sm text-gray-700 italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                ) : (
                  <>
                    {!compact && (
                      <>
                        <h5 className="text-sm font-bold text-gray-700 mb-2">Leadership abilities:</h5>
                        <p className="text-sm text-gray-700 mb-3">
                          &ldquo;{testimonial.leadership}&rdquo;
                        </p>
                        
                        <h5 className="text-sm font-bold text-gray-700 mb-2">Key strengths:</h5>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {testimonial.strengths?.map((strength) => (
                            <span key={strength} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {strength}
                            </span>
                          ))}
                        </div>
                        
                        <h5 className="text-sm font-bold text-gray-700 mb-2">Impact:</h5>
                        <p className="text-sm text-gray-700">
                          &ldquo;{testimonial.impact}&rdquo;
                        </p>
                      </>
                    )}
                    
                    {compact && (
                      <p className="text-sm text-gray-700">
                        &ldquo;{testimonial.impact || testimonial.leadership.split('.')[0]}.&rdquo;
                      </p>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Remove the old navigation dots that were at the bottom */}
        </div>
      </div>
    );
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && typeof window !== 'undefined' && (
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
        animate={{ opacity: 1 }}
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
                      I Research, I design, I code.
                    </p>
                    <p className="font-opensans text-base leading-relaxed text-gray-700 mt-4">
                      With over 5 years of experience as a UX Designer designing for fortune 500 companies like 
                      <a href="https://www.tatamotors.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center mx-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">Tata</a>, 
                      <a href="https://www.visa.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center mx-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">Visa</a>, 
                      <a href="https://www.hdfc.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center mx-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">HDFC</a> etc, 
                      teaching myself 
                      <span className="relative group inline-flex items-center justify-center mx-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">
                        Coding
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white rounded-lg shadow-lg text-xs w-52 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          Built with Next.js, React, TypeScript, Tailwind CSS, and Framer Motion
                        </span>
                      </span>, 
                      <span className="inline-flex items-center justify-center mx-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">3D modeling and animation</span>, 
                      <span className="inline-flex items-center justify-center mx-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">Illustration</span>, 
                      <span className="inline-flex items-center justify-center mx-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">Photography</span> 
                      and more, I have evolved my design philosophy to a multi-disciplinary approach, where I can design and code enabling closer collaboration with designers, Business teams, PMs and Engineers.
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
                          I Research, I design, I code.
                        </p>
                        <p className="font-opensans text-base leading-relaxed text-gray-700 mt-3 text-center">
                          With over 5 years of experience as a UX Designer designing for fortune 500 companies like 
                          <a href="https://www.tatamotors.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center mx-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">Tata</a>, 
                          <a href="https://www.visa.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center mx-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">Visa</a>, 
                          <a href="https://www.hdfc.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center mx-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">HDFC</a> etc, teaching myself 
                          <span className="relative group inline-flex items-center justify-center mx-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">
                            Coding
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white rounded-lg shadow-lg text-xs w-52 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                              Built with Next.js, React, TypeScript, Tailwind CSS, and Framer Motion
                            </span>
                          </span>, 
                          <span className="inline-flex items-center justify-center mx-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">3D modeling</span>, 
                          <span className="inline-flex items-center justify-center mx-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">Illustration</span>, 
                          <span className="inline-flex items-center justify-center mx-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">Photography</span> 
                          and more, I have evolved my design philosophy to a multi-disciplinary approach, where I can design and code enabling closer collaboration with designers, Business teams, PMs and Engineers.
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
                          I Research, I design, I code.
                        </p>
                        <p className="font-opensans text-xs sm:text-sm leading-relaxed text-gray-700 mt-2">
                          With over 5 years of experience as a UX Designer designing for fortune 500 companies like 
                          <a href="https://www.tatamotors.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center mx-1 px-1 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">Tata</a>, 
                          <a href="https://www.visa.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center mx-1 px-1 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">Visa</a>, 
                          <a href="https://www.hdfc.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center mx-1 px-1 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">HDFC</a> etc, teaching myself 
                          <span className="relative group inline-flex items-center justify-center mx-1 px-1 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">
                            Coding
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white rounded-lg shadow-lg text-xs w-52 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                              Built with Next.js, React, TypeScript, Tailwind CSS, and Framer Motion
                            </span>
                          </span>, 
                          <span className="inline-flex items-center justify-center mx-1 px-1 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">3D modeling</span>, 
                          <span className="inline-flex items-center justify-center mx-1 px-1 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">Illustration</span>, 
                          <span className="inline-flex items-center justify-center mx-1 px-1 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">Photography</span> 
                          and more I have evolved my design philosophy to a multi-disciplinary approach, where I can design and code enabling closer collaboration with designers, Business teams, PMs and Engineers.
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
                // Desktop Contact Layout - Two Column Design
                <>
                  <div className="flex-1 flex">
                    {/* Left Column - Contact Info */}
                    <div className="w-1/2 flex items-center justify-center">
                      <div className="text-center max-w-md">
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
                    </div>
                    
                    {/* Right Column - Testimonials Carousel */}
                    <div className="w-3/5 flex items-center justify-center px-6">
                      <TestimonialsCarousel />
                    </div>
                  </div>
                  
                  {/* Desktop Footer */}
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
                </>
              ) : !isMobileLandscape ? (
                // Mobile Portrait Layout
                <>
                  <div className="flex-1 flex flex-col min-h-[90vh] justify-center px-4">
                    <div className="text-center mb-12">
                      <motion.h2 
                        className="text-4xl mb-4"
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
                    
                    {/* Mobile Testimonials Carousel */}
                    <div className="mb-12 w-full">
                      <TestimonialsCarousel />
                    </div>
                  </div>
                
                  {/* Mobile Portrait Footer */}
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
                </>
              ) : (
                // Mobile Landscape Layout
                <>
                  <div className="flex justify-between items-center h-[70vh] px-8">
                    {/* Left side - Contact */}
                    <div className="w-1/2">
                      <motion.h2 
                        className="text-3xl mb-3"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <span className="font-alice text-[#333333]">Let&apos;s </span>
                        <span className="font-sacramento text-[#FF6B00]">Connect</span>
                      </motion.h2>
                      
                      <motion.div
                        className="mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <a 
                          href="mailto:contact@vaibhavsharma.design" 
                          className="text-sm font-alice text-gray-700 hover:text-[#FF6B00] transition-colors"
                        >
                          contact@vaibhavsharma.design
                        </a>
                      </motion.div>

                      <motion.div
                        className="flex gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <a 
                          href="https://linkedin.com/in/your-profile" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-opensans text-gray-600 hover:text-[#FF6B00] transition-colors"
                        >
                          LinkedIn
                        </a>
                        <a 
                          href="https://behance.net/your-profile" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-opensans text-gray-600 hover:text-[#FF6B00] transition-colors"
                        >
                          Behance
                        </a>
                      </motion.div>
                    </div>
                    
                    {/* Right side - Testimonials */}
                    <div className="w-2/3">
                      <TestimonialsCarousel compact />
                    </div>
                  </div>
                
                  {/* Mobile Landscape Footer */}
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
                </>
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
