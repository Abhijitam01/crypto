/**
 * Course Reviews Component
 *
 * This component displays student reviews for a course.
 * Features:
 * - Overall rating summary
 * - Rating distribution chart
 * - Individual review cards
 * - Sorting and filtering options
 *
 * The component helps potential students evaluate the course
 * quality based on feedback from previous students.
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Review } from "@/types/course"

interface CourseReviewsProps {
  reviews: Review[]
}

export default function CourseReviews({ reviews }: CourseReviewsProps) {
  const [sortBy, setSortBy] = useState("recent")
  const [filterRating, setFilterRating] = useState("all")

  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((review) => review.rating === rating).length
    const percentage = (count / reviews.length) * 100
    return { rating, count, percentage }
  })

  // Sort and filter reviews
  const filteredReviews = reviews
    .filter((review) => filterRating === "all" || review.rating === Number.parseInt(filterRating, 10))
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (sortBy === "highest") {
        return b.rating - a.rating
      } else {
        return a.rating - b.rating
      }
    })

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Overall rating */}
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
          <div className="flex justify-center mb-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.round(averageRating) ? "text-yellow-500" : "text-gray-300"}>
                ★
              </span>
            ))}
          </div>
          <p className="text-gray-500">{reviews.length} reviews</p>
        </div>

        {/* Rating distribution */}
        <div className="col-span-2">
          {ratingDistribution.map((item) => (
            <div key={item.rating} className="flex items-center mb-2">
              <div className="w-16 text-sm">{item.rating} stars</div>
              <div className="flex-grow mx-2 bg-gray-200 rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
              </div>
              <div className="w-12 text-sm text-right">{item.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-medium">Reviews</h3>
        <div className="flex space-x-4">
          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="highest">Highest Rated</SelectItem>
              <SelectItem value="lowest">Lowest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Review list */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No reviews match your filter criteria.</p>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    {review.user.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{review.user}</div>
                    <div className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        )}
      </div>

      {reviews.length > 5 && (
        <div className="text-center mt-8">
          <Button variant="outline">Load More Reviews</Button>
        </div>
      )}
    </div>
  )
}

