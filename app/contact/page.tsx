import type { Metadata } from 'next'
import { Mail, MapPin, Phone, Timer } from 'lucide-react'

import { PageHero } from '@/components/shared/PageHero'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { ContactForm } from './_components/contact-form'

export const metadata: Metadata = {
  title: 'Contact Us | AI Marketplace',
  description: 'Reach the AI Marketplace team for platform questions, partnership opportunities, or provider support.',
  openGraph: {
    title: 'Contact AI Marketplace',
    description: 'Get in touch with AI Marketplace for support, partnerships, or press inquiries.',
  },
}

const contactDetails = [
  {
    label: 'Email',
    value: 'support@aimarketplace.com',
    icon: Mail,
  },
  {
    label: 'Phone',
    value: '+1 (415) 555-0123',
    icon: Phone,
  },
  {
    label: 'Headquarters',
    value: '548 Market Street, San Francisco, CA',
    icon: MapPin,
  },
  {
    label: 'Support hours',
    value: 'Monday through Friday, 8am � 6pm PT',
    icon: Timer,
  },
]

export default function ContactPage() {
  return (
    <div className="space-y-16 pb-24 pt-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <PageHero
          eyebrow="Support"
          title="We are here to help"
          description="Share a few details and our team will get back to you within one business day."
          align="center"
        />
      </div>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr,0.8fr]">
          <Card className="border border-white/60 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>

          <Card className="border border-white/60 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Contact details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm text-gray-600">
              <p>
                Prefer to reach out directly? Our support specialists monitor these channels around the clock for high-priority requests.
              </p>
              <div className="space-y-4">
                {contactDetails.map((detail) => (
                  <div key={detail.label} className="flex items-start gap-3">
                    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <detail.icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{detail.label}</p>
                      <p>{detail.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <SectionHeader
            align="center"
            eyebrow="Response times"
            title="What to expect"
            description="We triage every message to guarantee fast resolutions for time-sensitive requests."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                heading: 'Platform support',
                body: 'Responses within 1 business day for technical and billing questions.',
              },
              {
                heading: 'Provider applications',
                body: 'Feedback within 5 business days including next steps and success resources.',
              },
              {
                heading: 'Enterprise inquiries',
                body: 'Dedicated follow-up within hours for enterprise roadmap and security questions.',
              },
            ].map((item) => (
              <Card key={item.heading} className="border border-white/60 bg-white/90 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">{item.heading}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600">{item.body}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}