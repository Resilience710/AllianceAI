import Link from 'next/link'
import type { Metadata } from 'next'
import { CheckCircle2, Sparkles } from 'lucide-react'

import { PageHero } from '@/components/shared/PageHero'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionItem } from '@/components/ui/accordion'

export const metadata: Metadata = {
  title: 'Pricing | AI Marketplace',
  description: 'Choose a pricing plan that fits your AI adoption journey, from free exploration to enterprise scale.',
  openGraph: {
    title: 'AI Marketplace Pricing',
    description: 'Flexible pricing to explore, launch, and scale AI initiatives.',
  },
}

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Get started with curated resources and sample workflows to explore AI opportunities.',
    cta: 'Create free account',
    highlight: false,
    features: [
      'Marketplace browsing',
      'Saved provider lists',
      'AI readiness checklist',
      'Monthly insights newsletter',
    ],
  },
  {
    name: 'Pro',
    price: '$249/mo',
    description: 'Unlock collaboration tools, provider matching, and tailored solution recommendations.',
    cta: 'Start Pro trial',
    highlight: true,
    features: [
      'All Free features',
      'Provider matchmaking sessions',
      'Project scoping workspace',
      'Team seats (up to 5 users)',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Talk to us',
    description: 'Enterprise-grade onboarding, governance, and integrations for global teams.',
    cta: 'Schedule a demo',
    highlight: false,
    features: [
      'Custom procurement workflows',
      'Security & compliance reviews',
      'Dedicated success manager',
      'Legacy system integrations',
      'Education enablement credits',
    ],
  },
]

const comparison = [
  { feature: 'Curated provider directory', free: true, pro: true, enterprise: true },
  { feature: 'Provider matchmaking', free: false, pro: true, enterprise: true },
  { feature: 'Project workspace', free: false, pro: true, enterprise: true },
  { feature: 'Single sign-on', free: false, pro: false, enterprise: true },
  { feature: 'Managed contracting', free: false, pro: false, enterprise: true },
]

const faqs = [
  {
    question: 'Can I upgrade or downgrade at any time?',
    answer:
      'Yes. You can move between plans as your AI programs evolve. New billing changes apply on your next renewal date.',
  },
  {
    question: 'Do you offer implementation support?',
    answer:
      'Pro and Enterprise plans include guided onboarding and project scoping. Enterprise customers receive bespoke enablement.',
  },
  {
    question: 'Is there a discount for annual commitments?',
    answer:
      'Yes, annual contracts include a 15% discount and extended onboarding sessions. Contact sales for custom pricing.',
  },
]

export default function PricingPage() {
  return (
    <div className="space-y-16 pb-24 pt-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <PageHero
          eyebrow="Pricing"
          title="Flexible plans to launch and scale AI initiatives"
          description="From exploratory teams to enterprise programs, choose the plan that aligns with your roadmap."
          align="center"
          actions={
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="h-12 rounded-xl px-8 text-base">
                <Link href="/onboarding">Get started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 rounded-xl px-8 text-base">
                <Link href="/contact">Talk to sales</Link>
              </Button>
            </div>
          }
        />
      </div>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.name}
              className={`border ${tier.highlight ? 'border-primary bg-primary text-primary-foreground shadow-xl' : 'border-white/60 bg-white/85 shadow-sm'}`}
            >
              <CardHeader className="space-y-3">
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <p className="text-lg font-semibold">{tier.price}</p>
                <p className={`text-sm ${tier.highlight ? 'text-primary-foreground/85' : 'text-gray-600'}`}>
                  {tier.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3 text-sm">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckCircle2
                        className={`mt-0.5 h-4 w-4 ${tier.highlight ? 'text-primary-foreground' : 'text-primary'}`}
                        aria-hidden="true"
                      />
                      <span className={tier.highlight ? 'text-primary-foreground/90' : 'text-gray-600'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant={tier.highlight ? 'secondary' : 'outline'}
                  className="h-11 rounded-xl px-6 text-sm"
                >
                  <Link href="/onboarding">{tier.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-8 rounded-3xl border border-white/60 bg-white/90 p-8 shadow-sm">
          <SectionHeader
            align="center"
            eyebrow="Compare"
            title="Feature breakdown"
            description="Every plan is crafted to match the level of guidance and governance you need."
          />
          <div className="hidden text-sm font-medium text-gray-600 sm:grid sm:grid-cols-4 sm:gap-6">
            <span className="sr-only">Feature</span>
            <span className="text-center">Free</span>
            <span className="text-center">Pro</span>
            <span className="text-center">Enterprise</span>
          </div>
          <div className="space-y-4">
            {comparison.map((item) => (
              <div
                key={item.feature}
                className="grid gap-4 rounded-2xl border border-gray-200 bg-white/85 p-4 sm:grid-cols-4 sm:items-center sm:px-6"
              >
                <p className="font-medium text-gray-900">{item.feature}</p>
                <ComparisonCell active={item.free} label="Free" />
                <ComparisonCell active={item.pro} label="Pro" />
                <ComparisonCell active={item.enterprise} label="Enterprise" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-8">
          <SectionHeader align="center" eyebrow="FAQ" title="Pricing questions" />
          <Accordion>
            {faqs.map((faq) => (
              <AccordionItem key={faq.question} heading={faq.question}>
                {faq.answer}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-5xl border border-primary/40 bg-primary text-primary-foreground shadow-xl">
          <CardHeader className="space-y-4">
            <CardTitle className="text-3xl md:text-4xl">Ready to chart your AI roadmap?</CardTitle>
            <p className="text-lg text-primary-foreground/85">
              Schedule a briefing call and we will help you design the right combination of partner support, education, and tooling.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-start">
            <Button asChild variant="secondary" size="lg" className="h-12 rounded-xl px-8 text-base">
              <Link href="/contact">Book a strategy session</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 rounded-xl border-white/60 px-8 text-base text-primary-foreground hover:bg-primary-foreground/10">
              <Link href="/help-center">Browse FAQ</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

interface ComparisonCellProps {
  active: boolean
  label: string
}

function ComparisonCell({ active, label }: ComparisonCellProps) {
  return (
    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 sm:hidden">{label}</span>
      {active ? (
        <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
      ) : (
        <span className="text-base text-gray-300" aria-hidden="true">-</span>
      )}
    </div>
  )
}
