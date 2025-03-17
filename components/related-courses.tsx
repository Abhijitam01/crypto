/**
 * Related Courses Component
 *
 * This component displays courses related to the current course.
 * Features:
 * - Horizontal scrolling carousel
 * - Course cards with key information
 * - Category-based recommendations
 * - Navigation controls
 *
 * The component helps students discover additional relevant courses
 * to continue their learning journey.
 */

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { getCourses } from "@/lib/course-service"
import type { Course } from "@/types/course"

interface RelatedCoursesProps {
  currentCourseId: string
  category: string
}

export default function RelatedCourses({ currentCourseId, category }: RelatedCoursesProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadRelatedCourses = async () => {
      try {
        const { courses } = await getCourses({ category })
        // Filter out the current course
        const filteredCourses = courses.filter((course) => course.id !== currentCourseId)
        setCourses(filteredCourses)
      } catch (error) {
        console.error("Failed to load related courses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRelatedCourses()
  }, [currentCourseId, category])

  const scrollLeft = () => {
    const container = document.getElementById("related-courses-container")
    if (container) {
      container.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    const container = document.getElementById("related-courses-container")
    if (container) {
      container.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  if (isLoading) {
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Related Courses</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (courses.length === 0) {
    return null
  }

  return (
    <div className="mt-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Related Courses</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={scrollLeft} aria-label="Scroll left">
            <ChevronLeft size={20} />
          </Button>
          <Button variant="outline" size="icon" onClick={scrollRight} aria-label="Scroll right">
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>

      <div
        id="related-courses-container"
        className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {courses.map((course) => (
          <Card key={course.id} className="min-w-[300px] max-w-[300px] flex flex-col">
            <div className="relative aspect-video">
              <Image src={course.coverImage || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
            </div>
            <CardContent className="p-4 flex-grow">
              <h3 className="font-bold mb-2 line-clamp-2">{course.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{course.instructor.name}</p>
              <div className="flex items-center text-sm">
                <span className="text-yellow-500 mr-1">★</span>
                <span>{course.rating.toFixed(1)}</span>
                <span className="mx-1">•</span>
                <span>{course.studentsCount} students</span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 border-t mt-auto">
              <div className="font-bold mr-auto">
                {course.price === 0 ? <span>Free</span> : <span>{course.price} ETH</span>}
              </div>
              <Button asChild size="sm">
                <Link href={`/courses/${course.slug}`}>View</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <style jsx global>{`
        #related-courses-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

