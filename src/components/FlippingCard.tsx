'use client'
import { motion, useAnimation } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface FlippingCardProps {
  frontVideo?: string
  backVideo?: string
  isCenter?: boolean
  image?: string
  zIndex?: number
  className?: string
  imageOnly?: boolean
  scale?: number
}

export default function FlippingCard({ 
  frontVideo, 
  backVideo, 
  isCenter, 
  image, 
  zIndex = 0, 
  className = '',
  imageOnly = false,
  scale = 1
}: FlippingCardProps) {
  const controls = useAnimation()
  const frontVideoRef = useRef<HTMLVideoElement>(null)
  const backVideoRef = useRef<HTMLVideoElement>(null)
  const isPlayingRef = useRef(true)
  const [isFlipping, setIsFlipping] = useState(false)
  const [frontVideoLoaded, setFrontVideoLoaded] = useState(false)
  const [backVideoLoaded, setBackVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileLandscape, setIsMobileLandscape] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.matchMedia('(max-width: 768px)').matches
      const landscape = window.matchMedia('(orientation: landscape) and (max-height: 450px)').matches
      console.log('Media Query Check:', { mobile, landscape })
      setIsMobile(mobile || landscape)
      setIsMobileLandscape(landscape)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Get base dimensions based on device
  const getBaseDimensions = () => {
    if (isMobile) {
      return { 
        width: '150px',
        height: '150px'
      }
    }
    return { 
      width: '400px',
      height: '400px'
    }
  }

  const getScale = () => {
    const scale = isMobileLandscape ? (isCenter ? 0.25 : 1) : 1
    console.log('Scale calculation:', { isMobileLandscape, isCenter, scale })
    return scale
  }

  const dimensions = getBaseDimensions()
  const scaleValue = getScale()
  console.log('Final values:', { dimensions, scaleValue })

  const playVideo = async (videoRef: React.RefObject<HTMLVideoElement>) => {
    if (!videoRef.current) {
      console.log('Video ref is null')
      return
    }

    try {
      console.log('Attempting to play video:', videoRef.current.src)
      
      // Reset video state
      videoRef.current.currentTime = 0
      videoRef.current.muted = true
      videoRef.current.playbackRate = 1

      // Force play
      const playPromise = videoRef.current.play()
      
      if (playPromise !== undefined) {
        await playPromise
        console.log('Video started playing successfully')

        // Wait for video to finish
        return new Promise<void>((resolve) => {
          if (!videoRef.current) return resolve()

          // Use both timeupdate and ended events to ensure we catch the end
          const handleTimeUpdate = () => {
            if (!videoRef.current) return
            // Check if we're near the end of the video
            if (videoRef.current.currentTime >= videoRef.current.duration - 0.1) {
              console.log('Video near end:', videoRef.current.currentTime, 'of', videoRef.current.duration)
              videoRef.current.removeEventListener('timeupdate', handleTimeUpdate)
              resolve()
            }
          }

          const handleEnded = () => {
            console.log('Video ended event fired')
            if (videoRef.current) {
              videoRef.current.removeEventListener('ended', handleEnded)
              videoRef.current.removeEventListener('timeupdate', handleTimeUpdate)
            }
            resolve()
          }

          videoRef.current.addEventListener('timeupdate', handleTimeUpdate)
          videoRef.current.addEventListener('ended', handleEnded)
        })
      }
    } catch (error) {
      console.error('Video playback error:', error)
      // Retry playback after a short delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      return playVideo(videoRef)
    }
  }

  // Force initial video play on mount
  useEffect(() => {
    if (imageOnly || !frontVideo || !backVideo) return

    const startVideos = async () => {
      try {
        if (frontVideoRef.current) {
          frontVideoRef.current.currentTime = 0
          frontVideoRef.current.muted = true
          frontVideoRef.current.playsInline = true
          await frontVideoRef.current.play()
          console.log('Front video started playing')
        }
      } catch (error) {
        console.error('Error starting front video:', error)
        setTimeout(startVideos, 1000)
      }
    }

    startVideos()
  }, [imageOnly, frontVideo, backVideo])

  // Handle front video loading
  useEffect(() => {
    if (!frontVideoRef.current || imageOnly) return

    const handleLoaded = () => {
      console.log('Front video loaded successfully:', frontVideoRef.current?.src)
      console.log('Front video duration:', frontVideoRef.current?.duration)
      setFrontVideoLoaded(true)
      setVideoError(null)
    }

    const handleError = (e: Event) => {
      const target = e.target as HTMLVideoElement
      console.error('Front video error:', {
        event: e,
        src: target.src,
        readyState: target.readyState,
        networkState: target.networkState,
        videoError: target.error
      })
      setVideoError('Failed to load front video')
    }

    frontVideoRef.current.addEventListener('loadeddata', handleLoaded)
    frontVideoRef.current.addEventListener('error', handleError)
    frontVideoRef.current.load()

    return () => {
      if (frontVideoRef.current) {
        frontVideoRef.current.removeEventListener('loadeddata', handleLoaded)
        frontVideoRef.current.removeEventListener('error', handleError)
      }
    }
  }, [imageOnly])

  // Handle back video loading
  useEffect(() => {
    if (!backVideoRef.current || imageOnly) return

    const handleLoaded = () => {
      console.log('Back video loaded successfully:', backVideoRef.current?.src)
      console.log('Back video duration:', backVideoRef.current?.duration)
      setBackVideoLoaded(true)
      setVideoError(null)
    }

    const handleError = (e: Event) => {
      const target = e.target as HTMLVideoElement
      console.error('Back video error:', {
        event: e,
        src: target.src,
        readyState: target.readyState,
        networkState: target.networkState,
        videoError: target.error
      })
      setVideoError('Failed to load back video')
    }

    backVideoRef.current.addEventListener('loadeddata', handleLoaded)
    backVideoRef.current.addEventListener('error', handleError)
    backVideoRef.current.load()

    return () => {
      if (backVideoRef.current) {
        backVideoRef.current.removeEventListener('loadeddata', handleLoaded)
        backVideoRef.current.removeEventListener('error', handleError)
      }
    }
  }, [imageOnly])

  // Handle flipping animation
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const flipCard = async () => {
      console.log('Starting flip card animation')
      
      const playAndFlip = async () => {
        try {
          // Play front video
          console.log('Playing front video')
          if (frontVideoRef.current) {
            frontVideoRef.current.currentTime = 0;
            frontVideoRef.current.play();
            
            // Wait for front video to end
            await new Promise<void>((resolve) => {
              const handleEnded = () => {
                console.log('Front video ended');
                frontVideoRef.current?.removeEventListener('ended', handleEnded);
                resolve();
              };
              frontVideoRef.current.addEventListener('ended', handleEnded);
            });

            // Flip to back
            console.log('Flipping to back')
            setIsFlipping(true)
            await controls.start({ 
              rotateY: 180,
              transition: { duration: 0.6 }
            })
            setIsFlipping(false)

            // Play back video
            console.log('Playing back video')
            if (backVideoRef.current) {
              backVideoRef.current.currentTime = 0;
              backVideoRef.current.play();
              
              // Wait for back video to end
              await new Promise<void>((resolve) => {
                const handleEnded = () => {
                  console.log('Back video ended');
                  backVideoRef.current?.removeEventListener('ended', handleEnded);
                  resolve();
                };
                backVideoRef.current.addEventListener('ended', handleEnded);
              });

              // Reset front video before flipping back
              if (frontVideoRef.current) {
                frontVideoRef.current.currentTime = 0;
                // Pause to ensure it stays at the first frame
                frontVideoRef.current.pause();
              }

              // Flip to front
              console.log('Flipping to front')
              setIsFlipping(true)
              await controls.start({ 
                rotateY: 360,
                transition: { duration: 0.6 }
              })
              
              // Reset rotation without animation
              controls.set({ rotateY: 0 })
              setIsFlipping(false)
            }

            // Schedule next cycle
            timeoutId = setTimeout(playAndFlip, 500);
          }
        } catch (error) {
          console.error('Error in flip animation cycle:', error)
          timeoutId = setTimeout(playAndFlip, 1000);
        }
      };

      playAndFlip();
    }

    const bothVideosLoaded = frontVideoLoaded && backVideoLoaded
    if (!imageOnly && bothVideosLoaded && !videoError) {
      console.log('Both videos loaded, starting animation cycle')
      flipCard()
    }

    return () => {
      console.log('Cleaning up video playback')
      if (timeoutId) clearTimeout(timeoutId);
      if (frontVideoRef.current) {
        frontVideoRef.current.pause()
        frontVideoRef.current.currentTime = 0
      }
      if (backVideoRef.current) {
        backVideoRef.current.pause()
        backVideoRef.current.currentTime = 0
      }
    }
  }, [controls, imageOnly, frontVideoLoaded, backVideoLoaded, videoError])

  // Log props on mount
  useEffect(() => {
    console.log('FlippingCard props:', { frontVideo, backVideo, isCenter, imageOnly })
  }, [frontVideo, backVideo, isCenter, imageOnly])

  return (
    <motion.div
      className={`relative ${isCenter ? 'z-20' : 'z-10'} ${className}`}
      style={{ 
        transformStyle: 'preserve-3d',
        zIndex,
        perspective: '1000px',
        ...dimensions
      }}
      initial={{ scale: 1 }}
      animate={imageOnly ? { scale: scaleValue } : controls}
      transition={{ duration: 0.3 }}
    >
      <div 
        className="absolute w-full h-full"
        style={{ 
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden'
        }}
      >
        {(imageOnly || image) ? (
          <motion.div
            className="relative w-full h-full overflow-hidden rounded-xl"
            whileHover="hover"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.img 
              src={image} 
              alt="" 
              className="w-full h-full object-cover"
              initial={{ filter: 'grayscale(100%)' }}
              whileHover={{
                filter: 'grayscale(0%)',
                transition: {
                  duration: 0.5,
                  ease: [0.43, 0.13, 0.23, 0.96]
                }
              }}
              style={{
                clipPath: 'inset(0 0 0 0)',
                WebkitClipPath: 'inset(0 0 0 0)'
              }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-t"
              initial={{ 
                background: 'linear-gradient(to top, rgba(0,0,0,0.1) 0%, transparent 100%)',
                y: '100%'
              }}
              whileHover={{
                y: '0%',
                transition: {
                  duration: 0.4,
                  ease: [0.43, 0.13, 0.23, 0.96]
                }
              }}
            />
          </motion.div>
        ) : (
          <>
            <video 
              ref={frontVideoRef}
              className="w-full h-full object-cover rounded-xl"
              muted
              playsInline
              preload="auto"
              controls={false}
              disablePictureInPicture
              disableRemotePlayback
            >
              <source src={frontVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {!frontVideoLoaded && !videoError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">
                <p className="text-gray-500 text-sm">Loading video...</p>
              </div>
            )}
            {videoError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">
                <p className="text-red-500 text-sm">{videoError}</p>
              </div>
            )}
          </>
        )}
      </div>
      
      {!imageOnly && (
        <div 
          className="absolute w-full h-full"
          style={{ 
            transform: 'rotateY(180deg)',
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}
        >
          <video 
            ref={backVideoRef}
            className="w-full h-full object-cover rounded-xl"
            muted
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
          >
            <source src={backVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {!backVideoLoaded && !videoError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">
              <p className="text-gray-500 text-sm">Loading video...</p>
            </div>
          )}
          {videoError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">
              <p className="text-red-500 text-sm">{videoError}</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
} 