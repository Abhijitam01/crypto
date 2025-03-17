/**
 * Instructor Onboarding Page
 *
 * This page allows users to apply to become instructors on the platform.
 * It collects information about their expertise, experience, and teaching goals.
 *
 * Features:
 * - Multi-step application form
 * - Progress tracking
 * - Information about instructor benefits
 * - Success confirmation and next steps
 */

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { becomeInstructor, useAuth } from "@/lib/auth-service"
import { CheckCircle2, ChevronRight, Zap, Users, DollarSign } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioItem } from "@/components/ui/radio-group"

export default function TeachOnboardingPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    expertise: "",
    experience: "",
    topics: "",
    teachingStyle: "",
    agreement: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  // Pre-fill user data if available
  useState(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }))
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, teachingStyle: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await becomeInstructor()
      toast({
        title: "Application Submitted",
        description: "Your application to become an instructor has been approved!",
      })
      setStep(3) // Move to success step
    } catch (error) {
      console.error("Failed to submit instructor application:", error)
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Become an Instructor</h1>
        <p className="text-gray-400 mt-1">Share your knowledge, earn tokens, and help others learn blockchain skills</p>
      </div>

      {/* Progress bar */}
      <div className="w-full">
        <Progress value={(step / 3) * 100} className="h-2 bg-gray-700" />
        <div className="flex justify-between mt-2 text-sm text-gray-400">
          <span>Basic Info</span>
          <span>Teaching Details</span>
          <span>Complete</span>
        </div>
      </div>

      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="bg-[#1E293B] border-[#2D3748]">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription className="text-gray-400">Tell us about yourself and your expertise</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-[#0F172A] border-[#2D3748] focus-visible:ring-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-[#0F172A] border-[#2D3748] focus-visible:ring-blue-500"
                    placeholder="Enter your email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expertise">Areas of Expertise</Label>
                  <Textarea
                    id="expertise"
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleChange}
                    className="bg-[#0F172A] border-[#2D3748] focus-visible:ring-blue-500"
                    placeholder="Describe your areas of expertise in Web3 and blockchain technology"
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t border-[#2D3748] pt-4">
                <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="bg-[#1E293B] border-[#2D3748]">
              <CardHeader>
                <CardTitle className="text-lg">Instructor Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-900/30 p-2 rounded-lg mr-3">
                    <Zap className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Earn Tokens</h3>
                    <p className="text-sm text-gray-400">
                      Get rewarded for creating quality content and helping students
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-purple-900/30 p-2 rounded-lg mr-3">
                    <Users className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Build Your Audience</h3>
                    <p className="text-sm text-gray-400">Connect with thousands of learners interested in blockchain</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-900/30 p-2 rounded-lg mr-3">
                    <DollarSign className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Generate Income</h3>
                    <p className="text-sm text-gray-400">Convert tokens to cryptocurrency or fiat currency</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {step === 2 && (
        <Card className="bg-[#1E293B] border-[#2D3748]">
          <CardHeader>
            <CardTitle>Teaching Details</CardTitle>
            <CardDescription className="text-gray-400">
              Tell us about your teaching experience and what you'd like to teach
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Teaching Experience</Label>
                <Textarea
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="bg-[#0F172A] border-[#2D3748] focus-visible:ring-blue-500"
                  placeholder="Describe your teaching or content creation experience"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="topics">Course Topics</Label>
                <Textarea
                  id="topics"
                  name="topics"
                  value={formData.topics}
                  onChange={handleChange}
                  className="bg-[#0F172A] border-[#2D3748] focus-visible:ring-blue-500"
                  placeholder="What topics would you like to teach on our platform?"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Preferred Teaching Style</Label>
                <RadioGroup value={formData.teachingStyle} onValueChange={handleRadioChange}>
                  <div className="flex items-center space-x-2">
                    <RadioItem value="video" id="video" className="border-gray-600 text-blue-600" />
                    <Label htmlFor="video">Video Lectures</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioItem value="interactive" id="interactive" className="border-gray-600 text-blue-600" />
                    <Label htmlFor="interactive">Interactive Coding</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioItem value="text" id="text" className="border-gray-600 text-blue-600" />
                    <Label htmlFor="text">Text & Images</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioItem value="mixed" id="mixed" className="border-gray-600 text-blue-600" />
                    <Label htmlFor="mixed">Mixed Methods</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex items-start space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="agreement"
                  name="agreement"
                  checked={formData.agreement}
                  onChange={handleCheckboxChange}
                  className="mt-1"
                />
                <Label htmlFor="agreement" className="text-sm">
                  I agree to the instructor terms and conditions, and I understand that my application will be reviewed
                  before I can start teaching.
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-[#2D3748] pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="border-[#2D3748] hover:bg-[#2D3748]"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.agreement}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {step === 3 && (
        <Card className="bg-[#1E293B] border-[#2D3748]">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-600 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <CardTitle>You're Now an Instructor!</CardTitle>
            <CardDescription className="text-gray-400">
              Your application has been approved. You can now create and publish courses.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              As an instructor, you can create courses, interact with students, and earn tokens for your contributions.
              We're excited to have you join our teaching community!
            </p>
            <div className="grid grid-cols-3 gap-4 my-6">
              <div className="bg-[#0F172A] rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-400">500</p>
                <p className="text-xs text-gray-400">Welcome Tokens</p>
              </div>
              <div className="bg-[#0F172A] rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-purple-400">∞</p>
                <p className="text-xs text-gray-400">Course Limit</p>
              </div>
              <div className="bg-[#0F172A] rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-400">70%</p>
                <p className="text-xs text-gray-400">Revenue Share</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-[#2D3748] pt-4">
            <Button onClick={() => router.push("/teach")} className="bg-blue-600 hover:bg-blue-700">
              Go to Instructor Dashboard
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

