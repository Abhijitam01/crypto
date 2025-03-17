"use client"

import { useState, useEffect } from "react"
import { useWeb3 } from "@/lib/web3-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Award, BookOpen, DollarSign, GraduationCap, TrendingUp, Trophy } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ConnectWallet } from "@/components/connect-wallet"
import { InvestorFunding } from "@/components/investor-funding"
import { YieldFarming } from "@/components/yield-farming"
import { LearningHub } from "@/components/learning-hub"
import { Rewards } from "@/components/rewards"
import { Certificates } from "@/components/certificates"

export default function Home() {
  const { isConnected, address, provider, chainId } = useWeb3()
  const [activeTab, setActiveTab] = useState("overview")
  const [platformStats, setPlatformStats] = useState({
    investorPool: "0.00",
    yieldGenerated: "0.00",
    activeStudents: 0,
    coursesCompleted: 0,
    rewardsDistributed: "0.00",
    certificatesMinted: 0,
  })

  // Fetch platform stats
  useEffect(() => {
    if (isConnected && provider) {
      // In a real app, we would fetch these from the contracts
      // For demo purposes, we're using mock data
      setPlatformStats({
        investorPool: "0.10",
        yieldGenerated: "0.01",
        activeStudents: 12,
        coursesCompleted: 8,
        rewardsDistributed: "0.06",
        certificatesMinted: 5,
      })
    }
  }, [isConnected, provider])

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">GradXP</h1>
        <p className="text-xl text-muted-foreground mt-2">Learn, Excel, Earn – Powered by Web3 and Yield Farming</p>

        {!isConnected && (
          <div className="mt-6">
            <ConnectWallet />
          </div>
        )}
      </div>

      {isConnected ? (
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="invest">Invest</TabsTrigger>
            <TabsTrigger value="yield">Yield</TabsTrigger>
            <TabsTrigger value="learn">Learn</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-primary" />
                    Investor Pool
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{platformStats.investorPool} ETH</div>
                  <p className="text-xs text-muted-foreground">+{platformStats.yieldGenerated} ETH from yield</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-primary" />
                    Active Students
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{platformStats.activeStudents}</div>
                  <p className="text-xs text-muted-foreground">{platformStats.coursesCompleted} courses completed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Trophy className="h-4 w-4 mr-2 text-primary" />
                    Rewards Distributed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{platformStats.rewardsDistributed} ETH</div>
                  <p className="text-xs text-muted-foreground">
                    {platformStats.certificatesMinted} certificates minted
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Platform Overview</CardTitle>
                <CardDescription>
                  GradXP is a decentralized education platform where users learn, top performers earn rewards, and
                  investor funds grow via yield farming before distribution.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" /> Investor Funding
                    </span>
                    <span>Step 1</span>
                  </div>
                  <Progress value={100} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" /> Yield Farming
                    </span>
                    <span>Step 2</span>
                  </div>
                  <Progress value={80} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" /> Learning Hub
                    </span>
                    <span>Step 3</span>
                  </div>
                  <Progress value={60} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <Award className="h-4 w-4 mr-2" /> Rewards Distribution
                    </span>
                    <span>Step 4</span>
                  </div>
                  <Progress value={40} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <GraduationCap className="h-4 w-4 mr-2" /> NFT Certificates
                    </span>
                    <span>Step 5</span>
                  </div>
                  <Progress value={30} />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setActiveTab("invest")}>Get Started</Button>
              </CardFooter>
            </Card>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Hackathon Demo</AlertTitle>
              <AlertDescription>
                This is a simplified MVP for demonstration purposes. In a production environment, real DeFi protocols
                would be integrated for yield farming.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="invest">
            <InvestorFunding />
          </TabsContent>

          <TabsContent value="yield">
            <YieldFarming />
          </TabsContent>

          <TabsContent value="learn">
            <LearningHub />
          </TabsContent>

          <TabsContent value="rewards">
            <Rewards />
          </TabsContent>

          <TabsContent value="certificates">
            <Certificates />
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Welcome to GradXP</CardTitle>
            <CardDescription>Connect your wallet to start learning and earning rewards.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>GradXP is a decentralized education platform where:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Investors fund the reward pool</li>
              <li>Funds grow through yield farming</li>
              <li>Students learn and complete courses</li>
              <li>Top performers earn ETH and token rewards</li>
              <li>Course completions are certified as NFTs</li>
            </ul>
          </CardContent>
          <CardFooter>
            <ConnectWallet />
          </CardFooter>
        </Card>
      )}
    </main>
  )
}

