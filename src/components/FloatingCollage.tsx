'use client'
import { motion } from 'framer-motion'
import { useMediaQuery } from '../hooks/useMediaQuery'

interface ImageProps {
  src: string
  width: number
  height: number
  delay: number
}

const images: ImageProps[] = [
  { src: '/AboutPic/1.jpeg', width: 180, height: 240, delay: 0 },
  { src: '/AboutPic/2.png', width: 210, height: 165, delay: 1 },
  { src: '/AboutPic/3.jpeg', width: 150, height: 150, delay: 2 },
  { src: '/AboutPic/4.jpeg', width: 165, height: 210, delay: 3 },
  { src: '/AboutPic/5.jpeg', width: 135, height: 180, delay: 4 },
]

const originalImages: ImageProps[] = [
  { src: '/AboutPic/1.jpeg', width: 120, height: 160, delay: 0 },
  { src: '/AboutPic/2.png', width: 140, height: 110, delay: 1 },
  { src: '/AboutPic/3.jpeg', width: 100, height: 100, delay: 2 },
  { src: '/AboutPic/4.jpeg', width: 110, height: 140, delay: 3 },
  { src: '/AboutPic/5.jpeg', width: 90, height: 120, delay: 4 },
]

export default function FloatingCollage() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isLandscape = useMediaQuery('(orientation: landscape)')

  // Choose image set based on mode
  const activeImages = isMobile && !isLandscape ? images : originalImages
  const containerHeight = isMobile && !isLandscape ? 'h-[300px]' : isMobile ? 'h-[400px]' : 'h-[600px]'

  return (
    <div 
      className={`relative w-full ${containerHeight} overflow-visible bg-transparent rounded-xl`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {activeImages.map((img, index) => {
          let xOffset, yOffset;
          
          if (isMobile && !isLandscape) {
            // Portrait mobile - 2 rows layout
            if (index < 2) {
              // Top row
              xOffset = (index - 0.5) * 120
              yOffset = -60
            } else {
              // Bottom row
              xOffset = ((index - 2) - 1) * 120
              yOffset = 60
            }
          } else if (isMobile) {
            // Landscape mobile
            xOffset = (index - 2) * 50
            yOffset = Math.sin(index) * 30
          } else {
            // Desktop
            xOffset = (index - 2) * 80
            yOffset = Math.sin(index) * 40
          }

          const scaleFactor = isMobile && !isLandscape ? 1.2 : isMobile ? 0.7 : 1

          return (
            <motion.div
              key={index}
              className="absolute rounded-lg shadow-lg overflow-hidden"
              style={{
                width: img.width * scaleFactor,
                height: img.height * scaleFactor,
              }}
              initial={{ 
                opacity: 0, 
                scale: 0.8,
                x: xOffset,
                y: yOffset
              }}
              animate={{ 
                opacity: 1,
                scale: 1,
                x: [xOffset, xOffset + (isMobile ? 10 : 15), xOffset],
                y: [yOffset, yOffset - (isMobile ? 15 : 20), yOffset],
                rotate: [-2, 2, -2],
              }}
              transition={{
                duration: 6 + index,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: img.delay * 0.3,
              }}
              whileHover={{
                scale: 1.05,
                rotate: 0,
                transition: { duration: 0.3 }
              }}
            >
              <img 
                src={img.src}
                alt={`About image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
} 