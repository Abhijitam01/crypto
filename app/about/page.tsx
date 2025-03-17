import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">About CryptoLearn</h1>
      <div className="max-w-3xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              CryptoLearn is dedicated to democratizing education in blockchain and cryptocurrency technologies. We
              believe that knowledge should be accessible to everyone, regardless of their background or location. Our
              platform aims to bridge the gap between traditional education and the rapidly evolving world of Web3.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What We Offer</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Comprehensive courses on blockchain, cryptocurrency, and Web3 technologies</li>
              <li>Expert-led instruction from industry professionals</li>
              <li>Hands-on projects and real-world applications</li>
              <li>NFT certificates to verify your skills on the blockchain</li>
              <li>A supportive community of learners and educators</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Our Team</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              CryptoLearn was founded by a team of blockchain enthusiasts, educators, and technologists who saw the need
              for quality education in this rapidly growing field. Our diverse team brings together expertise from
              various backgrounds, including computer science, finance, and education, to create a holistic learning
              experience.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

