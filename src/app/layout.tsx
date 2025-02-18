'use client'

import { Alice, Sacramento } from 'next/font/google'
import { Open_Sans } from 'next/font/google'
import CustomCursor from '@/components/CustomCursor'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'

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
