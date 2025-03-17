/**
 * Progress Stats Component
 *
 * This component displays learning progress statistics.
 * Features:
 * - Visual progress charts
 * - Completion percentage
 * - Time spent metrics
 * - Course completion forecast
 *
 * The component helps students track their overall learning progress
 * across all enrolled courses.
 */

"use client"
import { Clock, Calendar, Award, TrendingUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import type { EnrolledCourse } from "@/types/enrollment"

interface ProgressStatsProps {
  enrolledCourses: EnrolledCourse[]
}

export default function ProgressStats({ enrolledCourses }: ProgressStatsProps) {
  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (enrolledCourses.length === 0) return 0

    const totalProgress = enrolledCourses.reduce((sum, course) => sum + course.progress, 0)

    return Math.round(totalProgress / enrolledCourses.length)
  }

  // Calculate completed courses
  const calculateCompletedCourses = () => {
    return enrolledCourses.filter((course) => course.completed).length
  }

  // Calculate total time spent (in minutes)
  const calculateTotalTimeSpent = () => {
    // In a real implementation, this would come from the API
    // For now, we'll generate a random number based on progress
    const totalProgress = enrolledCourses.reduce((sum, course) => sum + course.progress, 0)

    return Math.round(totalProgress * 5) // 5 minutes per progress percent
  }

  // Format time spent
  const formatTimeSpent = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours === 0) {
      return `${remainingMinutes} minutes`
    } else if (remainingMinutes === 0) {
      return `${hours} hours`
    } else {
      return `${hours} hours ${remainingMinutes} minutes`
    }
  }

  const overallProgress = calculateOverallProgress()
  const completedCourses = calculateCompletedCourses()
  const totalTimeSpent = calculateTotalTimeSpent()

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm font-medium">{overallProgress}%</span>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Award className="h-5 w-5 text-blue-500 mr-2" />
            <span className="text-sm font-medium">Completed</span>
          </div>
          <div className="text-2xl font-bold">
            {completedCourses}/{enrolledCourses.length}
          </div>
          <div className="text-xs text-gray-500">courses</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Clock className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-sm font-medium">Time Spent</span>
          </div>
          <div className="text-2xl font-bold">{Math.floor(totalTimeSpent / 60)}h</div>
          <div className="text-xs text-gray-500">learning</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Calendar className="h-5 w-5 text-purple-500 mr-2" />
            <span className="text-sm font-medium">Last Session</span>
          </div>
          <div className="text-2xl font-bold">{enrolledCourses.length > 0 ? "Today" : "N/A"}</div>
          <div className="text-xs text-gray-500">{enrolledCourses.length > 0 ? "2 hours ago" : "No sessions yet"}</div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <TrendingUp className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="text-sm font-medium">Learning Streak</span>
          </div>
          <div className="text-2xl font-bold">{enrolledCourses.length > 0 ? "5 days" : "0 days"}</div>
          <div className="text-xs text-gray-500">Keep it up!</div>
        </div>
      </div>

      {enrolledCourses.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Learning Activity</h3>
          <div className="flex space-x-1">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`h-8 flex-1 rounded-sm ${i < 5 ? "bg-blue-500" : "bg-gray-200"}`}
                style={{
                  opacity: i < 5 ? 0.5 + i * 0.1 : 0.2,
                }}
              ></div>
            ))}
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
      )}
    </div>
  )
}

