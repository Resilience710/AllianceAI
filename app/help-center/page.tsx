import Link from 'next/link'
import type { Metadata } from 'next'
import { BookOpen, CreditCard, Search, Settings, UserCircle } from 'lucide-react'

import { PageHero } from '@/components/shared/PageHero'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Help Center | Alliance AI',
  description: 'Find answers to common questions or reach the Alliance AI support team for assistance.',
  openGraph: {
    title: 'Alliance AI Help Center',
    description: 'Browse support categories, guides, and contact options.',
  },
}

const categories = [
  {
    name: 'Accounts & Access',
    description: 'Account setup, roles, permissions, and security settings.',
    icon: UserCircle,
    href: '#accounts',
  },
  {
    name: 'Billing & Plans',
    description: 'Invoices, upgrades, payment methods, and credits.',
    icon: CreditCard,
    href: '#billing',
  },
  {
    name: 'Providers',
    description: 'Applications, onboarding, and marketplace success best practices.',
    icon: BookOpen,
    href: '#providers',
  },
  {
    name: 'Troubleshooting',
    description: 'Resolve common issues with projects, integrations, and collaboration.',
    icon: Settings,
    href: '#troubleshooting',
  },
]

const articles = [
  {
    title: 'Getting started with Alliance AI',
    summary: 'Set up your profile, invite teammates, and explore curated providers.',
    href: '#',
  },
  {
    title: 'Submitting a provider application',
    summary: 'Step-by-step guide to completing your application and required documentation.',
    href: '#',
  },
  {
    title: 'Collaborating in project workspaces',
    summary: 'Learn how to scope engagements, share briefs, and track milestones.',
    href: '#',
  },
]

export default function HelpCenterPage() {
  return (
    <div className="space-y-16 pb-24 pt-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <PageHero
          eyebrow="Support"
          title="Help Center"
          description="Search guides, explore best practices, and connect with our support team for tailored assistance."
          align="center"
          actions={
            <form className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  placeholder="Search articles"
                  className="h-12 rounded-xl border-gray-200 bg-white pl-11 text-base shadow-sm"
                  aria-label="Search help center"
                  name="query"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 rounded-xl px-8 text-base">
                Search
              </Button>
            </form>
          }
        />
      </div>

      <section className="px-4 sm:px-6 lg:px-8" id="categories">
        <div className="mx-auto max-w-7xl space-y-10">
          <SectionHeader
            align="center"
            eyebrow="Browse"
            title="Support categories"
            description="Jump into the topics that matter most for your team."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {categories.map((category) => (
              <Card key={category.name} className="border border-white/60 bg-white/90 shadow-sm">
                <CardHeader className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <category.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{category.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-gray-600">
                  <p>{category.description}</p>
                  <Link href={category.href} className="text-sm font-medium text-primary hover:text-primary/80">
                    Explore guides
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8" id="top-articles">
        <div className="mx-auto max-w-5xl space-y-6">
          <SectionHeader title="Top articles" description="Start with the most requested product and provider resources." align="left" />
          <div className="space-y-4">
            {articles.map((article) => (
              <Card key={article.title} className="border border-white/60 bg-white/90 shadow-sm">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-lg text-gray-900">{article.title}</CardTitle>
                  <p className="text-sm text-gray-600">{article.summary}</p>
                </CardHeader>
                <CardContent>
                  <Link href={article.href} className="text-sm font-medium text-primary hover:text-primary/80">
                    Read article
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8" id="contact">
        <Card className="mx-auto max-w-4xl border border-primary/40 bg-primary text-primary-foreground shadow-xl">
          <CardHeader className="space-y-4">
            <CardTitle className="text-3xl md:text-4xl">Need more help?</CardTitle>
            <p className="text-lg text-primary-foreground/85">
              Our support specialists respond within one business day. For urgent issues, use the chat widget inside your workspace.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-start">
            <Button asChild variant="secondary" size="lg" className="h-12 rounded-xl px-8 text-base">
              <Link href="/contact">Contact support</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 rounded-xl border-white/60 px-8 text-base text-primary-foreground hover:bg-primary-foreground/10">
              <Link href="/community">Join the community</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

