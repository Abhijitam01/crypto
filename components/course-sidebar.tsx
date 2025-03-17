/**
 * Course Sidebar Component
 *
 * This component provides navigation for course lessons during learning.
 * Features:
 * - Module and lesson navigation
 * - Progress tracking
 * - Current lesson highlighting
 * - Completion status indicators
 *
 * The component helps students navigate through the course content
 * and track their progress.
 */

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CheckCircle, ChevronDown, ChevronUp, Play, FileText, HelpCircle, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getCourseProgress } from "@/lib/progress-service"
import type { CourseModule } from "@/types/course"

interface CourseSidebarProps {
  courseId: string
  courseSlug: string
  modules: CourseModule[]
}

export default function CourseSidebar({ courseId, courseSlug, modules }: CourseSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>([])
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()

  // Extract current lesson ID from pathname if available
  const currentLessonId = pathname.split("/").pop()

  useEffect(() => {
    // Expand the module containing the current lesson
    if (currentLessonId) {
      const moduleWithCurrentLesson = modules.find((module) =>
        module.lessons.some((lesson) => lesson.id === currentLessonId),
      )

      if (moduleWithCurrentLesson && !expandedModules.includes(moduleWithCurrentLesson.id)) {
        setExpandedModules((prev) => [...prev, moduleWithCurrentLesson.id])
      }
    }

    // Load progress data
    const loadProgress = async () => {
      try {
        const { percentComplete, completedLessonIds } = await getCourseProgress(courseId)
        setProgress(percentComplete)
        setCompletedLessons(completedLessonIds)
      } catch (error) {
        console.error("Failed to load course progress:", error)
      }
    }

    loadProgress()
  }, [courseId, currentLessonId, modules, expandedModules])

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]))
  }

  // Get icon based on lesson type
  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play size={16} />
      case "quiz":
        return <HelpCircle size={16} />
      case "exercise":
        return <FileText size={16} />
      default:
        return <FileText size={16} />
    }
  }

  return (
    <div className="w-full md:w-80 bg-gray-50 border-r flex flex-col h-screen overflow-hidden">
      <div className="p-4 border-b">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link href={`/courses/${courseSlug}`}>
            <ChevronLeft size={16} className="mr-2" />
            Back to Course
          </Link>
        </Button>
      </div>

      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Your Progress</span>
          <span className="text-sm">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex-grow overflow-y-auto">
        {modules.map((module) => (
          <div key={module.id} className="border-b">
            <div
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100"
              onClick={() => toggleModule(module.id)}
            >
              <div className="font-medium">{module.title}</div>
              <div className="flex items-center">
                {expandedModules.includes(module.id) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>

            {expandedModules.includes(module.id) && (
              <div className="bg-white">
                {module.lessons.map((lesson) => {
                  const isCompleted = completedLessons.includes(lesson.id)
                  const isCurrent = lesson.id === currentLessonId

                  return (
                    <Link
                      key={lesson.id}
                      href={`/courses/${courseSlug}/learn/${lesson.id}`}
                      className={`flex items-center p-3 pl-6 border-l-4 ${
                        isCurrent
                          ? "border-blue-500 bg-blue-50"
                          : isCompleted
                            ? "border-green-500 hover:bg-gray-50"
                            : "border-transparent hover:bg-gray-50"
                      }`}
                    >
                      <div className="mr-3 text-gray-500">
                        {isCompleted ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : (
                          getLessonIcon(lesson.type)
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className={`text-sm ${isCurrent ? "font-medium" : ""}`}>{lesson.title}</div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <span className="capitalize">{lesson.type}</span>
                          <span className="mx-1">•</span>
                          <span>{lesson.duration}</span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

