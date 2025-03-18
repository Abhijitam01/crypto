"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, ArrowRight } from "lucide-react"

export default function Roadmap() {
  const milestones = [
    {
      quarter: "Q1 2025",
      title: "Platform Launch",
      description: "Initial release of GradXP with core learning and blockchain verification features.",
      status: "completed",
      key_deliverables: [
        "Core learning platform",
        "Blockchain certificate verification",
        "Basic token rewards system",
        "Mobile-responsive design",
      ],
    },
    {
      quarter: "Q2 2025",
      title: "Marketplace Expansion",
      description: "Launch of decentralized course marketplace and enhanced token economics.",
      status: "in-progress",
      key_deliverables: [
        "Educator onboarding portal",
        "Course creation tools",
        "Revenue sharing smart contracts",
        "Enhanced token utility features",
      ],
    },
    {
      quarter: "Q3 2025",
      title: "Enterprise Solutions",
      description: "Corporate training solutions and institutional partnerships.",
      status: "upcoming",
      key_deliverables: [
        "Corporate learning management system",
        "Custom certificate branding",
        "Bulk enrollment features",
        "Analytics dashboard for HR teams",
      ],
    },
    {
      quarter: "Q4 2025",
      title: "AI Integration",
      description: "AI-powered personalized learning paths and content recommendations.",
      status: "upcoming",
      key_deliverables: [
        "Personalized learning algorithms",
        "Skill gap analysis",
        "Content recommendation engine",
        "Adaptive assessment system",
      ],
    },
    {
      quarter: "Q1 2026",
      title: "Global Expansion",
      description: "Localization and international partnerships to reach global markets.",
      status: "upcoming",
      key_deliverables: [
        "Multi-language support",
        "Regional content partnerships",
        "Local payment methods",
        "Compliance with regional regulations",
      ],
    },
    {
      quarter: "Q2 2026",
      title: "Decentralized Governance",
      description: "Transition to community governance model with DAO structure.",
      status: "upcoming",
      key_deliverables: [
        "Governance token distribution",
        "Proposal submission system",
        "Voting mechanisms",
        "Treasury management",
      ],
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Product Roadmap</h2>
      <p className="text-muted-foreground">Our strategic plan for platform development and market expansion</p>

      <div className="relative">
        <div className="absolute left-9 top-0 bottom-0 w-px bg-border md:left-[calc(50%-0.5px)]"></div>
        <div className="space-y-12">
          {milestones.map((milestone, index) => (
            <div key={index} className="relative grid items-center grid-cols-1 gap-6 md:grid-cols-2">
              <div className={`md:contents`}>
                <div className={`relative ${index % 2 === 0 ? "md:col-start-1" : "md:col-start-2"} md:row-start-1`}>
                  <div className="absolute left-0 top-6 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border bg-background md:left-auto md:right-0 md:translate-x-1/2">
                    {milestone.status === "completed" ? (
                      <CheckCircle className="h-3 w-3 text-primary" />
                    ) : milestone.status === "in-progress" ? (
                      <Clock className="h-3 w-3 text-amber-500" />
                    ) : (
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{milestone.title}</CardTitle>
                        <Badge
                          variant={
                            milestone.status === "completed"
                              ? "default"
                              : milestone.status === "in-progress"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {milestone.quarter}
                        </Badge>
                      </div>
                      <CardDescription>{milestone.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <h4 className="text-sm font-medium mb-2">Key Deliverables:</h4>
                      <ul className="space-y-1">
                        {milestone.key_deliverables.map((deliverable, i) => (
                          <li key={i} className="text-sm flex items-start">
                            <span className="mr-2">•</span>
                            <span>{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                <div
                  className={`hidden md:block ${index % 2 === 0 ? "md:col-start-2" : "md:col-start-1"} md:row-start-1`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Long-term Vision</CardTitle>
          <CardDescription>Our five-year strategic goals for GradXP</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium">1. Market Leadership</h4>
              <p className="text-sm text-muted-foreground">
                Become the leading blockchain-verified credential platform with 5 million active users and 10,000
                courses.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">2. Industry Integration</h4>
              <p className="text-sm text-muted-foreground">
                Establish GradXP certificates as the standard for digital credentials, with adoption by 500+ major
                employers.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">3. Global Impact</h4>
              <p className="text-sm text-muted-foreground">
                Expand to 100+ countries and provide educational opportunities to 1 million underserved learners.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

