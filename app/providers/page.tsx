import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ArrowRight,
  BarChart3,
  BadgeCheck,
  Users,
  Rocket,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from 'lucide-react'

import { PageHero } from '@/components/shared/PageHero'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { FeatureCard } from '@/components/shared/FeatureCard'
import { Testimonial } from '@/components/shared/Testimonial'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'For Providers | Alliance AI',
  description: 'Join the Alliance AI to showcase your expertise, reach new clients, and deliver high-impact AI solutions.',
  openGraph: {
    title: 'Become an Alliance AI Provider',
    description: 'Partner with Alliance AI to connect with qualified buyers searching for AI expertise.',
  },
}

const steps = [
  {
    title: 'Apply and qualify',
    description: 'Tell us about your services, client wins, and team expertise. Our team reviews every partner to maintain quality.',
    icon: BadgeCheck,
  },
  {
    title: 'Launch your profile',
    description: 'Create a polished storefront with packaged offers, case studies, and onboarding flows tailored to your strengths.',
    icon: Rocket,
  },
  {
    title: 'Match with buyers',
    description: 'Receive high-intent leads from organizations ready to activate AI. Collaborate using our briefing and scoping tools.',
    icon: Users,
  },
  {
    title: 'Scale with insights',
    description: 'Track performance, gathering feedback and revenue analytics to expand offerings with confidence.',
    icon: BarChart3,
  },
]

const benefits = [
  {
    title: 'Qualified demand',
    description: 'Access vetted clients searching for AI agents, training, and consulting with defined budgets and timelines.',
    icon: UserPlus,
    accent: 'primary' as const,
  },
  {
    title: 'Enterprise-ready operations',
    description: 'Use shared workspaces, secure contracts, and compliance tooling designed for regulated industries.',
    icon: ShieldCheck,
    accent: 'green' as const,
  },
  {
    title: 'Co-marketing support',
    description: 'Launch campaigns, webinars, and showcases with our marketing team to amplify your brand and point of view.',
    icon: Sparkles,
    accent: 'purple' as const,
  },
]

const stats = [
  { label: 'Average deal size', value: '$42K' },
  { label: 'Time to first engagement', value: '12 days' },
  { label: 'Provider satisfaction', value: '97%' },
]

export default function ProvidersPage() {
  return (
    <div className="space-y-16 pb-24 pt-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <PageHero
          eyebrow="For Providers"
          title="Grow with Alliance AI"
          description="Reach qualified buyers, close projects faster, and deliver transformational AI programs through a trusted platform."
          align="center"
          actions={
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="h-12 rounded-xl px-8 text-base">
                <Link href="/onboarding?role=provider">
                  Become a provider
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 rounded-xl px-8 text-base">
                <Link href="/contact">Talk with our team</Link>
              </Button>
            </div>
          }
        />
      </div>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          <SectionHeader
            align="center"
            eyebrow="How it works"
            title="Purpose-built for AI experts"
            description="From application to activation, every step is designed to help you stay focused on delivering exceptional outcomes."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <FeatureCard
                key={step.title}
                icon={<step.icon className="h-6 w-6" aria-hidden="true" />}
                title={`0${index + 1}. ${step.title}`}
                description={step.description}
              >
                <p>Our partner success team guides you through onboarding, packaging, and launch.</p>
              </FeatureCard>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          <SectionHeader
            align="center"
            eyebrow="Platform benefits"
            title="All-in-one go-to-market enablement"
            description="Unlock tooling and support that remove friction from selling AI services."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => (
              <FeatureCard
                key={benefit.title}
                icon={<benefit.icon className="h-6 w-6" aria-hidden="true" />}
                title={benefit.title}
                description={benefit.description}
                accent={benefit.accent}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-white/40 bg-white/85 p-10 shadow-lg backdrop-blur">
          <div className="grid gap-8 lg:grid-cols-[1.1fr,1fr] lg:items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-gray-900 md:text-4xl">A trusted marketplace for providers</h2>
              <p className="text-lg text-gray-600">
                From boutique studios to enterprise consultancies, providers partner with Alliance AI to scale responsibly.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-gray-200 bg-white/80 px-5 py-4 text-center shadow-sm">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <Testimonial
              quote="Alliance AI has become our primary channel for strategic AI engagements with Fortune 500 companies."
              author="Leah Patel"
              role="Founder"
              company="Neural Atlas"
            />
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-5xl overflow-hidden border-primary/40 bg-primary text-primary-foreground shadow-xl">
          <CardContent className="grid gap-8 p-10 lg:grid-cols-[2fr,1fr] lg:items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold md:text-4xl">Showcase your AI expertise</h2>
              <p className="text-lg text-primary-foreground/85">
                Submit your application and our partner success team will walk you through the onboarding process.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button asChild size="lg" variant="secondary" className="h-12 rounded-xl px-8 text-base">
                <Link href="/onboarding?role=provider">Start application</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 rounded-xl border-white/60 px-8 text-base text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/help-center">Review partner FAQs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

