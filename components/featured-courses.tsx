/**
 * Featured Courses Component
 *
 * This client component displays a carousel of featured courses on the homepage.
 * It fetches course data and presents them in an interactive, responsive slider.
 *
 * Features:
 * - Responsive carousel with touch support
 * - Auto-play functionality with pause on hover
 * - Navigation controls (arrows, dots)
 * - Loading and empty states
 *
 * The component uses useState and useEffect hooks to manage state and side effects,
 * and implements custom animation logic for the carousel.
 */

"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Clock, Users, Star } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getFeaturedCourses } from "@/lib/course-service"
import type { Course } from "@/types/course"

export default function FeaturedCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const featuredCourses = await getFeaturedCourses()
        setCourses(featuredCourses)
      } catch (error) {
        console.error("Failed to load featured courses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCourses()
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === courses.length - 1 ? 0 : prevIndex + 1))
  }, [courses.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? courses.length - 1 : prevIndex - 1))
  }, [courses.length])

  // Auto-play functionality
  useEffect(() => {
    if (isPaused || courses.length <= 1) return

    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [nextSlide, isPaused, courses.length])

  // Touch event handlers for mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextSlide()
    }
    if (isRightSwipe) {
      prevSlide()
    }
  }

  // Calculate how many cards to show based on viewport width
  const getCardsToShow = () => {
    if (typeof window === "undefined") return 1
    if (window.innerWidth < 640) return 1
    if (window.innerWidth < 1024) return 2
    return 3
  }

  const cardsToShow = getCardsToShow()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700 animate-pulse">
            <div className="aspect-video bg-gray-700"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </CardContent>
            <CardFooter className="p-4 border-t border-gray-700">
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              <div className="h-8 bg-gray-700 rounded w-1/3 ml-auto"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
        <p className="text-gray-400">No featured courses available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div
        ref={carouselRef}
        className="overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)` }}
        >
          {courses.map((course) => (
            <div key={course.id} className="min-w-full sm:min-w-[50%] lg:min-w-[33.333%] px-3">
              <Card className="bg-gray-800 border-gray-700 overflow-hidden h-full flex flex-col">
                <div className="relative aspect-video">
                  <Image
                    src={course.coverImage || "/placeholder.svg"}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                  {course.price === 0 && (
                    <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                      FREE
                    </div>
                  )}
                </div>
                <CardContent className="p-4 flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium px-2 py-1 bg-blue-900/50 text-blue-400 rounded">
                      {course.category}
                    </span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-xs font-medium">{course.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">{course.description}</p>
                  <div className="flex items-center text-xs text-gray-400 mt-auto">
                    <div className="flex items-center mr-3">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center mr-3">
                      <span className="capitalize">{course.difficulty}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      <span>{course.studentsCount}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-gray-700 mt-auto">
                  <div className="font-bold">
                    {course.price === 0 ? <span>Free</span> : <span>{course.price} ETH</span>}
                  </div>
                  <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Link href={`/courses/${course.slug}`}>View Course</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      {courses.length > cardsToShow && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-900/80 text-white rounded-full p-2 shadow hover:bg-gray-800 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-900/80 text-white rounded-full p-2 shadow hover:bg-gray-800 z-10"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots navigation */}
      {courses.length > cardsToShow && (
        <div className="flex justify-center mt-6">
          {courses.slice(0, Math.ceil(courses.length / cardsToShow)).map((_, index) => {
            const slideIndex = index * cardsToShow
            const isActive = currentIndex >= slideIndex && currentIndex < slideIndex + cardsToShow

            return (
              <button
                key={index}
                onClick={() => setCurrentIndex(slideIndex)}
                className={`w-3 h-3 rounded-full mx-1 transition-colors ${
                  isActive ? "bg-blue-600" : "bg-gray-600 hover:bg-gray-500"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

