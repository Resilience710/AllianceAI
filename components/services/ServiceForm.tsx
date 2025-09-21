"use client"

import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { ServiceVisibility } from "@/types/service"

const visibilityOptions: ServiceVisibility[] = ["public", "draft"]

const categories = [
  "Chatbots",
  "Automation",
  "Consulting",
  "Training",
  "Design",
  "Analytics",
  "Marketing",
]

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120, "Title is too long"),
  shortDescription: z
    .string()
    .min(16, "Description must be at least 16 characters")
    .max(400, "Description is too long"),
  category: z.string().min(1, "Select a category"),
  price: z
    .number({ invalid_type_error: "Enter a numeric price" })
    .min(0, "Price must be at least 0"),
  tags: z.string().optional(),
  visibility: z.enum(["public", "draft"] as const),
  coverImageUrl: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || /^https?:\/\/.+/.test(value), "Enter a valid URL"),
})

export type ServiceFormValues = z.infer<typeof formSchema>

export type ServicePayload = {
  title: string
  shortDescription: string
  category: string
  price: number
  tags: string[]
  visibility: ServiceVisibility
  coverImageUrl?: string | null
}

interface ServiceFormProps {
  initialValues?: Partial<ServicePayload> & { tags?: string[] }
  onSubmit: (payload: ServicePayload) => Promise<void>
  submitLabel?: string
  error?: string | null
}

export function ServiceForm({ initialValues, onSubmit, submitLabel = "Save service", error }: ServiceFormProps) {
  const defaultValues = useMemo<ServiceFormValues>(
    () => ({
      title: initialValues?.title ?? "",
      shortDescription: initialValues?.shortDescription ?? "",
      category: initialValues?.category ?? categories[0],
      price: initialValues?.price ?? 0,
      tags: initialValues?.tags?.join(", ") ?? "",
      visibility: initialValues?.visibility ?? "public",
      coverImageUrl: initialValues?.coverImageUrl ?? "",
    }),
    [initialValues]
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const currentVisibility = watch("visibility")

  const handleVisibilityToggle = (value: ServiceVisibility) => {
    setValue("visibility", value, { shouldValidate: true })
  }

  const submitHandler = async (values: ServiceFormValues) => {
    const tagsArray = values.tags
      ?.split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    await onSubmit({
      title: values.title.trim(),
      shortDescription: values.shortDescription.trim(),
      category: values.category,
      price: values.price,
      tags: tagsArray ?? [],
      visibility: values.visibility,
      coverImageUrl: values.coverImageUrl ? values.coverImageUrl.trim() : undefined,
    })
  }

  return (
    <Card className="border border-white/50 bg-white/90 shadow-xl">
      <CardHeader className="space-y-2">
        <CardTitle>Create or update a service</CardTitle>
        <CardDescription>
          Share the offering providers can deliver to clients. Set pricing, visibility, and discoverability tags.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Service title</Label>
              <Input id="title" placeholder="AI Strategy Workshop" {...register("title")}
              />
              {errors.title ? <p className="text-sm text-destructive">{errors.title.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                {...register("category")}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category ? <p className="text-sm text-destructive">{errors.category.message}</p> : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short description</Label>
            <Textarea
              id="shortDescription"
              rows={4}
              placeholder="Describe the outcome clients can expect."
              {...register("shortDescription")}
            />
            {errors.shortDescription ? (
              <p className="text-sm text-destructive">{errors.shortDescription.message}</p>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min={0}
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price ? <p className="text-sm text-destructive">{errors.price.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label>Visibility</Label>
              <div className="flex items-center gap-3">
                {visibilityOptions.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleVisibilityToggle(value)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-sm capitalize transition",
                      currentVisibility === value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-white/50 bg-white text-gray-600 hover:border-primary/50"
                    )}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <input type="hidden" {...register("visibility")}
              />
              {errors.visibility ? <p className="text-sm text-destructive">{errors.visibility.message}</p> : null}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input id="tags" placeholder="automation, sales, strategy" {...register("tags")}
              />
              <p className="text-xs text-muted-foreground">Separate tags with commas.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverImageUrl">Cover image URL (optional)</Label>
              <Input id="coverImageUrl" placeholder="https://example.com/image.jpg" {...register("coverImageUrl")}
              />
              {errors.coverImageUrl ? (
                <p className="text-sm text-destructive">{errors.coverImageUrl.message}</p>
              ) : null}
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}