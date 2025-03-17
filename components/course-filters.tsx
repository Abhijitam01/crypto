"use client"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface CourseFiltersProps {
  selectedCategory?: string
  selectedDifficulty?: string
}

export default function CourseFilters({ selectedCategory, selectedDifficulty }: CourseFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const categories = ["Blockchain", "Development", "DeFi", "NFTs", "Security", "Trading", "Web3"]

  const difficulties = ["beginner", "intermediate", "advanced"]

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(name, value)

    return params.toString()
  }

  const removeQueryParam = (name: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(name)

    return params.toString()
  }

  const handleCategoryChange = (category: string) => {
    if (category === selectedCategory) {
      // If clicking the already selected category, remove the filter
      router.push(`${pathname}?${removeQueryParam("category")}`)
    } else {
      router.push(`${pathname}?${createQueryString("category", category)}`)
    }
  }

  const handleDifficultyChange = (difficulty: string) => {
    router.push(`${pathname}?${createQueryString("difficulty", difficulty)}`)
  }

  const resetFilters = () => {
    router.push(pathname)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="text-gray-400 hover:text-white">
          Reset
        </Button>
      </div>

      <Accordion type="single" collapsible defaultValue="categories" className="border-gray-700">
        <AccordionItem value="categories" className="border-gray-700">
          <AccordionTrigger className="hover:text-white">Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={category === selectedCategory}
                    onCheckedChange={() => handleCategoryChange(category)}
                    className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="difficulty" className="border-gray-700">
          <AccordionTrigger className="hover:text-white">Difficulty Level</AccordionTrigger>
          <AccordionContent>
            <RadioGroup value={selectedDifficulty} onValueChange={handleDifficultyChange}>
              {difficulties.map((difficulty) => (
                <div key={difficulty} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={difficulty}
                    id={`difficulty-${difficulty}`}
                    className="border-gray-600 text-blue-600"
                  />
                  <Label htmlFor={`difficulty-${difficulty}`} className="text-sm capitalize cursor-pointer">
                    {difficulty}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price" className="border-gray-700">
          <AccordionTrigger className="hover:text-white">Price</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="price-free"
                  className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label htmlFor="price-free" className="text-sm cursor-pointer">
                  Free
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="price-paid"
                  className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label htmlFor="price-paid" className="text-sm cursor-pointer">
                  Paid
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rating" className="border-gray-700">
          <AccordionTrigger className="hover:text-white">Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer flex items-center">
                    <span className="flex mr-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-600"}>
                          ★
                        </span>
                      ))}
                    </span>
                    & up
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

