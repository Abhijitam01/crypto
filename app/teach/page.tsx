/**
 * Instructor Dashboard Page Component
 *
 * This page serves as the main dashboard for course instructors.
 * Features:
 * - Overview of created courses
 * - Course performance metrics (enrollments, revenue, ratings)
 * - Student engagement statistics
 * - Quick links to create new courses or manage existing ones
 * - Payout history and earnings overview
 *
 * The page is protected and only accessible to users with instructor privileges.
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getInstructorCourses } from "@/lib/instructor-service"
import { getInstructorEarnings } from "@/lib/payment-service"
import InstructorCoursesList from "@/components/instructor-courses-list"
import EarningsChart from "@/components/earnings-chart"
import EnrollmentStats from "@/components/enrollment-stats"
import StudentFeedback from "@/components/student-feedback"

export default async function InstructorDashboardPage() {
  // Get courses created by the instructor
  const courses = await getInstructorCourses()

  // Get earnings data
  const earnings = await getInstructorEarnings()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
        <Button asChild>
          <Link href="/teach/courses/new">Create New Course</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Students</h3>
          <p className="text-3xl font-bold">{earnings.totalStudents}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Courses</h3>
          <p className="text-3xl font-bold">{courses.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Revenue</h3>
          <p className="text-3xl font-bold">{earnings.totalRevenue} ETH</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Average Rating</h3>
          <p className="text-3xl font-bold">{earnings.averageRating.toFixed(1)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - 2/3 width on desktop */}
        <div className="lg:col-span-2">
          <section className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Your Courses</h2>
            <InstructorCoursesList courses={courses} />
          </section>

          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Student Feedback</h2>
            <StudentFeedback courses={courses} />
          </section>
        </div>

        {/* Sidebar - 1/3 width on desktop */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <section className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Earnings Overview</h2>
              <EarningsChart earnings={earnings.monthlyEarnings} />
            </section>

            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Enrollment Statistics</h2>
              <EnrollmentStats courses={courses} />
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

