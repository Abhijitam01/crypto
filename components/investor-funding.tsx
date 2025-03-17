"use client"

import { useState } from "react"
import { useWeb3 } from "@/lib/web3-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign, Clock, ArrowRight } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export function InvestorFunding() {
  const { isConnected, provider, address } = useWeb3()
  const [amount, setAmount] = useState("0.1")
  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [fundingStats, setFundingStats] = useState({
    totalFunds: "0.10",
    lockPeriod: "30 days",
    investors: 1,
    status: "Active",
  })

  const handleInvest = async () => {
    if (!isConnected || !provider) return

    try {
      setIsLoading(true)

      // In a real app, we would call the FundingContract
      // For demo purposes, we're simulating the transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setTxHash("0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef")

      // Update stats
      setFundingStats((prev) => ({
        ...prev,
        totalFunds: (Number.parseFloat(prev.totalFunds) + Number.parseFloat(amount)).toFixed(2),
        investors: prev.investors + 1,
      }))

      setIsLoading(false)
    } catch (error) {
      console.error("Investment error:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Investor Funding</CardTitle>
          <CardDescription>Seed the reward pool with investor capital to fund student rewards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Investment Amount (ETH)</Label>
                <div className="flex">
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0.01"
                    step="0.01"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                onClick={handleInvest}
                disabled={!isConnected || isLoading || Number.parseFloat(amount) <= 0}
                className="w-full"
              >
                {isLoading ? "Processing..." : "Invest Now"}
              </Button>

              {txHash && (
                <Alert className="mt-4">
                  <AlertTitle>Transaction Successful</AlertTitle>
                  <AlertDescription className="break-all">Transaction Hash: {txHash}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Funding Pool Stats</h3>
              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Funds</span>
                  <span className="font-medium">{fundingStats.totalFunds} ETH</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lock Period</span>
                  <span className="font-medium">{fundingStats.lockPeriod}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Investors</span>
                  <span className="font-medium">{fundingStats.investors}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline" className="font-medium">
                    {fundingStats.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Funds are locked for {fundingStats.lockPeriod}
          </div>

          <Button variant="outline" size="sm" className="flex items-center gap-1">
            Next: Yield Farming <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How Investor Funding Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center text-center p-4 border rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Invest</h3>
              <p className="text-sm text-muted-foreground">Investors contribute ETH to the funding pool</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 border rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Lock Period</h3>
              <p className="text-sm text-muted-foreground">Funds are locked for a set period to ensure stability</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 border rounded-lg">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Yield Farming</h3>
              <p className="text-sm text-muted-foreground">Funds are moved to yield farming to generate returns</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

