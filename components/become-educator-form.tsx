"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { becomeEducator } from "@/lib/instructor-service"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  expertise: z.string().min(10, "Please provide more details about your expertise"),
  experience: z.string().min(10, "Please provide more details about your experience"),
})

export default function BecomeEducatorForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      expertise: "",
      experience: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      await becomeEducator(values)
      toast({
        title: "Application Submitted",
        description: "Your application to become an educator has been submitted successfully.",
      })
      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to submit educator application:", error)
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Full Name
        </label>
        <Input id="name" {...form.register("name")} className="w-full" placeholder="Enter your full name" />
        {form.formState.errors.name && (
          <p className="mt-1 text-sm text-red-500">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email Address
        </label>
        <Input
          id="email"
          type="email"
          {...form.register("email")}
          className="w-full"
          placeholder="Enter your email address"
        />
        {form.formState.errors.email && (
          <p className="mt-1 text-sm text-red-500">{form.formState.errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="expertise" className="block text-sm font-medium mb-2">
          Areas of Expertise
        </label>
        <Textarea
          id="expertise"
          {...form.register("expertise")}
          className="w-full"
          placeholder="Describe your areas of expertise in Web3 and blockchain technology"
          rows={4}
        />
        {form.formState.errors.expertise && (
          <p className="mt-1 text-sm text-red-500">{form.formState.errors.expertise.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="experience" className="block text-sm font-medium mb-2">
          Teaching Experience
        </label>
        <Textarea
          id="experience"
          {...form.register("experience")}
          className="w-full"
          placeholder="Describe your teaching or content creation experience"
          rows={4}
        />
        {form.formState.errors.experience && (
          <p className="mt-1 text-sm text-red-500">{form.formState.errors.experience.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  )
}

