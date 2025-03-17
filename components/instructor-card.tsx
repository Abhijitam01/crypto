/**
 * Instructor Card Component
 *
 * This component displays information about a course instructor.
 * Features:
 * - Instructor profile image
 * - Name and bio
 * - Course count and ratings
 * - Contact button
 *
 * The component helps build trust by showcasing the instructor's
 * credentials and experience.
 */

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Instructor } from "@/types/course"

interface InstructorCardProps {
  instructor: Instructor
}

export default function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-bold mb-4">About the Instructor</h3>

      <div className="flex items-center mb-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
          <Image src={instructor.avatar || "/placeholder.svg"} alt={instructor.name} fill className="object-cover" />
        </div>
        <div>
          <h4 className="font-bold">{instructor.name}</h4>
          <p className="text-sm text-gray-500">{instructor.courses} courses</p>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-4">{instructor.bio}</p>

      <div className="flex space-x-2">
        <Button asChild variant="outline" className="w-full">
          <Link href={`/instructors/${instructor.id}`}>View Profile</Link>
        </Button>
        <Button variant="ghost" className="w-full">
          Contact
        </Button>
      </div>
    </div>
  )
}

