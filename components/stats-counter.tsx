/**
 * Stats Counter Component
 *
 * This client component displays key platform statistics with animated counters.
 * It creates a visually engaging way to showcase important metrics about the platform.
 *
 * Features:
 * - Animated number counters
 * - Responsive grid layout
 * - Visual icons for each stat
 *
 * The component uses useState and useEffect hooks to manage the animation
 * of the counters, creating a counting up effect when the component is viewed.
 */

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { BookOpen, Users, Award, GraduationCap } from "lucide-react"

interface Stat {
  label: string
  value: number
  icon: React.ReactNode
  suffix?: string
  description: string
}

export default function StatsCounter() {
  const [stats] = useState<Stat[]>([
    {
      label: "Courses",
      value: 150,
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      description: "Expert-led courses across all Web3 domains",
    },
    {
      label: "Students",
      value: 12500,
      icon: <Users className="h-8 w-8 text-green-500" />,
      description: "Active learners from around the world",
    },
    {
      label: "Instructors",
      value: 75,
      icon: <GraduationCap className="h-8 w-8 text-purple-500" />,
      description: "Industry experts sharing their knowledge",
    },
    {
      label: "Certificates Issued",
      value: 8750,
      icon: <Award className="h-8 w-8 text-yellow-500" />,
      description: "Blockchain-verified credentials earned",
    },
  ])

  const [counts, setCounts] = useState<number[]>(stats.map(() => 0))
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    // Only animate once
    if (hasAnimated) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateCounters()
          setHasAnimated(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("stats-counter")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [hasAnimated])

  const animateCounters = () => {
    const duration = 2000 // Animation duration in ms
    const frameDuration = 1000 / 60 // 60fps
    const totalFrames = Math.round(duration / frameDuration)

    let frame = 0
    const timerId = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      const newCounts = stats.map((stat) => {
        return Math.floor(progress * stat.value)
      })

      setCounts(newCounts)

      if (frame === totalFrames) {
        clearInterval(timerId)
        setCounts(stats.map((stat) => stat.value))
      }
    }, frameDuration)
  }

  return (
    <div id="stats-counter" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors"
        >
          <div className="flex items-center mb-4">
            <div className="bg-gray-800 p-3 rounded-lg mr-4">{stat.icon}</div>
            <div>
              <div className="text-3xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                {counts[index].toLocaleString()}
                {stat.suffix || ""}
              </div>
              <div className="font-medium">{stat.label}</div>
            </div>
          </div>
          <p className="text-gray-400 text-sm">{stat.description}</p>
        </div>
      ))}
    </div>
  )
}

