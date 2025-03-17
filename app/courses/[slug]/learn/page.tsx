import { redirect } from "next/navigation"
import { getCourseBySlug } from "@/lib/course-service"
import { checkEnrollment } from "@/lib/enrollment-service"
import CoursePlayer from "@/components/course-player"

export default async function CourseLearnPage({
  params,
}: {
  params: { slug: string }
}) {
  const course = await getCourseBySlug(params.slug)

  if (!course) {
    redirect("/courses")
  }

  // Check if user is enrolled in this course
  const isEnrolled = await checkEnrollment(course.id)

  if (!isEnrolled) {
    redirect(`/courses/${params.slug}`)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <CoursePlayer courseId={course.id} modules={course.modules} />
    </div>
  )
}

