import { render, screen } from "@testing-library/react"
import EnrolledCoursesList from "@/components/enrolled-courses-list"
import { describe, it, expect } from "vitest"

const mockCourses = [
  {
    id: "course1",
    courseId: "1",
    userId: "user1",
    enrollmentDate: "2023-01-01T00:00:00Z",
    lastAccessDate: "2023-01-15T00:00:00Z",
    progress: 50,
    completed: false,
    course: {
      title: "Test Course",
      slug: "test-course",
      coverImage: "/test-image.jpg",
      instructor: {
        name: "Test Instructor",
      },
    },
  },
]

describe("EnrolledCoursesList", () => {
  it("renders enrolled courses", () => {
    render(<EnrolledCoursesList courses={mockCourses} />)

    expect(screen.getByText("Test Course")).toBeInTheDocument()
    expect(screen.getByText("Test Instructor")).toBeInTheDocument()
    expect(screen.getByText("50% Complete")).toBeInTheDocument()
  })

  it('displays "No courses yet" message when there are no courses', () => {
    render(<EnrolledCoursesList courses={[]} />)

    expect(screen.getByText("No courses yet")).toBeInTheDocument()
  })
})

