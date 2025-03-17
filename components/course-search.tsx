"use client"

import { useState, type FormEvent } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Search, SortAsc } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CourseSearchProps {
  initialSearch?: string
  initialSort?: string
}

export default function CourseSearch({ initialSearch = "", initialSort = "newest" }: CourseSearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(name, value)
    } else {
      params.delete(name)
    }

    // Preserve the page parameter only when not changing search or sort
    if (name !== "page" && params.has("page")) {
      params.delete("page")
    }

    return params.toString()
  }

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    router.push(`${pathname}?${createQueryString("search", searchQuery)}`)
  }

  const handleSortChange = (value: string) => {
    router.push(`${pathname}?${createQueryString("sort", value)}`)
  }

  return (
    <div className="mb-8 space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="search"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 focus-visible:ring-blue-500"
          />
        </div>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Search
        </Button>
      </form>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">{searchQuery ? `Search results for "${searchQuery}"` : "All courses"}</p>

        <div className="flex items-center gap-2">
          <SortAsc size={18} className="text-gray-400" />
          <Select defaultValue={initialSort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

