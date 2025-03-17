import { Suspense } from "react"
import CourseFilters from "@/components/course-filters"
import CourseGrid from "@/components/course-grid"
import CourseSearch from "@/components/course-search"
import { getCourses } from "@/lib/course-service"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Extract filter parameters from URL
  const category = searchParams.category as string | undefined
  const search = searchParams.search as string | undefined
  const sort = searchParams.sort as string | undefined
  const difficulty = searchParams.difficulty as string | undefined
  const page = Number(searchParams.page) || 1

  // Fetch courses based on filters
  const { courses, totalPages } = await getCourses({
    category,
    search,
    sort,
    difficulty,
    page,
  })

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Explore Courses</h1>
      </div>

      <Tabs defaultValue="all" className="w-full mb-8">
        <TabsList className="bg-gray-800 border border-gray-700">
          <TabsTrigger value="all" className="data-[state=active]:bg-gray-700">
            All Courses
          </TabsTrigger>
          <TabsTrigger value="blockchain" className="data-[state=active]:bg-gray-700">
            Blockchain
          </TabsTrigger>
          <TabsTrigger value="development" className="data-[state=active]:bg-gray-700">
            Development
          </TabsTrigger>
          <TabsTrigger value="defi" className="data-[state=active]:bg-gray-700">
            DeFi
          </TabsTrigger>
          <TabsTrigger value="nft" className="data-[state=active]:bg-gray-700">
            NFTs
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar with filters */}
        <div className="w-full md:w-1/4">
          <CourseFilters selectedCategory={category} selectedDifficulty={difficulty} />
        </div>

        {/* Main content */}
        <div className="w-full md:w-3/4">
          <CourseSearch initialSearch={search} initialSort={sort} />

          <Suspense fallback={<div className="text-center py-12">Loading courses...</div>}>
            <CourseGrid courses={courses} currentPage={page} totalPages={totalPages} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

