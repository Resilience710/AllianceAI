import Link from 'next/link'
import { Bot, Github, Linkedin } from 'lucide-react'

import { cn } from '@/lib/utils'

const footerLinks = {
  platform: [
    { href: '/browse', label: 'Browse Solutions' },
    { href: '/providers', label: 'For Providers' },
    { href: '/pricing', label: 'Pricing' },
  ],
  support: [
    { href: '/help-center', label: 'Help Center' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/community', label: 'Community' },
  ],
  company: [
    { href: '/about', label: 'About' },
    { href: '/careers', label: 'Careers' },
    { href: '/privacy', label: 'Privacy' },
  ],
}

const socialLinks = [
  { href: 'https://github.com', label: 'GitHub', icon: Github },
  { href: 'https://www.linkedin.com', label: 'LinkedIn', icon: Linkedin },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-gray-950 text-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Bot className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-lg font-semibold">AI Marketplace</span>
            </Link>
            <p className="text-sm text-gray-400">
              Connecting organizations with AI experts, intelligent agents, and training to unlock next-generation impact.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-gray-300 transition hover:border-primary/60 hover:text-primary"
                  aria-label={link.label}
                  target="_blank"
                  rel="noreferrer"
                >
                  <link.icon className="h-4 w-4" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-300">Platform</h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              {footerLinks.platform.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-gray-100">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-300">Support</h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              {footerLinks.support.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-gray-100">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-300">Company</h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              {footerLinks.company.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-gray-100">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} AI Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
