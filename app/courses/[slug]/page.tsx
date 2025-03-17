import { notFound } from "next/navigation"
import Image from "next/image"
import { getCourseBySlug } from "@/lib/course-service"
import CourseEnrollButton from "@/components/course-enroll-button"
import CourseCurriculum from "@/components/course-curriculum"
import CourseReviews from "@/components/course-reviews"
import RelatedCourses from "@/components/related-courses"
import { CheckCircle, Clock, Users, BarChart2, Award } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const course = await getCourseBySlug(params.slug)

  if (!course) {
    return {
      title: "Course Not Found",
    }
  }

  return {
    title: `${course.title} | CryptoLearn`,
    description: course.description,
  }
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = await getCourseBySlug(params.slug)

  if (!course) {
    notFound()
  }

  // Calculate total course duration
  const totalMinutes = course.modules.reduce((total, module) => {
    return (
      total +
      module.lessons.reduce((moduleTotal, lesson) => {
        const minutes = Number.parseInt(lesson.duration.match(/\d+/)?.[0] || "0")
        return moduleTotal + minutes
      }, 0)
    )
  }, 0)

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const formattedDuration = `${hours > 0 ? `${hours}h ` : ""}${minutes}m`

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16 flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 space-y-6">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {course.category}
              </span>
              <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                {course.difficulty}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{course.title}</h1>
            <p className="text-xl text-gray-300">{course.description}</p>

            <div className="flex flex-wrap gap-4 text-gray-300">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>{formattedDuration} total</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>{course.studentsCount} students</span>
              </div>
              <div className="flex items-center">
                <BarChart2 className="h-5 w-5 mr-2" />
                <span>
                  <span className="text-yellow-400">★</span> {course.rating.toFixed(1)} rating
                </span>
              </div>
              <div className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                <span>Certificate of completion</span>
              </div>
            </div>

            <div className="flex items-center">
              <Image
                src={course.instructor.avatar || "/placeholder.svg"}
                alt={course.instructor.name}
                width={40}
                height={40}
                className="rounded-full mr-3"
              />
              <div>
                <p className="text-white font-medium">Created by {course.instructor.name}</p>
                <p className="text-gray-300 text-sm">Last updated: April 2023</p>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center md:justify-end">
            <div className="w-full max-w-md bg-gray-800 rounded-xl overflow-hidden shadow-xl">
              <div className="relative aspect-video">
                <Image src={course.coverImage || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-blue-600 bg-opacity-80 flex items-center justify-center cursor-pointer hover:bg-opacity-100 transition-all">
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-2xl font-bold text-white">
                    {course.price === 0 ? <span>Free</span> : <span>{course.price} ETH</span>}
                  </div>
                  {course.price > 0 && (
                    <div className="text-gray-400 line-through">{(course.price * 1.3).toFixed(2)} ETH</div>
                  )}
                </div>

                <CourseEnrollButton courseId={course.id} price={course.price} />

                <div className="mt-6 space-y-4">
                  <h3 className="font-medium text-white">This course includes:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span>{formattedDuration} of on-demand video</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span>
                        {course.modules.length} modules with{" "}
                        {course.modules.reduce((total, module) => total + module.lessons.length, 0)} lessons
                      </span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span>Access on mobile and desktop</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span>Certificate of completion</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span>Lifetime access</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 flex justify-center">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">30-Day Money-Back Guarantee</p>
                    <p className="text-gray-400 text-sm">Full Lifetime Access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course content */}
      <div className="mt-12">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-gray-800 border border-gray-700 mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="curriculum" className="data-[state=active]:bg-gray-700">
              Curriculum
            </TabsTrigger>
            <TabsTrigger value="instructor" className="data-[state=active]:bg-gray-700">
              Instructor
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-gray-700">
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="prose prose-invert max-w-none">
              <h2>About This Course</h2>
              <p>{course.description}</p>

              <h3>What You'll Learn</h3>
              <ul>
                {course.learningOutcomes.map((outcome, index) => (
                  <li key={index}>{outcome}</li>
                ))}
              </ul>

              <h3>Requirements</h3>
              <ul>
                {course.requirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>

              <h3>Who This Course is For</h3>
              <ul>
                <li>Beginners interested in blockchain technology and Web3</li>
                <li>Developers looking to expand their skills into blockchain development</li>
                <li>Entrepreneurs wanting to understand the potential of decentralized applications</li>
                <li>Anyone curious about how blockchain technology works</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-400" />
                  Student Feedback
                </h3>
                <div className="flex items-center mb-2">
                  <div className="text-3xl font-bold mr-2">{course.rating.toFixed(1)}</div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.round(course.rating) ? "text-yellow-400" : "text-gray-600"}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const percentage =
                      (course.reviews.filter((r) => r.rating === rating).length / course.reviews.length) * 100
                    return (
                      <div key={rating} className="flex items-center">
                        <div className="w-12 text-sm">{rating} stars</div>
                        <div className="flex-grow mx-2 bg-gray-700 rounded-full h-2">
                          <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <div className="w-8 text-sm text-right">{Math.round(percentage)}%</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-green-400" />
                  Course Length
                </h3>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="text-gray-400">Total Length</span>
                    <span>{formattedDuration}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Modules</span>
                    <span>{course.modules.length}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Lessons</span>
                    <span>{course.modules.reduce((total, module) => total + module.lessons.length, 0)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Difficulty</span>
                    <span className="capitalize">{course.difficulty}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-purple-400" />
                  Certification
                </h3>
                <p className="text-gray-400 mb-4">
                  Complete this course to earn a verifiable NFT certificate that you can share on your resume and social
                  profiles.
                </p>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex items-center">
                  <div className="h-12 w-12 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">CryptoLearn Certificate</p>
                    <p className="text-sm text-gray-400">Blockchain-verified credentials</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="curriculum">
            <CourseCurriculum modules={course.modules} />
          </TabsContent>

          <TabsContent value="instructor">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4 flex flex-col items-center text-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                    <Image
                      src={course.instructor.avatar || "/placeholder.svg"}
                      alt={course.instructor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold">{course.instructor.name}</h3>
                  <p className="text-gray-400">{course.instructor.courses} courses</p>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span>4.8 Instructor Rating</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Users className="h-4 w-4 mr-1 text-gray-400" />
                    <span>{course.studentsCount} Students</span>
                  </div>
                </div>

                <div className="md:w-3/4">
                  <h3 className="text-xl font-bold mb-4">About the Instructor</h3>
                  <div className="prose prose-invert max-w-none">
                    <p>{course.instructor.bio}</p>
                    <p>
                      With over {Math.floor(Math.random() * 10) + 5} years of experience in blockchain technology and
                      Web3 development,
                      {course.instructor.name} has helped thousands of students master complex concepts through clear,
                      practical instruction.
                    </p>
                    <p>
                      As a recognized expert in the field, they have contributed to several open-source projects and
                      spoken at major blockchain conferences worldwide.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <CourseReviews reviews={course.reviews} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Related courses */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Students Also Bought</h2>
        <RelatedCourses currentCourseId={course.id} category={course.category} />
      </div>
    </div>
  )
}

