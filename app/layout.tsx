import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })

export const metadata: Metadata = {
  title: 'BrainSpark - Play Smart. Grow Smarter.',
  description: 'Fun learning games for kids ages 6-12. Math games, logic puzzles, riddles, and cognitive exercises that make learning feel like play.',
  keywords: ['kids learning', 'math games', 'logic puzzles', 'CoGAT prep', 'brain training', 'educational games'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
