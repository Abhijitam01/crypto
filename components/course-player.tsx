"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { markLessonComplete } from "@/lib/progress-service"
import type { CourseModule } from "@/types/course"

interface CoursePlayerProps {
  courseId: string
  modules: CourseModule[]
}

export default function CoursePlayer({ courseId, modules }: CoursePlayerProps) {
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null)
  const [currentLesson, setCurrentLesson] = useState<any | null>(null)
  const [isCompleting, setIsCompleting] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const router = useRouter()
  const pathname = usePathname()

  // Find all lessons flattened
  const allLessons = modules.flatMap((module) => module.lessons)

  // YouTube video IDs for demo purposes
  const youtubeVideos = [
    "dQw4w9WgXcQ", // Rick Astley - Never Gonna Give You Up
    "jNQXAC9IVRw", // Me at the zoo
    "8jPQjjsBbIc", // Bitcoin whitepaper explained
    "M576WGiDBdQ", // Ethereum explained
    "Lbr9vYMhpms", // Web3 explained
    "bBC-nXj3Ng4", // How Bitcoin works
    "9nQPcHJUs2A", // Blockchain explained
    "SSo_EIwHSd4", // NFTs explained
    "rYQgy8QDEBI", // Smart contracts explained
    "K8qYHuNvWyE", // DeFi explained
  ]

  useEffect(() => {
    // Extract current lesson ID from pathname
    const lessonId = pathname.split("/").pop()
    if (lessonId && lessonId !== "learn") {
      setCurrentLessonId(lessonId)

      // Find the current lesson
      const lesson = allLessons.find((l) => l.id === lessonId)
      if (lesson) {
        setCurrentLesson({
          ...lesson,
          videoId: youtubeVideos[Number.parseInt(lesson.id.replace(/\D/g, "")) % youtubeVideos.length],
        })
      }
    } else if (allLessons.length > 0) {
      // If no lesson ID in URL, navigate to the first lesson
      const firstLesson = allLessons[0]
      const courseSlug = pathname.split("/")[2]
      router.push(`/courses/${courseSlug}/learn/${firstLesson.id}`)
    }

    // Load completed lessons
    const loadCompletedLessons = async () => {
      try {
        const { completedLessonIds } = await fetch(`/api/progress/${courseId}`).then((res) => res.json())
        setCompletedLessons(completedLessonIds || [])
      } catch (error) {
        console.error("Failed to load completed lessons:", error)
        // For demo purposes, set some lessons as completed
        setCompletedLessons(allLessons.slice(0, 2).map((l) => l.id))
      }
    }

    loadCompletedLessons()
  }, [pathname, allLessons, router, courseId])

  const navigateToLesson = (lessonId: string) => {
    const courseSlug = pathname.split("/")[2]
    router.push(`/courses/${courseSlug}/learn/${lessonId}`)
  }

  const getAdjacentLessons = () => {
    if (!currentLessonId) return { prev: null, next: null }

    const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId)

    return {
      prev: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
      next: currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null,
    }
  }

  const { prev, next } = getAdjacentLessons()

  const handleComplete = async () => {
    if (!currentLessonId) return

    setIsCompleting(true)

    try {
      await markLessonComplete(courseId, currentLessonId)

      // Update local state
      setCompletedLessons((prev) => [...prev, currentLessonId])

      // If there's a next lesson, navigate to it
      if (next) {
        navigateToLesson(next.id)
      }
    } catch (error) {
      console.error("Failed to mark lesson as complete:", error)
    } finally {
      setIsCompleting(false)
    }
  }

  // Calculate progress
  const progress = allLessons.length > 0 ? Math.round((completedLessons.length / allLessons.length) * 100) : 0

  if (!currentLesson) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
          <p className="text-gray-400 text-sm">
            Lesson {allLessons.findIndex((l) => l.id === currentLessonId) + 1} of {allLessons.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => prev && navigateToLesson(prev.id)}
            disabled={!prev}
            className="border-gray-700 hover:bg-gray-800"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => next && navigateToLesson(next.id)}
            disabled={!next}
            className="border-gray-700 hover:bg-gray-800"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Video player */}
          <div className="bg-black rounded-lg overflow-hidden aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${currentLesson.videoId}`}
              title={currentLesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>

          {/* Lesson content */}
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="bg-gray-800 border border-gray-700">
              <TabsTrigger value="content" className="data-[state=active]:bg-gray-700">
                Content
              </TabsTrigger>
              <TabsTrigger value="resources" className="data-[state=active]:bg-gray-700">
                Resources
              </TabsTrigger>
              <TabsTrigger value="discussion" className="data-[state=active]:bg-gray-700">
                Discussion
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="mt-4 space-y-4">
              <div className="prose prose-invert max-w-none">
                <h2>Lesson Overview</h2>
                <p>
                  In this lesson, we'll explore {currentLesson.title.toLowerCase()}. This is a fundamental concept in
                  blockchain technology that will help you understand how decentralized systems work.
                </p>

                <h3>Key Concepts</h3>
                <ul>
                  <li>Understanding the basics of {currentLesson.title.toLowerCase()}</li>
                  <li>How {currentLesson.title.toLowerCase()} relates to blockchain technology</li>
                  <li>Practical applications in real-world scenarios</li>
                  <li>Common challenges and solutions</li>
                </ul>

                <h3>Learning Objectives</h3>
                <p>
                  By the end of this lesson, you'll be able to explain {currentLesson.title.toLowerCase()} to others,
                  identify its key components, and understand how it's implemented in blockchain systems.
                </p>
              </div>

              <div className="mt-6">
                <Button
                  onClick={handleComplete}
                  disabled={isCompleting || completedLessons.includes(currentLessonId)}
                  className={
                    completedLessons.includes(currentLessonId)
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }
                >
                  {isCompleting ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                      Completing...
                    </span>
                  ) : completedLessons.includes(currentLessonId) ? (
                    <span className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Completed
                    </span>
                  ) : next ? (
                    "Complete & Continue"
                  ) : (
                    "Mark as Complete"
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="mt-4">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-medium mb-4">Additional Resources</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <a href="#" className="text-blue-400 hover:underline">
                      Lesson Slides (PDF)
                    </a>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                    <a href="#" className="text-blue-400 hover:underline">
                      Code Examples (GitHub)
                    </a>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <a href="#" className="text-blue-400 hover:underline">
                      Supplementary Video
                    </a>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <a href="#" className="text-blue-400 hover:underline">
                      Practice Exercises
                    </a>
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="discussion" className="mt-4">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-medium mb-4">Discussion</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold">JD</span>
                    </div>
                    <div className="flex-1">
                      <textarea
                        placeholder="Ask a question or share your thoughts..."
                        className="w-full rounded-lg bg-gray-700 border border-gray-600 p-3 text-sm"
                        rows={3}
                      ></textarea>
                      <div className="mt-2 flex justify-end">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-center text-gray-400 text-sm">
                      No comments yet. Be the first to start the discussion!
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          {/* Course progress */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-medium mb-4">Your Progress</h3>
            <div className="mb-2 flex justify-between items-center">
              <span className="text-sm text-gray-400">{progress}% Complete</span>
              <span className="text-sm text-gray-400">
                {completedLessons.length}/{allLessons.length} lessons
              </span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-700" />
          </div>

          {/* Course content */}
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-medium">Course Content</h3>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {modules.map((module, moduleIndex) => (
                <div key={module.id} className="border-b border-gray-700 last:border-b-0">
                  <div className="p-4 font-medium">
                    Module {moduleIndex + 1}: {module.title}
                  </div>
                  <ul className="border-t border-gray-700">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const isActive = lesson.id === currentLessonId
                      const isCompleted = completedLessons.includes(lesson.id)

                      return (
                        <li
                          key={lesson.id}
                          className={`border-b border-gray-700 last:border-b-0 ${isActive ? "bg-gray-700" : ""}`}
                        >
                          <button
                            onClick={() => navigateToLesson(lesson.id)}
                            className="w-full p-3 flex items-center text-left hover:bg-gray-700"
                          >
                            <div className="mr-3 flex-shrink-0">
                              {isCompleted ? (
                                <div className="h-6 w-6 rounded-full bg-green-600 flex items-center justify-center">
                                  <CheckCircle className="h-4 w-4" />
                                </div>
                              ) : (
                                <div className="h-6 w-6 rounded-full bg-gray-600 flex items-center justify-center">
                                  <span className="text-xs">
                                    {moduleIndex + 1}.{lessonIndex + 1}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="truncate">{lesson.title}</p>
                              <p className="text-xs text-gray-400 flex items-center mt-1">
                                <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {lesson.duration}
                              </p>
                            </div>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

