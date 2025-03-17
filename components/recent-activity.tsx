/**
 * Recent Activity Component
 *
 * This component displays the student's recent learning activities.
 * Features:
 * - Activity timeline
 * - Activity types (lesson completion, quiz results, etc.)
 * - Time indicators
 * - Quick links to continue learning
 *
 * The component helps students track their recent progress
 * and quickly resume their learning.
 */

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CheckCircle, Award, HelpCircle, Clock, FileText } from "lucide-react"

interface Activity {
  id: string
  type: "lesson_completed" | "quiz_completed" | "certificate_earned" | "course_started"
  courseId: string
  courseTitle: string
  courseSlug: string
  itemTitle?: string
  timestamp: string
  data?: any
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real implementation, this would fetch from an API
    const mockActivities: Activity[] = [
      {
        id: "1",
        type: "lesson_completed",
        courseId: "1",
        courseTitle: "Introduction to Blockchain Technology",
        courseSlug: "introduction-to-blockchain",
        itemTitle: "Blockchain Architecture",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      },
      {
        id: "2",
        type: "quiz_completed",
        courseId: "1",
        courseTitle: "Introduction to Blockchain Technology",
        courseSlug: "introduction-to-blockchain",
        itemTitle: "Blockchain Basics Quiz",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        data: {
          score: 85,
          totalQuestions: 10,
        },
      },
      {
        id: "3",
        type: "course_started",
        courseId: "2",
        courseTitle: "Smart Contract Development with Solidity",
        courseSlug: "smart-contract-development",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      },
      {
        id: "4",
        type: "certificate_earned",
        courseId: "3",
        courseTitle: "Web3 Fundamentals",
        courseSlug: "web3-fundamentals",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      },
    ]

    setActivities(mockActivities)
    setIsLoading(false)
  }, [])

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  // Get icon for activity type
  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "lesson_completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "quiz_completed":
        return <HelpCircle className="h-5 w-5 text-blue-500" />
      case "certificate_earned":
        return <Award className="h-5 w-5 text-yellow-500" />
      case "course_started":
        return <FileText className="h-5 w-5 text-purple-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  // Get activity description
  const getActivityDescription = (activity: Activity) => {
    switch (activity.type) {
      case "lesson_completed":
        return (
          <>
            Completed lesson <strong>{activity.itemTitle}</strong> in{" "}
            <Link href={`/courses/${activity.courseSlug}`} className="text-blue-600 hover:underline">
              {activity.courseTitle}
            </Link>
          </>
        )
      case "quiz_completed":
        return (
          <>
            Completed quiz <strong>{activity.itemTitle}</strong> with score <strong>{activity.data?.score}%</strong> in{" "}
            <Link href={`/courses/${activity.courseSlug}`} className="text-blue-600 hover:underline">
              {activity.courseTitle}
            </Link>
          </>
        )
      case "certificate_earned":
        return (
          <>
            Earned certificate for completing{" "}
            <Link href={`/courses/${activity.courseSlug}`} className="text-blue-600 hover:underline">
              {activity.courseTitle}
            </Link>
          </>
        )
      case "course_started":
        return (
          <>
            Started new course{" "}
            <Link href={`/courses/${activity.courseSlug}`} className="text-blue-600 hover:underline">
              {activity.courseTitle}
            </Link>
          </>
        )
      default:
        return "Unknown activity"
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow">
        <p className="text-gray-500">No recent activity.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-medium">Your Recent Activity</h3>
      </div>
      <div className="divide-y">
        {activities.map((activity) => (
          <div key={activity.id} className="p-4 flex">
            <div className="mr-4 mt-0.5">{getActivityIcon(activity.type)}</div>
            <div className="flex-grow">
              <p className="mb-1">{getActivityDescription(activity)}</p>
              <p className="text-sm text-gray-500">{formatTimestamp(activity.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

