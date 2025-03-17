/**
 * Course Creation Page Component
 *
 * This page provides a form for instructors to create new courses.
 * Features:
 * - Multi-step form for course creation
 * - Course details input (title, description, category, etc.)
 * - Module and lesson creation interface
 * - Content upload functionality (videos, documents, quizzes)
 * - Course pricing and settings
 * - Preview and publish functionality
 *
 * The page is protected and only accessible to users with instructor privileges.
 * It uses client components for the interactive form.
 */

import { redirect } from "next/navigation"
import CourseCreationForm from "@/components/course-creation-form"
import { checkInstructorStatus } from "@/lib/instructor-service"

export default async function CreateCoursePage() {
  // Check if user has instructor privileges
  const isInstructor = await checkInstructorStatus()

  if (!isInstructor) {
    redirect("/teach/onboarding")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Create New Course</h1>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <CourseCreationForm />
      </div>
    </div>
  )
}

