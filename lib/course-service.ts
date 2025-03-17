import type { Course, CourseFilters } from "@/types/course"

// Mock data for development - would be replaced with actual API calls
const mockCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to Blockchain Technology",
    slug: "introduction-to-blockchain",
    description:
      "Learn the fundamentals of blockchain technology, including its history, how it works, and its applications.",
    coverImage: "/placeholder.svg?height=400&width=600",
    price: 0,
    rating: 4.7,
    studentsCount: 1245,
    duration: "6 hours",
    difficulty: "beginner",
    category: "Blockchain",
    learningOutcomes: [
      "Understand the core concepts of blockchain technology",
      "Explain the difference between public and private blockchains",
      "Describe how consensus mechanisms work",
      "Identify real-world applications of blockchain",
    ],
    requirements: ["No prior knowledge required", "Basic computer literacy"],
    instructor: {
      id: "i1",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Blockchain developer with 5 years of experience",
      courses: 8,
    },
    modules: [
      {
        id: "m1",
        title: "Blockchain Basics",
        lessons: [
          { id: "l1", title: "What is Blockchain?", duration: "15 min", type: "video" },
          { id: "l2", title: "History of Blockchain", duration: "20 min", type: "video" },
          { id: "l3", title: "Blockchain Architecture", duration: "25 min", type: "video" },
          { id: "l4", title: "Module Quiz", duration: "10 min", type: "quiz" },
        ],
      },
      {
        id: "m2",
        title: "Consensus Mechanisms",
        lessons: [
          { id: "l5", title: "Proof of Work", duration: "20 min", type: "video" },
          { id: "l6", title: "Proof of Stake", duration: "20 min", type: "video" },
          { id: "l7", title: "Other Consensus Mechanisms", duration: "15 min", type: "video" },
          { id: "l8", title: "Module Quiz", duration: "10 min", type: "quiz" },
        ],
      },
    ],
    reviews: [
      {
        id: "r1",
        user: "Sarah M.",
        rating: 5,
        date: "2023-10-15",
        comment: "Excellent introduction to blockchain. Very clear explanations!",
      },
      {
        id: "r2",
        user: "Michael T.",
        rating: 4,
        date: "2023-09-22",
        comment: "Good content, but some sections could be more in-depth.",
      },
    ],
  },
  {
    id: "2",
    title: "Smart Contract Development with Solidity",
    slug: "smart-contract-development",
    description:
      "Master Solidity programming and learn to build secure, efficient smart contracts for Ethereum and EVM-compatible blockchains.",
    coverImage: "/placeholder.svg?height=400&width=600",
    price: 0,
    rating: 4.8,
    studentsCount: 876,
    duration: "12 hours",
    difficulty: "intermediate",
    category: "Development",
    learningOutcomes: [
      "Write and deploy Solidity smart contracts",
      "Implement security best practices",
      "Test and debug smart contracts",
      "Build a DApp that interacts with your contracts",
    ],
    requirements: [
      "Basic programming knowledge",
      "Understanding of blockchain fundamentals",
      "Familiarity with JavaScript",
    ],
    instructor: {
      id: "i2",
      name: "Elena Rodriguez",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Smart contract auditor and Ethereum developer",
      courses: 5,
    },
    modules: [
      {
        id: "m1",
        title: "Solidity Basics",
        lessons: [
          { id: "l1", title: "Introduction to Solidity", duration: "20 min", type: "video" },
          { id: "l2", title: "Data Types and Variables", duration: "25 min", type: "video" },
          { id: "l3", title: "Functions and Modifiers", duration: "30 min", type: "video" },
          { id: "l4", title: "Practice Exercise", duration: "45 min", type: "exercise" },
        ],
      },
      {
        id: "m2",
        title: "Smart Contract Security",
        lessons: [
          { id: "l5", title: "Common Vulnerabilities", duration: "35 min", type: "video" },
          { id: "l6", title: "Security Best Practices", duration: "40 min", type: "video" },
          { id: "l7", title: "Auditing Tools", duration: "25 min", type: "video" },
          { id: "" },
          { id: "l7", title: "Auditing Tools", duration: "25 min", type: "video" },
          { id: "l8", title: "Security Challenge", duration: "60 min", type: "exercise" },
        ],
      },
    ],
    reviews: [
      {
        id: "r1",
        user: "David K.",
        rating: 5,
        date: "2023-11-05",
        comment: "Comprehensive course on Solidity. The exercises were particularly helpful.",
      },
      {
        id: "r2",
        user: "Jennifer P.",
        rating: 5,
        date: "2023-10-18",
        comment: "Elena is an excellent instructor. I learned so much from this course!",
      },
    ],
  },
  {
    id: "3",
    title: "Full Stack Web3 Development",
    slug: "full-stack-web3-development",
    description:
      "Learn to build complete decentralized applications (DApps) using modern web technologies and blockchain integration.",
    coverImage: "/placeholder.svg?height=400&width=600",
    price: 0,
    rating: 4.9,
    studentsCount: 723,
    duration: "20 hours",
    difficulty: "advanced",
    category: "Development",
    learningOutcomes: [
      "Design and develop full-stack Web3 applications",
      "Integrate smart contracts with frontend interfaces",
      "Implement user authentication using wallets",
      "Deploy and manage decentralized applications",
    ],
    requirements: [
      "Intermediate JavaScript and React knowledge",
      "Basic understanding of blockchain and smart contracts",
      "Familiarity with web development concepts",
    ],
    instructor: {
      id: "i3",
      name: "Marcus Chen",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "Full stack developer specializing in Web3 technologies",
      courses: 3,
    },
    modules: [
      {
        id: "m1",
        title: "Web3 Frontend Development",
        lessons: [
          { id: "l1", title: "Setting up a React project for Web3", duration: "30 min", type: "video" },
          { id: "l2", title: "Integrating Web3 libraries", duration: "45 min", type: "video" },
          { id: "l3", title: "Building a wallet connection component", duration: "60 min", type: "video" },
          { id: "l4", title: "Frontend Challenge", duration: "90 min", type: "exercise" },
        ],
      },
      {
        id: "m2",
        title: "Backend for Web3",
        lessons: [
          { id: "l5", title: "Setting up a Node.js server", duration: "40 min", type: "video" },
          { id: "l6", title: "Interacting with smart contracts from the backend", duration: "50 min", type: "video" },
          { id: "l7", title: "Building API endpoints for your DApp", duration: "55 min", type: "video" },
          { id: "l8", title: "Backend Integration Challenge", duration: "120 min", type: "exercise" },
        ],
      },
    ],
    reviews: [
      {
        id: "r1",
        user: "Emily R.",
        rating: 5,
        date: "2023-12-10",
        comment: "This course truly delivers on full stack Web3 development. Highly recommended!",
      },
      {
        id: "r2",
        user: "Alex M.",
        rating: 4,
        date: "2023-11-28",
        comment: "Great content, but be prepared for a steep learning curve if you're new to Web3.",
      },
    ],
  },
]

