import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowUpRight, MessageCircle, UsersRound, Twitter, Rss, Shield } from 'lucide-react'

import { PageHero } from '@/components/shared/PageHero'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export const metadata: Metadata = {
  title: 'Community | Alliance AI',
  description: 'Join the Alliance AI community to connect with peers, share insights, and stay updated on new releases.',
  openGraph: {
    title: 'Alliance AI Community',
    description: 'Connect with AI builders, providers, and teams adopting AI together.',
  },
}

const destinations = [
  {
    name: 'Community forum',
    description: 'Meet fellow practitioners, ask questions, and share wins from your AI projects.',
    icon: UsersRound,
    href: 'https://community.example.com',
  },
  {
    name: 'Discord',
    description: 'Join live discussions, office hours, and peer roundtables every week.',
    icon: MessageCircle,
    href: 'https://discord.gg/example',
  },
  {
    name: 'Twitter',
    description: 'Follow product updates, release notes, and customer stories in real time.',
    icon: Twitter,
    href: 'https://twitter.com/example',
  },
  {
    name: 'Blog',
    description: 'Deep-dives on responsible AI practices, playbooks, and provider spotlights.',
    icon: Rss,
    href: 'https://blog.example.com',
  },
]

const principles = [
  'Respect lived experiences and diverse backgrounds.',
  'Share actionable feedback and resources without solicitation.',
  'Protect sensitive data and follow confidentiality guidelines.',
  'Champion responsible AI and ethical decision-making.',
]

export default function CommunityPage() {
  return (
    <div className="space-y-16 pb-24 pt-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <PageHero
          eyebrow="Community"
          title="Grow together with AI practitioners"
          description="Connect with builders, strategists, and providers to exchange lessons learned and accelerate adoption."
          align="center"
          actions={
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="h-12 rounded-xl px-8 text-base">
                <Link href="https://community.example.com" target="_blank" rel="noreferrer">
                  Join the forum
                  <ArrowUpRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 rounded-xl px-8 text-base">
                <Link href="/help-center">View help center</Link>
              </Button>
            </div>
          }
        />
      </div>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          <SectionHeader
            align="center"
            eyebrow="Connect"
            title="Choose your space"
            description="We host spaces for every stage of your AI journey?join the ones that match how you learn best."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {destinations.map((destination) => (
              <Card key={destination.name} className="border border-white/60 bg-white/90 shadow-sm">
                <CardHeader className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <destination.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{destination.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-gray-600">
                  <p>{destination.description}</p>
                  <Link
                    href={destination.href}
                    className="text-sm font-medium text-primary hover:text-primary/80"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8" id="code-of-conduct">
        <Card className="mx-auto max-w-5xl border border-white/60 bg-white/90 shadow-sm">
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Shield className="h-5 w-5" aria-hidden="true" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Code of conduct</CardTitle>
            </div>
            <Link href="#" className="text-sm font-medium text-primary hover:text-primary/80">
              View full policy
            </Link>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-600">
            <p>We cultivate an inclusive community centered on respect, curiosity, and responsible AI practices.</p>
            <ul className="space-y-3">
              {principles.map((principle) => (
                <li key={principle} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                  <span>{principle}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="px-4 sm:px-6 lg:px-8" id="newsletter">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-primary/40 bg-primary text-primary-foreground shadow-xl">
          <CardHeader className="space-y-4 p-10">
            <CardTitle className="text-3xl md:text-4xl">Subscribe to the AI field notes</CardTitle>
            <p className="text-lg text-primary-foreground/85">
              Receive monthly highlights from providers, product walkthroughs, and curated prompts to accelerate your learning curve.
            </p>
            <form className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                type="email"
                required
                placeholder="name@company.com"
                className="h-12 flex-1 rounded-xl border border-white/30 bg-white/10 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button type="submit" variant="secondary" size="lg" className="h-12 rounded-xl px-8 text-base">
                Join newsletter
              </Button>
            </form>
          </CardHeader>
        </div>
      </section>
    </div>
  )
}
