import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Clock, Users, Star } from "lucide-react"
import type { Course } from "@/types/course"

interface CourseGridProps {
  courses: Course[]
  currentPage: number
  totalPages: number
}

export default function CourseGrid({ courses, currentPage, totalPages }: CourseGridProps) {
  // Generate pagination links
  const getPaginationLinks = () => {
    const links = []

    // Previous page
    if (currentPage > 1) {
      links.push({
        label: <ChevronLeft size={16} />,
        page: currentPage - 1,
        aria: "Previous page",
      })
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      // Show first page, last page, and pages around current page
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        links.push({
          label: i,
          page: i,
          aria: `Page ${i}`,
        })
      } else if (
        (i === currentPage - 2 && currentPage > 3) ||
        (i === currentPage + 2 && currentPage < totalPages - 2)
      ) {
        // Show ellipsis
        links.push({
          label: "...",
          page: null,
          aria: "More pages",
        })
      }
    }

    // Next page
    if (currentPage < totalPages) {
      links.push({
        label: <ChevronRight size={16} />,
        page: currentPage + 1,
        aria: "Next page",
      })
    }

    return links
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
        <h3 className="text-lg font-medium mb-2">No courses found</h3>
        <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/courses">Clear all filters</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {courses.map((course) => (
          <Card key={course.id} className="bg-gray-800 border-gray-700 overflow-hidden flex flex-col">
            <div className="relative aspect-video">
              <Image src={course.coverImage || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
              {course.price === 0 && (
                <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                  FREE
                </div>
              )}
            </div>
            <CardContent className="p-4 flex-grow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium px-2 py-1 bg-blue-900/50 text-blue-400 rounded">
                  {course.category}
                </span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-xs font-medium">{course.rating.toFixed(1)}</span>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2 line-clamp-2">{course.title}</h3>
              <p className="text-gray-400 text-sm mb-2 line-clamp-2">{course.description}</p>
              <div className="flex items-center text-xs text-gray-400 mt-auto">
                <div className="flex items-center mr-3">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center mr-3">
                  <span className="capitalize">{course.difficulty}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  <span>{course.studentsCount}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-gray-700 mt-auto">
              <div className="font-bold">
                {course.price === 0 ? <span>Free</span> : <span>{course.price} ETH</span>}
              </div>
              <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Link href={`/courses/${course.slug}`}>View Course</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-1" aria-label="Pagination">
            {getPaginationLinks().map((link, index) => (
              <div key={index}>
                {link.page ? (
                  <Link
                    href={`/courses?page=${link.page}`}
                    aria-label={link.aria}
                    className={`px-3 py-2 rounded-md ${
                      link.page === currentPage ? "bg-blue-600 text-white" : "bg-gray-800 text-white hover:bg-gray-700"
                    }`}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <span className="px-3 py-2">{link.label}</span>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}

