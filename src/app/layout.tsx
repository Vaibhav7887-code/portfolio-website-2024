'use client'

import { Alice, Sacramento } from 'next/font/google'
import { Open_Sans } from 'next/font/google'
import CustomCursor from '@/components/CustomCursor'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { track } from '@vercel/analytics'

const alice = Alice({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-alice'
})

const sacramento = Sacramento({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-sacramento'
})

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-opensans'
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Add performance tracking
  if (typeof window !== 'undefined') {
    const loadTime = window.performance.now()
    track('page_load', { loadTime })
  }

  return (
    <html lang="en" className={`${alice.variable} ${sacramento.variable} ${openSans.variable}`}>
      <body>
        <CustomCursor />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
