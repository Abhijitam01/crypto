import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CareersPage() {
  const jobOpenings = [
    {
      title: "Blockchain Curriculum Developer",
      department: "Education",
      location: "Remote",
    },
    {
      title: "Frontend Developer",
      department: "Engineering",
      location: "New York, NY",
    },
    {
      title: "Community Manager",
      department: "Marketing",
      location: "Remote",
    },
    {
      title: "Smart Contract Engineer",
      department: "Engineering",
      location: "San Francisco, CA",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Careers at CryptoLearn</h1>
      <div className="max-w-3xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Join Our Team</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              At CryptoLearn, we're on a mission to make blockchain education accessible to everyone. We're always
              looking for passionate individuals who want to make a difference in the world of Web3 education.
            </p>
            <p>If you're excited about blockchain technology and love to learn and teach, we want to hear from you!</p>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mt-12 mb-6">Current Openings</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {jobOpenings.map((job, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">Department: {job.department}</p>
                <p className="mb-4">Location: {job.location}</p>
                <Button>Apply Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

