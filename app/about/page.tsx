import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, Compass, Globe2, HeartPulse, Lightbulb, Users } from 'lucide-react'

import { PageHero } from '@/components/shared/PageHero'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { FeatureCard } from '@/components/shared/FeatureCard'
import { Testimonial } from '@/components/shared/Testimonial'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export const metadata: Metadata = {
  title: 'About | Alliance AI',
  description: 'Meet the team building the Alliance AI and learn about our mission, vision, and milestones.',
  openGraph: {
    title: 'About Alliance AI',
    description: 'Learn how Alliance AI powers connections between companies and AI experts.',
  },
}

const mission = [
  {
    title: 'Mission',
    description: 'Accelerate responsible AI adoption by connecting organizations with trusted experts, solutions, and education.',
    icon: Lightbulb,
  },
  {
    title: 'Vision',
    description: 'A world where every team can harness artificial intelligence with clarity, confidence, and measurable impact.',
    icon: Compass,
  },
]

const milestones = [
  {
    year: '2022',
    title: 'Founding team assembled',
    description: 'AI strategists, product builders, and educators joined forces to reimagine how organizations access AI talent.',
  },
  {
    year: '2023',
    title: 'Marketplace beta launch',
    description: 'Onboarded 150 vetted providers and facilitated the first $1M in AI services across finance and healthcare.',
  },
  {
    year: '2024',
    title: 'Global expansion',
    description: 'Introduced multilingual provider experiences and launched remote collaboration tools for distributed teams.',
  },
]

const team = [
  {
    name: 'Maya Chen',
    role: 'Co-founder & CEO',
    initials: 'MC',
    bio: 'Previously led AI strategy at a Fortune 100 enterprise, partnering with teams to scale automation responsibly.',
    socials: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com' },
      { label: 'Twitter', href: 'https://twitter.com' },
    ],
  },
  {
    name: 'Julian Rivera',
    role: 'Chief Product Officer',
    initials: 'JR',
    bio: 'Product leader focused on intelligent UX, formerly building AI tooling at high-growth SaaS companies.',
    socials: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com' },
    ],
  },
  {
    name: 'Selena Ahmed',
    role: 'Head of Provider Success',
    initials: 'SA',
    bio: 'Operational expert supporting provider enablement, with a decade leading consulting partnerships.',
    socials: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com' },
    ],
  },
  {
    name: 'Marcus Lee',
    role: 'Director of Education',
    initials: 'ML',
    bio: 'Former AI curriculum director committed to accessible upskilling for cross-functional teams.',
    socials: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com' },
    ],
  },
]

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-24 pt-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <PageHero
          eyebrow="About"
          title="Building the definitive AI talent marketplace"
          description="We believe every organization deserves a clear path to deploy AI responsibly. Our platform blends vetted expertise with human-centered support to make that possible."
          align="center"
          actions={
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="h-12 rounded-xl px-8 text-base">
                <Link href="/contact">
                  Partner with us
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 rounded-xl px-8 text-base">
                <Link href="/careers">Explore careers</Link>
              </Button>
            </div>
          }
        />
      </div>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl grid gap-6 md:grid-cols-2">
          {mission.map((item) => (
            <Card key={item.title} className="border border-white/60 bg-white/85 shadow-sm">
              <CardHeader className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <CardTitle className="text-2xl text-gray-900">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-base text-gray-600">{item.description}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          <SectionHeader
            align="center"
            eyebrow="Milestones"
            title="Moments that shaped us"
            description="We are continually listening to customers and providers to guide our roadmap."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {milestones.map((milestone) => (
              <Card key={milestone.year} className="border border-white/60 bg-white/85 shadow-sm">
                <CardHeader className="space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary">{milestone.year}</p>
                  <CardTitle className="text-xl text-gray-900">{milestone.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600">{milestone.description}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          <SectionHeader
            align="center"
            eyebrow="Team"
            title="People behind the platform"
            description="We are designers, strategists, and operators united by a commitment to responsible AI adoption."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <Card key={member.name} className="border border-white/60 bg-white/85 shadow-sm">
                <CardHeader className="space-y-3">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-gray-900">{member.name}</CardTitle>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-gray-600">
                  <p>{member.bio}</p>
                  <div className="flex flex-wrap gap-3">
                    {member.socials.map((social) => (
                      <Link
                        key={social.label}
                        href={social.href}
                        className="text-sm font-medium text-primary hover:text-primary/80"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {social.label}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-white/40 bg-white/90 p-10 shadow-lg backdrop-blur">
          <div className="grid gap-8 lg:grid-cols-[1.1fr,1fr] lg:items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-gray-900 md:text-4xl">Committed to responsible AI</h2>
              <p className="text-lg text-gray-600">
                Our team partners with ethicists, researchers, and customer councils to ensure every engagement aligns with measurable outcomes and accountability.
              </p>
            </div>
            <Testimonial
              quote="The team at Alliance AI marries deep technical expertise with a genuine care for end-users and stakeholders."
              author="Grace Okoye"
              role="Advisor"
              company="Responsible AI Collective"
            />
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-5xl border border-primary/40 bg-primary text-primary-foreground shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl">Let us collaborate</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 text-lg text-primary-foreground/85 md:flex-row md:items-center md:justify-between">
            <p className="max-w-2xl">
              We love partnering with organizations pushing the boundaries of responsible AI. Explore advisory programs or share your story with us.
            </p>
            <Button asChild variant="secondary" size="lg" className="h-12 rounded-xl px-8 text-base">
              <Link href="/contact">Contact our team</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
