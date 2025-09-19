'use client'

import * as React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const contactSchema = z.object({
  name: z.string().min(2, 'Please provide your name.'),
  email: z.string().email('Enter a valid email address.'),
  topic: z.enum(['support', 'partnership', 'provider', 'press'], {
    required_error: 'Select a topic so we can route your request.',
  }),
  message: z
    .string()
    .min(20, 'Share a few more details so we can help effectively.')
    .max(2000, 'Please keep your message under 2000 characters.'),
})

type ContactValues = z.infer<typeof contactSchema>

const topics = [
  { value: 'support', label: 'Support' },
  { value: 'partnership', label: 'Partnerships' },
  { value: 'provider', label: 'Provider applications' },
  { value: 'press', label: 'Press & media' },
]

export function ContactForm() {
  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle')
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      topic: undefined,
      message: '',
    },
  })

  const onSubmit = React.useCallback(
    async (values: ContactValues) => {
      setStatus('idle')

      try {
        await new Promise((resolve) => setTimeout(resolve, 900))
        setStatus('success')
        reset({ name: '', email: '', topic: undefined, message: '' })
      } catch (error) {
        console.error(error)
        setStatus('error')
      }
    },
    [reset]
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input
            id="contact-name"
            placeholder="Jane Doe"
            aria-invalid={errors.name ? 'true' : 'false'}
            {...register('name')}
          />
          {errors.name ? (
            <p className="text-sm text-destructive" role="alert">
              {errors.name.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            type="email"
            placeholder="you@example.com"
            aria-invalid={errors.email ? 'true' : 'false'}
            {...register('email')}
          />
          {errors.email ? (
            <p className="text-sm text-destructive" role="alert">
              {errors.email.message}
            </p>
          ) : null}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-topic">Topic</Label>
        <Controller
          control={control}
          name="topic"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                id="contact-topic"
                className={cn(
                  'h-12 rounded-xl border border-input bg-white text-sm',
                  field.value ? '' : 'text-muted-foreground'
                )}
                aria-invalid={errors.topic ? 'true' : 'false'}
              >
                <SelectValue placeholder="What can we help with?" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic.value} value={topic.value}>
                    {topic.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.topic ? (
          <p className="text-sm text-destructive" role="alert">
            {errors.topic.message}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          rows={6}
          placeholder="Share context about your goals, timeline, and any helpful links."
          aria-invalid={errors.message ? 'true' : 'false'}
          {...register('message')}
        />
        {errors.message ? (
          <p className="text-sm text-destructive" role="alert">
            {errors.message.message}
          </p>
        ) : null}
      </div>
      <div className="space-y-4">
        <Button type="submit" size="lg" className="h-12 rounded-xl px-8" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Submit message'}
        </Button>
        {status === 'success' ? (
          <p className="text-sm font-medium text-green-600">Thank you! We will respond shortly.</p>
        ) : null}
        {status === 'error' ? (
          <p className="text-sm font-medium text-destructive">
            Something went wrong. Please retry or email support@aimarketplace.com.
          </p>
        ) : null}
      </div>
    </form>
  )
}