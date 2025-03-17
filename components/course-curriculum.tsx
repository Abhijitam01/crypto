"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Play, FileText, HelpCircle, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { CourseModule } from "@/types/course"

interface CourseCurriculumProps {
  modules: CourseModule[]
}

export default function CourseCurriculum({ modules }: CourseCurriculumProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>([modules[0]?.id || ""])
  const [previewVideo, setPreviewVideo] = useState<{ open: boolean; title: string; videoId: string }>({
    open: false,
    title: "",
    videoId: "",
  })

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

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]))
  }

  // Calculate total course duration
  const calculateTotalDuration = () => {
    let totalMinutes = 0

    modules.forEach((module) => {
      module.lessons.forEach((lesson) => {
        const durationMatch = lesson.duration.match(/(\d+)/)
        if (durationMatch) {
          totalMinutes += Number.parseInt(durationMatch[0], 10)
        }
      })
    })

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`
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

  const openPreview = (lessonTitle: string, index: number) => {
    setPreviewVideo({
      open: true,
      title: lessonTitle,
      videoId: youtubeVideos[index % youtubeVideos.length],
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Course Content</h2>
        <div className="text-sm text-gray-400">
          {modules.length} modules • {modules.reduce((total, module) => total + module.lessons.length, 0)} lessons •{" "}
          {calculateTotalDuration()} total length
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden divide-y border-gray-700">
        {modules.map((module, moduleIndex) => (
          <div key={module.id} className="bg-gray-800">
            <div
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-700"
              onClick={() => toggleModule(module.id)}
            >
              <div className="font-medium">
                Module {moduleIndex + 1}: {module.title}
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-400 mr-4">{module.lessons.length} lessons</span>
                {expandedModules.includes(module.id) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>

            {expandedModules.includes(module.id) && (
              <div className="bg-gray-900 divide-y divide-gray-800">
                {module.lessons.map((lesson, lessonIndex) => {
                  // Make some lessons free for preview (first lesson of each module)
                  const isFree = lessonIndex === 0

                  return (
                    <div key={lesson.id} className="flex justify-between items-center p-4">
                      <div className="flex items-center flex-1">
                        <div className="mr-3 text-gray-400">{getLessonIcon(lesson.type)}</div>
                        <div>
                          <div className="font-medium">
                            {lesson.title}
                            {isFree && (
                              <span className="ml-2 text-xs bg-green-900 text-green-400 px-2 py-0.5 rounded">Free</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 flex items-center mt-1">
                            <span className="capitalize">{lesson.type}</span>
                            <span className="mx-1">•</span>
                            <span>{lesson.duration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {lesson.type === "video" && isFree ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              openPreview(lesson.title, moduleIndex * 10 + lessonIndex)
                            }}
                            className="text-blue-400 hover:text-blue-300 hover:bg-gray-800"
                          >
                            Preview
                          </Button>
                        ) : (
                          <div className="text-gray-500 flex items-center">
                            <Lock size={14} className="mr-1" />
                            <span className="text-xs">Premium</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Video Preview Dialog */}
      <Dialog open={previewVideo.open} onOpenChange={(open) => setPreviewVideo({ ...previewVideo, open })}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewVideo.title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube.com/embed/${previewVideo.videoId}`}
              title={previewVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

