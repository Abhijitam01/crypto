/**
 * Testimonials Component
 *
 * This client component displays student testimonials in a carousel format.
 * It showcases real student experiences to build trust and credibility.
 *
 * Features:
 * - Responsive carousel with auto-rotation
 * - Student quotes with ratings and profile images
 * - Navigation controls (arrows, dots)
 * - Pause on hover functionality
 *
 * The component uses useState and useEffect hooks to manage the carousel state
 * and implements auto-rotation with the ability to pause on interaction.
 */

"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Testimonial {
  id: string
  name: string
  role: string
  avatar: string
  quote: string
  rating: number
}

export default function Testimonials() {
  const [testimonials] = useState<Testimonial[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Blockchain Developer",
      avatar: "/testimonial-1.jpg",
      quote:
        "The NFT certificate I earned has been a valuable addition to my portfolio. Employers are impressed by the verifiable proof of my blockchain skills.",
      rating: 5,
    },
    {
      id: "2",
      name: "Michael Chen",
      role: "DeFi Analyst",
      avatar: "/testimonial-2.jpg",
      quote:
        "The courses are comprehensive and up-to-date with the latest Web3 developments. I've learned practical skills that I use daily in my work.",
      rating: 4,
    },
    {
      id: "3",
      name: "Elena Rodriguez",
      role: "Smart Contract Auditor",
      avatar: "/testimonial-3.jpg",
      quote:
        "As someone who switched careers into Web3, these courses provided the perfect foundation. The instructors are knowledgeable and supportive.",
      rating: 5,
    },
  ])

  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextTestimonial = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1))
  }, [testimonials.length])

  const prevTestimonial = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1))
  }, [testimonials.length])

  // Auto-rotate testimonials
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      nextTestimonial()
    }, 8000)

    return () => clearInterval(interval)
  }, [nextTestimonial, isPaused])

  return (
    <div
      className="relative max-w-4xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="min-w-full px-4">
              <div className="bg-gray-800 rounded-lg shadow-lg p-8 text-center border border-gray-700">
                <div className="flex justify-center mb-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < testimonial.rating ? "text-yellow-400" : "text-gray-600"}>
                      ★
                    </span>
                  ))}
                </div>
                <blockquote className="text-lg italic mb-6">"{testimonial.quote}"</blockquote>
                <div className="font-bold">{testimonial.name}</div>
                <div className="text-gray-400">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevTestimonial}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-900/80 text-white rounded-full p-2 shadow hover:bg-gray-800"
        aria-label="Previous testimonial"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextTestimonial}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-900/80 text-white rounded-full p-2 shadow hover:bg-gray-800"
        aria-label="Next testimonial"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots navigation */}
      <div className="flex justify-center mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full mx-1 transition-colors ${
              index === activeIndex ? "bg-blue-600" : "bg-gray-600 hover:bg-gray-500"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

