/**
 * Course Progress Component
 *
 * This component displays the student's progress in a course.
 * Features:
 * - Progress bar with percentage
 * - Completion status
 * - Time spent tracking
 * - Last accessed information
 *
 * The component helps students track their learning progress
 * and motivates them to complete the course.
 */

"use client"

import { useState, useEffect } from "react"
import { Clock, Calendar } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { getCourseProgress } from "@/lib/progress-service"

interface CourseProgressProps {
  courseId: string
}

export default function CourseProgress({ courseId }: CourseProgressProps) {
  const [progress, setProgress] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)
  const [lastAccessed, setLastAccessed] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const { percentComplete, timeSpentMinutes, lastAccessedDate } = await getCourseProgress(courseId)
        setProgress(percentComplete)
        setTimeSpent(timeSpentMinutes)
        setLastAccessed(lastAccessedDate)
      } catch (error) {
        console.error("Failed to load course progress:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProgress()
  }, [courseId])

  // Format time spent
  const formatTimeSpent = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours === 0) {
      return `${remainingMinutes} min`
    } else if (remainingMinutes === 0) {
      return `${hours} hr`
    } else {
      return `${hours} hr ${remainingMinutes} min`
    }
  }

  // Format last accessed date
  const formatLastAccessed = (dateString: string | null) => {
    if (!dateString) return "Never"

    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="h-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Course Progress</span>
        <span className="text-sm font-medium">{progress}% Complete</span>
      </div>
      <Progress value={progress} className="h-2 mb-4" />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <Clock size={16} className="text-gray-500 mr-2" />
          <div>
            <div className="text-xs text-gray-500">Time Spent</div>
            <div className="text-sm font-medium">{formatTimeSpent(timeSpent)}</div>
          </div>
        </div>
        <div className="flex items-center">
          <Calendar size={16} className="text-gray-500 mr-2" />
          <div>
            <div className="text-xs text-gray-500">Last Accessed</div>
            <div className="text-sm font-medium">{formatLastAccessed(lastAccessed)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

