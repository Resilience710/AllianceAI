import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'

import { SiteFooter } from '@/components/layout/SiteFooter'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Alliance AI - Connect with AI Experts & Agents',
  description:
    'A marketplace connecting companies with AI experts, agents, and solutions. Find AI education, training, consulting, and custom AI agents.',
  metadataBase: new URL('https://example.com'),
  openGraph: {
    title: 'Alliance AI',
    description:
      'Discover AI experts, intelligent agents, and consulting services tailored to your business.',
    url: 'https://example.com',
    siteName: 'Alliance AI',
    images: [
      {
        url: 'https://example.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Alliance AI'
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 text-slate-900 antialiased',
          inter.className
        )}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:inset-x-0 focus:top-4 focus:z-50 focus:mx-auto focus:w-max focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}








