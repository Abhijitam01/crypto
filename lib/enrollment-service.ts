import type { EnrolledCourse } from "@/types/enrollment"

// Mock data for development - would be replaced with actual API calls
const mockEnrollments: EnrolledCourse[] = [
  {
    id: "enroll-1",
    courseId: "1",
    userId: "current-user",
    enrollmentDate: "2023-10-15T09:30:00Z",
    lastAccessDate: "2023-12-01T14:20:00Z",
    progress: 75,
    completed: false,
    course: {
      title: "Introduction to Blockchain Technology",
      slug: "introduction-to-blockchain",
      coverImage: "/placeholder.svg?height=400&width=600",
      instructor: {
        name: "Alex Johnson",
      },
    },
  },
  {
    id: "enroll-2",
    courseId: "2",
    userId: "current-user",
    enrollmentDate: "2023-11-20T11:45:00Z",
    lastAccessDate: "2023-12-05T16:10:00Z",
    progress: 30,
    completed: false,
    course: {
      title: "Smart Contract Development with Solidity",
      slug: "smart-contract-development",
      coverImage: "/placeholder.svg?height=400&width=600",
      instructor: {
        name: "Elena Rodriguez",
      },
    },
  },
  {
    id: "enroll-3",
    courseId: "3",
    userId: "current-user",
    enrollmentDate: "2023-12-10T10:00:00Z",
    lastAccessDate: "2023-12-15T18:30:00Z",
    progress: 15,
    completed: false,
    course: {
      title: "Full Stack Web3 Development",
      slug: "full-stack-web3-development",
      coverImage: "/placeholder.svg?height=400&width=600",
      instructor: {
        name: "Marcus Chen",
      },
    },
  },
]

// Enroll in a course
export async function enrollInCourse(courseId: string, price: number) {
  // In a real implementation, this would:
  // 1. Call the smart contract to process payment and record enrollment
  // 2. Update the user's enrollment record in the database

  // Mock implementation
  console.log("Enrolling in course:", courseId, "Price:", price)

  // Simulate a delay for the enrollment process
  await new Promise((resolve) => setTimeout(resolve, 2000))

  return {
    success: true,
    enrollmentId: `enroll-${Date.now()}`,
    transactionHash: price > 0 ? `0x${Math.random().toString(16).substring(2)}` : null,
  }
}

// Check if a user is enrolled in a course
export async function checkEnrollment(courseId: string) {
  // In a real implementation, this would call the smart contract
  // to check if the user is enrolled

  // Mock implementation
  return mockEnrollments.some((enrollment) => enrollment.courseId === courseId)
}

// Get all courses the user is enrolled in
export async function getEnrolledCourses() {
  // In a real implementation, this would call the smart contract
  // and/or database to get all enrollments

  // Mock implementation
  return mockEnrollments
}

// Get enrollment statistics for a course (instructor only)
export async function getCourseEnrollmentStats(courseId: string) {
  // In a real implementation, this would call the smart contract
  // and/or database to get enrollment statistics

  // Mock implementation
  return {
    totalEnrollments: 125,
    recentEnrollments: 12, // Last 30 days
    completionRate: 68, // Percentage
    averageProgress: 72, // Percentage
  }
}

// Cancel enrollment (if within refund period)
export async function cancelEnrollment(enrollmentId: string) {
  // In a real implementation, this would call the smart contract
  // to process the refund and cancel the enrollment

  // Mock implementation
  console.log("Cancelling enrollment:", enrollmentId)

  return {
    success: true,
    refundAmount: 0.05, // ETH
    transactionHash: `0x${Math.random().toString(16).substring(2)}`,
  }
}

