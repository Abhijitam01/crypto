import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Clock, ArrowRight } from "lucide-react"
import type { EnrolledCourse } from "@/types/enrollment"

interface EnrolledCoursesListProps {
  courses: EnrolledCourse[]
}

export default function EnrolledCoursesList({ courses }: EnrolledCoursesListProps) {
  const formatLastAccessed = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12 bg-[#1E293B] rounded-lg border border-[#2D3748]">
        <h3 className="text-lg font-medium mb-2">No courses yet</h3>
        <p className="text-gray-400 mb-6">Explore our catalog and enroll in your first course!</p>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/courses">Browse Courses</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {courses.map((course) => (
        <Card key={course.id} className="bg-[#1E293B] border-[#2D3748] overflow-hidden flex flex-col">
          <div className="relative aspect-video">
            <Image
              src={course.course.coverImage || "/placeholder.svg"}
              alt={course.course.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-bold text-white">{course.course.title}</h3>
              <p className="text-xs text-gray-300 mt-1">Instructor: {course.course.instructor.name}</p>
            </div>
          </div>
          <CardContent className="flex-grow p-4">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-400">{course.progress}% Complete</span>
                <span className="text-xs text-gray-400 flex items-center">
                  <Clock size={12} className="mr-1" />
                  Last accessed {formatLastAccessed(course.lastAccessDate)}
                </span>
              </div>
              <Progress value={course.progress} className="h-2 bg-[#0F172A]" indicatorClassName="bg-blue-600" />
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between items-center">
            {course.completed ? (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Completed</span>
            ) : (
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">In Progress</span>
            )}
            <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Link href={`/courses/${course.course.slug}/learn`} className="flex items-center">
                {course.progress > 0 ? "Continue" : "Start"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

