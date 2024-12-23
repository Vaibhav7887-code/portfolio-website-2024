'use client'
import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Initial check for mobile device
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )

    // Set initial value based on media query and device type
    const media = window.matchMedia(query)
    setMatches(media.matches || isMobileDevice)

    // Create event listener function
    const listener = () => setMatches(media.matches || isMobileDevice)

    // Add listener
    media.addEventListener('change', listener)

    // Clean up
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

export function useMobileLandscape(): boolean {
  const [isLandscape, setIsLandscape] = useState(false)

  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = window.innerWidth <= 768
      const isLandscape = window.innerWidth > window.innerHeight
      setIsLandscape(isMobile && isLandscape)
    }

    // Initial check
    checkOrientation()

    // Add listeners
    window.addEventListener('resize', checkOrientation)
    window.addEventListener('orientationchange', checkOrientation)

    return () => {
      window.removeEventListener('resize', checkOrientation)
      window.removeEventListener('orientationchange', checkOrientation)
    }
  }, [])

  return isLandscape
} 