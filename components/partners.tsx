"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Partners() {
  const corporatePartners = [
    {
      name: "TechGlobal",
      logo: "/placeholder.svg?height=80&width=80",
      description: "Fortune 500 technology company using GradXP for employee upskilling",
      type: "Enterprise Client",
    },
    {
      name: "FinanceHub",
      logo: "/placeholder.svg?height=80&width=80",
      description: "Leading financial services firm verifying blockchain certificates",
      type: "Hiring Partner",
    },
    {
      name: "HealthInnovate",
      logo: "/placeholder.svg?height=80&width=80",
      description: "Healthcare provider training staff on blockchain technology",
      type: "Enterprise Client",
    },
    {
      name: "RetailNext",
      logo: "/placeholder.svg?height=80&width=80",
      description: "Retail chain implementing GradXP for customer education",
      type: "Implementation Partner",
    },
  ]

  const educationalPartners = [
    {
      name: "Global University",
      logo: "/placeholder.svg?height=80&width=80",
      description: "Top-ranked university offering blockchain-verified certificates",
      type: "Academic Partner",
    },
    {
      name: "Tech Institute",
      logo: "/placeholder.svg?height=80&width=80",
      description: "Technical college integrating GradXP with existing curriculum",
      type: "Content Provider",
    },
    {
      name: "Future Academy",
      logo: "/placeholder.svg?height=80&width=80",
      description: "K-12 education network implementing early blockchain education",
      type: "Academic Partner",
    },
    {
      name: "Research Consortium",
      logo: "/placeholder.svg?height=80&width=80",
      description: "Research group studying impact of blockchain in education",
      type: "Research Partner",
    },
  ]

  const technologyPartners = [
    {
      name: "BlockChain Solutions",
      logo: "/placeholder.svg?height=80&width=80",
      description: "Providing underlying blockchain infrastructure for certificates",
      type: "Technology Provider",
    },
    {
      name: "SecureVerify",
      logo: "/placeholder.svg?height=80&width=80",
      description: "Identity verification and KYC solutions for platform users",
      type: "Security Partner",
    },
    {
      name: "DataInsights",
      logo: "/placeholder.svg?height=80&width=80",
      description: "Analytics and reporting tools for learning outcomes",
      type: "Analytics Partner",
    },
    {
      name: "CloudScale",
      logo: "/placeholder.svg?height=80&width=80",
      description: "Cloud infrastructure and scaling solutions",
      type: "Infrastructure Partner",
    },
  ]

  const advisors = [
    {
      name: "Dr. Sarah Chen",
      title: "Education Technology Expert",
      organization: "Former CTO, EdTech Innovations",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Michael Rodriguez",
      title: "Blockchain Strategist",
      organization: "Founder, Blockchain Ventures",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Jennifer Williams",
      title: "Corporate Learning Specialist",
      organization: "VP of Learning, Fortune 100 Company",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "David Kim",
      title: "Venture Capital Advisor",
      organization: "Partner, Education Investors Group",
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Partners & Advisors</h2>
      <p className="text-muted-foreground">Strategic relationships powering GradXP's ecosystem</p>

      <Tabs defaultValue="corporate">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="corporate">Corporate</TabsTrigger>
          <TabsTrigger value="educational">Educational</TabsTrigger>
          <TabsTrigger value="technology">Technology</TabsTrigger>
          <TabsTrigger value="advisors">Advisors</TabsTrigger>
        </TabsList>
        <TabsContent value="corporate" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {corporatePartners.map((partner, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{partner.name}</CardTitle>
                      <Badge variant="outline">{partner.type}</Badge>
                    </div>
                    <img
                      src={partner.logo || "/placeholder.svg"}
                      alt={partner.name}
                      className="h-12 w-12 object-contain"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{partner.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="educational" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {educationalPartners.map((partner, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{partner.name}</CardTitle>
                      <Badge variant="outline">{partner.type}</Badge>
                    </div>
                    <img
                      src={partner.logo || "/placeholder.svg"}
                      alt={partner.name}
                      className="h-12 w-12 object-contain"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{partner.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="technology" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {technologyPartners.map((partner, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{partner.name}</CardTitle>
                      <Badge variant="outline">{partner.type}</Badge>
                    </div>
                    <img
                      src={partner.logo || "/placeholder.svg"}
                      alt={partner.name}
                      className="h-12 w-12 object-contain"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{partner.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="advisors" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {advisors.map((advisor, index) => (
              <Card key={index}>
                <CardHeader className="text-center pb-2">
                  <Avatar className="h-20 w-20 mx-auto mb-2">
                    <AvatarImage src={advisor.avatar} alt={advisor.name} />
                    <AvatarFallback>{advisor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-base">{advisor.name}</CardTitle>
                  <CardDescription>{advisor.title}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground">{advisor.organization}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Become a Partner</CardTitle>
          <CardDescription>
            Join our growing ecosystem of corporate, educational, and technology partners
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium">Corporate Partners</h4>
              <p className="text-sm text-muted-foreground">
                Implement blockchain-verified credentials for your workforce and recruitment.
              </p>
              <Button variant="outline" className="mt-2">
                Learn More
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Educational Partners</h4>
              <p className="text-sm text-muted-foreground">
                Integrate blockchain credentials with your existing educational programs.
              </p>
              <Button variant="outline" className="mt-2">
                Learn More
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Technology Partners</h4>
              <p className="text-sm text-muted-foreground">
                Build integrations and extensions for the GradXP platform ecosystem.
              </p>
              <Button variant="outline" className="mt-2">
                Learn More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

