import './globals.css'
import { Alice, Sacramento, Open_Sans } from 'next/font/google'
import CustomCursor from '@/components/CustomCursor'

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

export const metadata = {
  title: 'Vaibhav Sharma - UX Design Engineer',
  description: 'Portfolio of Vaibhav Sharma, UX Design Engineer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${alice.variable} ${sacramento.variable} ${openSans.variable}`}>
        <CustomCursor />
        {children}
      </body>
    </html>
  )
}
