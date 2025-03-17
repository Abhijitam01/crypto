import { getCurrentUser } from "@/lib/auth-service"
import { getEnrolledCourses } from "@/lib/enrollment-service"
import { getCertificates } from "@/lib/certificate-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Award, Clock, Calendar, Edit } from "lucide-react"
import Link from "next/link"
import EnrolledCoursesList from "@/components/enrolled-courses-list"

export default async function ProfilePage() {
  const user = await getCurrentUser()
  const enrolledCourses = await getEnrolledCourses()
  const certificates = await getCertificates()

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
        <p className="mb-6">You need to be signed in to view your profile.</p>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/signin">Sign In</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <Card className="bg-[#1E293B] border-[#2D3748]">
            <CardHeader className="flex flex-col items-center text-center pb-2">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="/placeholder.svg" alt={user.name} />
                <AvatarFallback className="bg-blue-600 text-white text-2xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <p className="text-gray-400">{user.email}</p>
              <Button variant="outline" size="sm" className="mt-4 border-[#2D3748] hover:bg-[#2D3748]">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </CardHeader>
            <CardContent className="pt-6 border-t border-[#2D3748]">
              <div className="space-y-4">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-blue-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-400">Enrolled Courses</p>
                    <p className="font-medium">{enrolledCourses.length}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-yellow-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-400">Certificates Earned</p>
                    <p className="font-medium">{certificates.length}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-green-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-400">Learning Hours</p>
                    <p className="font-medium">24 hours</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-purple-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-400">Member Since</p>
                    <p className="font-medium">January 2023</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-2/3">
          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="bg-[#1E293B] border border-[#2D3748]">
              <TabsTrigger value="courses" className="data-[state=active]:bg-[#2D3748]">
                My Courses
              </TabsTrigger>
              <TabsTrigger value="certificates" className="data-[state=active]:bg-[#2D3748]">
                Certificates
              </TabsTrigger>
              <TabsTrigger value="achievements" className="data-[state=active]:bg-[#2D3748]">
                Achievements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="mt-6">
              <EnrolledCoursesList courses={enrolledCourses} />
            </TabsContent>

            <TabsContent value="certificates" className="mt-6">
              {certificates.length === 0 ? (
                <div className="text-center py-12 bg-[#1E293B] rounded-lg border border-[#2D3748]">
                  <h3 className="text-lg font-medium mb-2">No Certificates Yet</h3>
                  <p className="text-gray-400 mb-6">
                    Complete courses to earn NFT certificates that verify your skills on the blockchain.
                  </p>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/courses">Explore Courses</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certificates.map((certificate) => (
                    <Card key={certificate.id} className="bg-[#1E293B] border-[#2D3748] flex">
                      <div className="w-1/3 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Award className="h-12 w-12 text-yellow-400" />
                        </div>
                      </div>
                      <div className="w-2/3 p-4">
                        <h3 className="font-medium line-clamp-1">{certificate.courseTitle}</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          Issued on {new Date(certificate.issueDate).toLocaleDateString()}
                        </p>
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="mt-3 border-[#2D3748] hover:bg-[#2D3748]"
                        >
                          <Link href={`/certificates/${certificate.id}`}>View Certificate</Link>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="achievements" className="mt-6">
              <div className="text-center py-12 bg-[#1E293B] rounded-lg border border-[#2D3748]">
                <h3 className="text-lg font-medium mb-2">No Achievements Yet</h3>
                <p className="text-gray-400 mb-6">
                  Complete courses and participate in challenges to earn achievements.
                </p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/courses">Explore Courses</Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

