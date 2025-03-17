"use client"

import { useState, useEffect } from "react"
import { useWeb3 } from "@/lib/web3-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, ArrowRight, RefreshCw, Clock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function YieldFarming() {
  const { isConnected } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const [yieldStats, setYieldStats] = useState({
    totalStaked: 0.1,
    yieldGenerated: 0.01,
    apy: 10,
    nextYieldIn: 300, // seconds
    totalValue: 0.11,
  })
  const [countdown, setCountdown] = useState(yieldStats.nextYieldIn)

  // Simulate countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Reset timer and add yield
          setYieldStats((prev) => ({
            ...prev,
            yieldGenerated: prev.yieldGenerated + 0.001,
            totalValue: prev.totalStaked + prev.yieldGenerated + 0.001,
          }))
          return yieldStats.nextYieldIn
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [yieldStats.nextYieldIn])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const generateYield = async () => {
    setIsLoading(true)

    // Simulate yield generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setYieldStats((prev) => ({
      ...prev,
      yieldGenerated: prev.yieldGenerated + 0.005,
      totalValue: prev.totalStaked + prev.yieldGenerated + 0.005,
    }))

    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Yield Farming</CardTitle>
          <CardDescription>Grow investor funds through yield farming to increase rewards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-6 border rounded-lg">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">Total Value</h3>
                  <span className="font-bold">{yieldStats.totalValue.toFixed(3)} ETH</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Principal</span>
                      <span>{yieldStats.totalStaked.toFixed(3)} ETH</span>
                    </div>
                    <Progress value={(yieldStats.totalStaked / yieldStats.totalValue) * 100} />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Yield</span>
                      <span>{yieldStats.yieldGenerated.toFixed(3)} ETH</span>
                    </div>
                    <Progress value={(yieldStats.yieldGenerated / yieldStats.totalValue) * 100} />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <div className="text-sm font-medium">Next Yield In</div>
                    <div className="text-2xl font-bold">{formatTime(countdown)}</div>
                  </div>
                </div>

                <Button onClick={generateYield} disabled={isLoading} className="flex items-center gap-1">
                  <RefreshCw className="h-4 w-4" />
                  {isLoading ? "Generating..." : "Generate Yield"}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Yield Farming Stats</h3>
              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">APY</span>
                  <span className="font-medium text-green-600">{yieldStats.apy}%</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Staked</span>
                  <span className="font-medium">{yieldStats.totalStaked.toFixed(3)} ETH</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Yield Generated</span>
                  <span className="font-medium">{yieldStats.yieldGenerated.toFixed(3)} ETH</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Value</span>
                  <span className="font-medium">{yieldStats.totalValue.toFixed(3)} ETH</span>
                </div>

                <Alert className="mt-2">
                  <AlertTitle>Simulation Notice</AlertTitle>
                  <AlertDescription>
                    For this MVP, yield is simulated. In production, real DeFi protocols would be integrated.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Current APY: {yieldStats.apy}%
          </div>

          <Button variant="outline" size="sm" className="flex items-center gap-1">
            Next: Learning Hub <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How Yield Farming Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center text-center p-4 border rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Stake</h3>
              <p className="text-sm text-muted-foreground">Investor funds are staked in yield farming protocols</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 border rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Generate</h3>
              <p className="text-sm text-muted-foreground">Yield is generated over time based on the APY</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 border rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <RefreshCw className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Compound</h3>
              <p className="text-sm text-muted-foreground">Yields can be compounded to maximize returns</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 border rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Distribute</h3>
              <p className="text-sm text-muted-foreground">Funds are moved to rewards for distribution</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

