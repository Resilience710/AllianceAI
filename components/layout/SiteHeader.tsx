'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Bot, Menu, X } from 'lucide-react'
import { signOut } from 'firebase/auth'

import { useAuth } from '@/components/auth/AuthProvider'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { auth } from '@/lib/firebase'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/browse', label: 'Browse' },
  { href: '/providers', label: 'For Providers' },
  { href: '/about', label: 'About' },
]

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, loading } = useAuth()

  React.useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const roleLabel = profile?.role === 'provider' ? 'Provider' : profile?.role === 'client' ? 'Client' : null

  const handleSignOut = React.useCallback(async () => {
    await signOut(auth)
    setMobileOpen(false)
    router.push('/')
  }, [router])

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Bot className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold text-foreground">Alliance AI</span>
          </Link>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-foreground/80',
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {loading ? null : user && profile ? (
            <>
              {roleLabel ? (
                <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-semibold">
                  {roleLabel}
                </Badge>
              ) : null}
              <Button asChild variant="ghost" className="text-sm font-medium">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="outline" onClick={handleSignOut} className="text-sm font-medium">
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className={cn(buttonVariants({ variant: 'ghost' }), 'text-sm font-medium')}>
                Sign In
              </Link>
              <Button asChild>
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </Button>
      </div>
      {mobileOpen ? (
        <div id="mobile-navigation" className="border-t border-border/60 bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-base font-medium',
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
            <div className="flex flex-col gap-3 pt-2">
              {loading ? null : user && profile ? (
                <>
                  {roleLabel ? (
                    <Badge variant="secondary" className="w-fit rounded-full px-3 py-1 text-xs font-semibold">
                      {roleLabel}
                    </Badge>
                  ) : null}
                  <Link href="/dashboard" className={cn(buttonVariants({ variant: 'outline' }))}>
                    Dashboard
                  </Link>
                  <Button onClick={handleSignOut}>Sign Out</Button>
                </>
              ) : (
                <>
                  <Link href="/sign-in" className={cn(buttonVariants({ variant: 'outline' }))}>
                    Sign In
                  </Link>
                  <Button asChild>
                    <Link href="/sign-up">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
