/**
 * Dashboard Page
 *
 * This page serves as the main dashboard for authenticated users.
 * It displays the user's learning progress, enrolled courses, token earnings,
 * and personalized recommendations.
 *
 * Features:
 * - Overview of user's learning progress
 * - Token earnings and rewards
 * - Enrolled courses with progress indicators
 * - Learning path recommendations
 * - Upcoming events and announcements
 */

import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-service"
import { getEnrolledCourses } from "@/lib/enrollment-service"
import EnrolledCoursesList from "@/components/enrolled-courses-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Award, TrendingUp, ArrowRight, Zap, Target } from "lucide-react"
import TokenEarningsChart from "@/components/token-earnings-chart"
import RecommendedCourses from "@/components/recommended-courses"
import { getCourses } from "@/lib/course-service"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin?callbackUrl=/dashboard")
  }

  const enrolledCourses = await getEnrolledCourses()
  const { courses: recommendedCourses } = await getCourses({ limit: 3 })

  // Calculate completion percentage
  const completionPercentage =
    user.enrolledCourses.length > 0 ? Math.round((user.completedCourses.length / user.enrolledCourses.length) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
          <p className="text-gray-400 mt-1">Continue your learning journey and earn tokens</p>
        </div>
        <Button asChild variant="outline" className="border-[#2D3748] hover:bg-[#2D3748]">
          <Link href="/courses" className="flex items-center">
            Browse Courses
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Token earnings card */}
      <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-none overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-xl font-bold mb-2 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                Your Token Earnings
              </h2>
              <p className="text-gray-300 mb-4">Complete courses and activities to earn more tokens</p>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm text-gray-300">Total Balance</p>
                  <p className="text-3xl font-bold">{user.tokenBalance} Tokens</p>
                </div>
                <div>
                  <p className="text-sm text-gray-300">This Month</p>
                  <p className="text-xl font-bold">+120 Tokens</p>
                </div>
              </div>
              <div className="mt-4">
                <Button asChild size="sm" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                  <Link href="/wallet">View Token History</Link>
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/2 h-40">
              <TokenEarningsChart />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#1E293B] border-[#2D3748]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.enrolledCourses.length}</div>
            <p className="text-xs text-gray-400">Active courses</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1E293B] border-[#2D3748]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionPercentage}%</div>
            <p className="text-xs text-gray-400">Course completion</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1E293B] border-[#2D3748]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.completedCourses.length}</div>
            <p className="text-xs text-gray-400">Earned certificates</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1E293B] border-[#2D3748]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10,204</div>
            <p className="text-xs text-gray-400">Active learners</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Your Courses</h2>
            <Button asChild variant="link" className="text-blue-400 hover:text-blue-300">
              <Link href="/courses/my-learning">View All</Link>
            </Button>
          </div>
          <EnrolledCoursesList courses={enrolledCourses.slice(0, 4)} />
        </div>

        <div className="space-y-6">
          <Card className="bg-[#1E293B] border-[#2D3748]">
            <CardHeader>
              <CardTitle className="text-lg">Learning Path</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Blockchain Basics</span>
                </div>
                <span className="text-xs text-green-500">Completed</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm">Smart Contract Development</span>
                </div>
                <span className="text-xs text-blue-500">In Progress</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-gray-500 mr-2"></div>
                  <span className="text-sm">DApp Development</span>
                </div>
                <span className="text-xs text-gray-400">Not Started</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-gray-500 mr-2"></div>
                  <span className="text-sm">Web3 Integration</span>
                </div>
                <span className="text-xs text-gray-400">Not Started</span>
              </div>
              <Button asChild className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                <Link href="/courses/learning-paths">Continue Learning</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#1E293B] border-[#2D3748]">
            <CardHeader>
              <CardTitle className="text-lg">Recommended for You</CardTitle>
            </CardHeader>
            <CardContent>
              <RecommendedCourses courses={recommendedCourses} />
            </CardContent>
          </Card>

          <Card className="bg-[#1E293B] border-[#2D3748]">
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border border-[#2D3748] rounded-md p-3">
                <p className="text-sm font-medium">Web3 Developer Workshop</p>
                <p className="text-xs text-gray-400 mt-1">May 15, 2023 • 2:00 PM</p>
              </div>
              <div className="border border-[#2D3748] rounded-md p-3">
                <p className="text-sm font-medium">DeFi Fundamentals Webinar</p>
                <p className="text-xs text-gray-400 mt-1">May 22, 2023 • 3:30 PM</p>
              </div>
              <Button asChild variant="outline" className="w-full mt-2 border-[#2D3748] hover:bg-[#2D3748]">
                <Link href="/events">View All Events</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Token earning opportunities */}
      <Card className="bg-[#1E293B] border-[#2D3748]">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-400" />
            Token Earning Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0F172A] rounded-lg p-4 border border-[#2D3748]">
              <div className="flex items-center mb-3">
                <div className="bg-blue-900/30 p-2 rounded-lg mr-3">
                  <Target className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium">Daily Challenges</h3>
                  <p className="text-xs text-gray-400">+10 tokens per challenge</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                Complete daily coding challenges to earn tokens and build your skills.
              </p>
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                Start Challenge
              </Button>
            </div>
            <div className="bg-[#0F172A] rounded-lg p-4 border border-[#2D3748]">
              <div className="flex items-center mb-3">
                <div className="bg-purple-900/30 p-2 rounded-lg mr-3">
                  <Users className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium">Community Participation</h3>
                  <p className="text-xs text-gray-400">+5 tokens per contribution</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                Answer questions, participate in discussions, and help other learners.
              </p>
              <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                Join Forum
              </Button>
            </div>
            <div className="bg-[#0F172A] rounded-lg p-4 border border-[#2D3748]">
              <div className="flex items-center mb-3">
                <div className="bg-green-900/30 p-2 rounded-lg mr-3">
                  <Award className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium">Course Completion</h3>
                  <p className="text-xs text-gray-400">+100 tokens per course</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                Finish courses to earn certificates and substantial token rewards.
              </p>
              <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                View Courses
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

