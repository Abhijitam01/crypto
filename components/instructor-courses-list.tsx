/**
 * Instructor Courses List Component
 *
 * This component displays courses created by an instructor.
 * Features:
 * - Course cards with key metrics
 * - Student enrollment counts
 * - Revenue information
 * - Course management actions
 *
 * The component helps instructors manage their course catalog
 * and track performance metrics.
 */

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MoreHorizontal, Users, DollarSign, Star, Edit, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Course } from "@/types/course"

interface InstructorCoursesListProps {
  courses: Course[]
}

export default function InstructorCoursesList({ courses }: InstructorCoursesListProps) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No courses yet</h3>
        <p className="text-gray-500 mb-6">Create your first course and start teaching on our platform!</p>
        <Button asChild>
          <Link href="/teach/courses/new">Create New Course</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {courses.map((course) => (
        <Card key={course.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-48 h-32 md:h-auto">
                <Image src={course.coverImage || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
              </div>
              <div className="p-4 flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.description}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={18} />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/teach/courses/${course.id}/edit`} className="flex items-center">
                          <Edit size={16} className="mr-2" />
                          Edit Course
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/courses/${course.slug}`} className="flex items-center">
                          <Eye size={16} className="mr-2" />
                          View Course
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center">
                    <Users size={16} className="text-gray-500 mr-2" />
                    <div>
                      <div className="text-sm font-medium">{course.studentsCount}</div>
                      <div className="text-xs text-gray-500">Students</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DollarSign size={16} className="text-gray-500 mr-2" />
                    <div>
                      <div className="text-sm font-medium">{course.price} ETH</div>
                      <div className="text-xs text-gray-500">Price</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star size={16} className="text-gray-500 mr-2" />
                    <div>
                      <div className="text-sm font-medium">{course.rating.toFixed(1)}</div>
                      <div className="text-xs text-gray-500">Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

