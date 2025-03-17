interface Progress {
  percentComplete: number
  completedLessonIds: string[]
  timeSpentMinutes: number
  lastAccessedDate: string | null
}

const mockProgress: { [courseId: string]: Progress } = {}

export async function getCourseProgress(courseId: string): Promise<Progress> {
  if (!mockProgress[courseId]) {
    mockProgress[courseId] = {
      percentComplete: 0,
      completedLessonIds: [],
      timeSpentMinutes: 0,
      lastAccessedDate: null,
    }
  }
  return mockProgress[courseId]
}

export async function markLessonComplete(courseId: string, lessonId: string): Promise<void> {
  if (!mockProgress[courseId]) {
    await getCourseProgress(courseId)
  }

  if (!mockProgress[courseId].completedLessonIds.includes(lessonId)) {
    mockProgress[courseId].completedLessonIds.push(lessonId)
    mockProgress[courseId].percentComplete = calculatePercentComplete(
      courseId,
      mockProgress[courseId].completedLessonIds,
    )
    mockProgress[courseId].timeSpentMinutes += 15 // Assume 15 minutes per lesson
    mockProgress[courseId].lastAccessedDate = new Date().toISOString()
  }
}

export async function updateTimeSpent(courseId: string, minutes: number): Promise<void> {
  if (!mockProgress[courseId]) {
    await getCourseProgress(courseId)
  }

  mockProgress[courseId].timeSpentMinutes += minutes
  mockProgress[courseId].lastAccessedDate = new Date().toISOString()
}

function calculatePercentComplete(courseId: string, completedLessonIds: string[]): number {
  // In a real implementation, this would fetch the course structure and calculate the percentage
  // For this mock version, we'll just use a random percentage
  return Math.min(100, Math.round((completedLessonIds.length / 10) * 100))
}

export async function markCourseComplete(courseId: string): Promise<void> {
  if (!mockProgress[courseId]) {
    await getCourseProgress(courseId)
  }

  mockProgress[courseId].percentComplete = 100
  mockProgress[courseId].lastAccessedDate = new Date().toISOString()

  // In a real implementation, this would update the backend and potentially trigger certificate issuance
  console.log(`Course ${courseId} marked as complete`)
}

export { getCourseProgress, markLessonComplete, updateTimeSpent, markCourseComplete }