// Get all courses with optional filtering
export async function getCourses(filters?: CourseFilters) {
  // In a real implementation, this would call an API or smart contract

  let filteredCourses = [...mockCourses]

  if (filters) {
    // Apply category filter
    if (filters.category) {
      filteredCourses = filteredCourses.filter(
        (course) => course.category.toLowerCase() === filters.category?.toLowerCase(),
      )
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredCourses = filteredCourses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchLower) || course.description.toLowerCase().includes(searchLower),
      )
    }

    // Apply difficulty filter
    if (filters.difficulty) {
      filteredCourses = filteredCourses.filter((course) => course.difficulty === filters.difficulty)
    }

    // Apply sorting
    if (filters.sort) {
      switch (filters.sort) {
        case "newest":
          // In a real app, we'd sort by creation date
          break
        case "popular":
          filteredCourses.sort((a, b) => b.studentsCount - a.studentsCount)
          break
        case "price-low":
          filteredCourses.sort((a, b) => a.price - b.price)
          break
        case "price-high":
          filteredCourses.sort((a, b) => b.price - a.price)
          break
        case "rating":
          filteredCourses.sort((a, b) => b.rating - a.rating)
          break
      }
    }
  }

  // Apply pagination
  const page = filters?.page || 1
  const pageSize = 10
  const startIndex = (page - 1) * pageSize
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + pageSize)
  const totalPages = Math.ceil(filteredCourses.length / pageSize)

  return {
    courses: paginatedCourses,
    totalPages,
  }
}

// Get featured courses for homepage
export async function getFeaturedCourses() {
  // In a real implementation, this would call an API or smart contract
  // For now, just return the mock courses
  return mockCourses
}

// Get a single course by slug
export async function getCourseBySlug(slug: string) {
  // In a real implementation, this would call an API or smart contract
  return mockCourses.find((course) => course.slug === slug) || null
}

// Get a single course by ID
export async function getCourseById(id: string) {
  // In a real implementation, this would call an API or smart contract
  return mockCourses.find((course) => course.id === id) || null
}

// Create a new course (instructor only)
export async function createCourse(courseData: Partial<Course>) {
  // In a real implementation, this would:
  // 1. Upload course content to IPFS
  // 2. Get the IPFS hash
  // 3. Call the smart contract to register the course with the IPFS hash

  // Mock implementation
  console.log("Creating course:", courseData)
  return { success: true, courseId: "new-course-id" }
}

// Update an existing course (instructor only)
export async function updateCourse(courseId: string, courseData: Partial<Course>) {
  // Similar to createCourse, but updates existing content

  // Mock implementation
  console.log("Updating course:", courseId, courseData)
  return { success: true }
}

// Delete a course (instructor only)
export async function deleteCourse(courseId: string) {
  // In a real implementation, this would call the smart contract

  // Mock implementation
  console.log("Deleting course:", courseId)
  return { success: true }
}

// Make all courses free (for testing purposes)
export function makeAllCoursesFree() {
  mockCourses.forEach((course) => {
    course.price = 0
  })
}

// Call this function to make all courses free
makeAllCoursesFree()

