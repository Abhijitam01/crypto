import type React from "react"
/**
 * How It Works Component
 *
 * This component explains the platform's learning process in a step-by-step format.
 * It provides a visual guide to help users understand how to use the platform.
 *
 * Features:
 * - Visual step indicators with icons
 * - Clear explanations of each step
 * - Responsive design that adapts to different screen sizes
 * - Visual connecting elements
 */

import { Search, CreditCard, BookOpen, Award } from "lucide-react"

interface Step {
  title: string
  description: string
  icon: React.ReactNode
}

export default function HowItWorks() {
  const steps: Step[] = [
    {
      title: "Browse Courses",
      description: "Explore our catalog of Web3 courses taught by industry experts.",
      icon: <Search className="h-8 w-8 text-blue-500" />,
    },
    {
      title: "Enroll & Pay with Crypto",
      description: "Use your wallet to enroll in courses with a simple transaction.",
      icon: <CreditCard className="h-8 w-8 text-blue-500" />,
    },
    {
      title: "Learn at Your Pace",
      description: "Access course materials anytime and learn at your own pace.",
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
    },
    {
      title: "Earn NFT Certificate",
      description: "Complete the course to receive a verifiable NFT certificate.",
      icon: <Award className="h-8 w-8 text-blue-500" />,
    },
  ]

  return (
    <div className="relative">
      {/* Connecting line for desktop */}
      <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gray-700"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center relative">
            <div className="relative mb-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 border-2 border-blue-500 z-10">
                {step.icon}
              </div>
              <div className="absolute top-0 left-0 w-16 h-16 rounded-full bg-blue-500 opacity-20 animate-ping-slow"></div>
            </div>
            <div className="absolute top-24 text-xl font-bold text-blue-500">{index + 1}</div>
            <h3 className="text-xl font-bold mb-2 mt-4">{step.title}</h3>
            <p className="text-gray-400">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

