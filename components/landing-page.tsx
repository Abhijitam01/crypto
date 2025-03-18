"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, BookOpen, Award, Shield, Globe, Zap, Users, BarChart4, Layers } from "lucide-react"

export default function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  const [activeTab, setActiveTab] = useState(0)

  const features = [
    {
      title: "Blockchain-Verified Credentials",
      description: "Earn tamper-proof certificates stored on the blockchain, verifiable by employers worldwide.",
      icon: Shield,
    },
    {
      title: "Learn-to-Earn Model",
      description: "Earn GXP tokens as you complete courses, quizzes, and contribute to the platform.",
      icon: Award,
    },
    {
      title: "Decentralized Education Marketplace",
      description: "Access courses from top educators globally with transparent pricing and revenue sharing.",
      icon: Globe,
    },
    {
      title: "Smart Contract Scholarships",
      description: "Automated scholarship distribution based on performance and need, with full transparency.",
      icon: Zap,
    },
    {
      title: "Community Governance",
      description: "Token holders vote on curriculum development, platform features, and fund allocation.",
      icon: Users,
    },
    {
      title: "Real-time Analytics",
      description: "Track learning progress, investment returns, and market trends in one dashboard.",
      icon: BarChart4,
    },
  ]

  const testimonials = [
    {
      quote:
        "GradXP transformed how we verify candidate credentials. The blockchain verification saved us weeks of background checks.",
      author: "Sarah Chen",
      title: "HR Director, TechGlobal",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      quote: "As an educator, I've increased my reach 10x and earn 3x more through GradXP's decentralized marketplace.",
      author: "Prof. James Wilson",
      title: "Computer Science Educator",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      quote:
        "The learn-to-earn model motivated me to complete courses I'd been putting off for years. Now I have verifiable skills and tokens!",
      author: "Miguel Rodriguez",
      title: "Software Developer",
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  const stats = [
    { label: "Active Learners", value: "12,500+" },
    { label: "Courses Available", value: "350+" },
    { label: "Countries Reached", value: "75+" },
    { label: "Completion Rate", value: "87%" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>GradXP</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              About
            </Button>
            <Button variant="ghost" size="sm">
              Features
            </Button>
            <Button variant="ghost" size="sm">
              Testimonials
            </Button>
            <Button variant="ghost" size="sm">
              Contact
            </Button>
            <Button onClick={onGetStarted}>Get Started</Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Revolutionizing Education with Blockchain Technology
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  GradXP combines decentralized learning, blockchain verification, and tokenized incentives to create
                  the future of education.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" onClick={onGetStarted}>
                    Get Started
                  </Button>
                  <Button size="lg" variant="outline">
                    Watch Demo
                  </Button>
                </div>
              </div>
              <img
                src="/placeholder.svg?height=500&width=500"
                alt="GradXP Platform"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <h3 className="text-3xl font-bold">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Transforming education with blockchain technology and decentralized learning
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="mt-4 text-muted-foreground md:text-xl">A seamless experience from learning to earning</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">1. Learn</h3>
                <p className="text-muted-foreground">
                  Enroll in courses from top educators worldwide. Complete lessons, projects, and assessments.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Award className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">2. Earn</h3>
                <p className="text-muted-foreground">
                  Receive GXP tokens for completing courses, quizzes, and contributing to the platform.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Layers className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">3. Verify</h3>
                <p className="text-muted-foreground">
                  Get blockchain-verified certificates that can be instantly validated by employers globally.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What People Say</h2>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Hear from our community of learners, educators, and employers
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col space-y-4">
                      <p className="italic text-muted-foreground">"{testimonial.quote}"</p>
                      <div className="flex items-center space-x-4">
                        <img
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.author}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="text-sm font-semibold">{testimonial.author}</h4>
                          <p className="text-xs text-muted-foreground">{testimonial.title}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Transform Education?
            </h2>
            <p className="mt-4 md:text-xl max-w-[700px] mx-auto">
              Join GradXP today and be part of the revolution in decentralized learning and blockchain-verified
              credentials.
            </p>
            <Button size="lg" variant="secondary" className="mt-8" onClick={onGetStarted}>
              Get Started Now
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 font-bold text-xl mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>GradXP</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Revolutionizing education with blockchain technology and decentralized learning.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Courses
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Testimonials
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Team
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Cookies
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} GradXP. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

