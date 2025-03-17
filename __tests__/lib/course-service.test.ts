import { getCourses, getFeaturedCourses, getCourseBySlug, makeAllCoursesFree } from "@/lib/course-service"
import { describe, it, expect } from "vitest"

describe("Course Service", () => {
  it("returns courses with pagination", async () => {
    const { courses, totalPages } = await getCourses()
    expect(courses.length).toBeGreaterThan(0)
    expect(totalPages).toBeGreaterThan(0)
  })

  it("returns featured courses", async () => {
    const featuredCourses = await getFeaturedCourses()
    expect(featuredCourses.length).toBeGreaterThan(0)
  })

  it("returns a course by slug", async () => {
    const course = await getCourseBySlug("introduction-to-blockchain")
    expect(course).not.toBeNull()
    expect(course?.title).toBe("Introduction to Blockchain Technology")
  })

  it("makes all courses free", async () => {
    await makeAllCoursesFree()
    const { courses } = await getCourses()
    courses.forEach((course) => {
      expect(course.price).toBe(0)
    })
  })
})

