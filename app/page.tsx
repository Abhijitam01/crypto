"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Trophy, TrendingUp, Wallet, Award, BarChart, CheckCircle, DollarSign, Menu } from "lucide-react"
import Dashboard from "@/components/dashboard"
import Courses from "@/components/courses"
import Leaderboard from "@/components/leaderboard"
import Certificates from "@/components/certificates"
import Invest from "@/components/invest"
import ConnectWallet from "@/components/connect-wallet"
import { useWallet } from "@/hooks/use-wallet"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import LandingPage from "@/components/landing-page"
import MarketStats from "@/components/market-stats"
import Roadmap from "@/components/roadmap"
import Partners from "@/components/partners"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Home() {
  const { address, balance, isConnected } = useWallet()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [showLanding, setShowLanding] = useState(true)

  // Scroll to section when hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "")
      if (hash) {
        setActiveSection(hash)
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }
    }

    handleHashChange() // Handle initial hash
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  if (showLanding) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light">
        <LandingPage onGetStarted={() => setShowLanding(false)} />
        <Toaster />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <div className="flex items-center gap-2 font-bold text-xl">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>GradXP</span>
            </div>
            <div className="hidden md:flex items-center space-x-4 mx-6">
              <Button variant="ghost" size="sm" asChild>
                <a href="#dashboard">Dashboard</a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="#market">Market</a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="#courses">Courses</a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="#roadmap">Roadmap</a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="#partners">Partners</a>
              </Button>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {isConnected ? (
                <>
                  <Badge variant="outline" className="hidden md:flex gap-1 items-center">
                    <Wallet className="h-3 w-3" />
                    <span>{balance} ETH</span>
                  </Badge>
                  <Badge variant="outline" className="hidden md:flex gap-1 items-center">
                    <Award className="h-3 w-3" />
                    <span>25 GXP Points</span>
                  </Badge>
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </>
              ) : (
                <ConnectWallet />
              )}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="grid gap-4 py-4">
                    <Button variant="ghost" className="justify-start" asChild>
                      <a href="#dashboard">Dashboard</a>
                    </Button>
                    <Button variant="ghost" className="justify-start" asChild>
                      <a href="#market">Market</a>
                    </Button>
                    <Button variant="ghost" className="justify-start" asChild>
                      <a href="#courses">Courses</a>
                    </Button>
                    <Button variant="ghost" className="justify-start" asChild>
                      <a href="#roadmap">Roadmap</a>
                    </Button>
                    <Button variant="ghost" className="justify-start" asChild>
                      <a href="#partners">Partners</a>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10 py-6">
          <aside className="fixed top-20 z-30 -ml-2 hidden h-[calc(100vh-80px)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
            <div className="py-6 pr-6 lg:py-8">
              <nav className="grid gap-4 text-sm">
                <Button
                  variant={activeSection === "dashboard" ? "default" : "ghost"}
                  className="flex items-center justify-start gap-2"
                  asChild
                >
                  <a href="#dashboard">
                    <BarChart className="h-4 w-4" />
                    Dashboard
                  </a>
                </Button>
                <Button
                  variant={activeSection === "market" ? "default" : "ghost"}
                  className="flex items-center justify-start gap-2"
                  asChild
                >
                  <a href="#market">
                    <TrendingUp className="h-4 w-4" />
                    Market Stats
                  </a>
                </Button>
                <Button
                  variant={activeSection === "courses" ? "default" : "ghost"}
                  className="flex items-center justify-start gap-2"
                  asChild
                >
                  <a href="#courses">
                    <BookOpen className="h-4 w-4" />
                    Courses
                  </a>
                </Button>
                <Button
                  variant={activeSection === "leaderboard" ? "default" : "ghost"}
                  className="flex items-center justify-start gap-2"
                  asChild
                >
                  <a href="#leaderboard">
                    <Trophy className="h-4 w-4" />
                    Leaderboard
                  </a>
                </Button>
                <Button
                  variant={activeSection === "certificates" ? "default" : "ghost"}
                  className="flex items-center justify-start gap-2"
                  asChild
                >
                  <a href="#certificates">
                    <CheckCircle className="h-4 w-4" />
                    Certificates
                  </a>
                </Button>
                <Button
                  variant={activeSection === "invest" ? "default" : "ghost"}
                  className="flex items-center justify-start gap-2"
                  asChild
                >
                  <a href="#invest">
                    <DollarSign className="h-4 w-4" />
                    Invest
                  </a>
                </Button>
                <Button
                  variant={activeSection === "roadmap" ? "default" : "ghost"}
                  className="flex items-center justify-start gap-2"
                  asChild
                >
                  <a href="#roadmap">
                    <TrendingUp className="h-4 w-4" />
                    Roadmap
                  </a>
                </Button>
                <Button
                  variant={activeSection === "partners" ? "default" : "ghost"}
                  className="flex items-center justify-start gap-2"
                  asChild
                >
                  <a href="#partners">
                    <Award className="h-4 w-4" />
                    Partners
                  </a>
                </Button>
                <Separator className="my-4" />
                <div className="space-y-4">
                  <div className="text-xs font-semibold">Platform Stats</div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Total Investors</span>
                      <span className="text-xs font-medium">24</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Total Learners</span>
                      <span className="text-xs font-medium">156</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Courses Completed</span>
                      <span className="text-xs font-medium">89</span>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </aside>
          <main className="flex flex-col gap-10">
            <section id="dashboard">
              <Dashboard />
            </section>
            <section id="market">
              <MarketStats />
            </section>
            <section id="courses">
              <Courses />
            </section>
            <section id="leaderboard">
              <Leaderboard />
            </section>
            <section id="certificates">
              <Certificates />
            </section>
            <section id="invest">
              <Invest />
            </section>
            <section id="roadmap">
              <Roadmap />
            </section>
            <section id="partners">
              <Partners />
            </section>
          </main>
        </div>
        <footer className="border-t py-6">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-muted-foreground md:text-left">
              &copy; {new Date().getFullYear()} GradXP. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
      <Toaster />
    </ThemeProvider>
  )
}

