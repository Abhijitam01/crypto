/**
 * Recommended Courses Component
 *
 * This component displays personalized course recommendations.
 * Features:
 * - Recommendation cards with key information
 * - Personalization based on interests and history
 * - Quick enrollment buttons
 *
 * The component helps students discover relevant courses
 * based on their learning history and preferences.
 */

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import type { Course } from "@/types/course"

interface RecommendedCoursesProps {
  courses: Course[]
}

export default function RecommendedCourses({ courses }: RecommendedCoursesProps) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No recommendations available yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {courses.slice(0, 3).map((course) => (
        <div key={course.id} className="flex items-center space-x-3">
          <div className="relative w-16 h-16 flex-shrink-0">
            <Image
              src={course.coverImage || "/placeholder.svg"}
              alt={course.title}
              fill
              className="object-cover rounded"
            />
          </div>
          <div className="flex-grow min-w-0">
            <h4 className="font-medium text-sm truncate">{course.title}</h4>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <span className="text-yellow-500 mr-1">★</span>
              <span>{course.rating.toFixed(1)}</span>
              <span className="mx-1">•</span>
              <span>{course.studentsCount} students</span>
            </div>
          </div>
        </div>
      ))}

      <Button asChild variant="outline" className="w-full mt-4">
        <Link href="/courses">View All Recommendations</Link>
      </Button>
    </div>
  )
}

