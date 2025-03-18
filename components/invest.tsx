"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DollarSign, TrendingUp, PieChart, Info, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useWallet } from "@/hooks/use-wallet"
import { useToast } from "@/components/ui/use-toast"
import { investInPlatform } from "@/lib/contracts"

export default function Invest() {
  const { isConnected, signer } = useWallet()
  const { toast } = useToast()
  const [investAmount, setInvestAmount] = useState("")
  const [isInvesting, setIsInvesting] = useState(false)
  const [investments, setInvestments] = useState([
    { id: 1, amount: 2.5, date: "March 15, 2025", yield: 0.125 },
    { id: 2, amount: 1.0, date: "March 17, 2025", yield: 0.03 },
  ])
  const [showSuccess, setShowSuccess] = useState(false)

  const handleInvest = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to invest",
        variant: "destructive",
      })
      return
    }

    if (investAmount && Number.parseFloat(investAmount) > 0) {
      setIsInvesting(true)
      try {
        const success = await investInPlatform(signer, investAmount)

        if (success) {
          const newInvestment = {
            id: investments.length + 1,
            amount: Number.parseFloat(investAmount),
            date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            yield: 0,
          }

          setInvestments([...investments, newInvestment])
          setInvestAmount("")
          setShowSuccess(true)

          toast({
            title: "Investment successful",
            description: `You have successfully invested ${investAmount} ETH`,
          })

          setTimeout(() => {
            setShowSuccess(false)
          }, 3000)
        }
      } catch (error) {
        console.error("Error investing:", error)
        toast({
          title: "Investment failed",
          description: "There was an error processing your investment",
          variant: "destructive",
        })
      } finally {
        setIsInvesting(false)
      }
    }
  }

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const totalYield = investments.reduce((sum, inv) => sum + inv.yield, 0)

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Invest</h2>

      {!isConnected && (
        <Alert className="bg-amber-50 border-amber-200 text-amber-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wallet not connected</AlertTitle>
          <AlertDescription>Connect your wallet to invest in the platform and earn returns.</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Invest in Education</CardTitle>
            <CardDescription>Fund the platform with ETH to support learners and earn simulated returns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {showSuccess && (
              <Alert className="bg-green-50 text-green-700 border-green-200">
                <TrendingUp className="h-4 w-4" />
                <AlertTitle>Investment Successful</AlertTitle>
                <AlertDescription>Your investment has been added to the platform pool.</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Investment Amount (ETH)</span>
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                  disabled={!isConnected || isInvesting}
                />
                <Button
                  onClick={handleInvest}
                  disabled={!isConnected || isInvesting || !investAmount || Number.parseFloat(investAmount) <= 0}
                >
                  {isInvesting ? "Processing..." : "Invest"}
                </Button>
              </div>
            </div>

            <div className="rounded-lg border p-4 space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                How it works
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• 50% of your investment goes to the yield pool</p>
                <p>• 50% goes to the learner reward pool</p>
                <p>• The yield pool grows at 1% per minute (simulated)</p>
                <p>• You earn 20% of course purchase revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investment Summary</CardTitle>
            <CardDescription>Overview of your investments and returns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Invested</p>
                <p className="text-2xl font-bold">{totalInvested.toFixed(2)} ETH</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Yield</p>
                <p className="text-2xl font-bold text-green-600">{totalYield.toFixed(3)} ETH</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>ROI</span>
                <span>{totalInvested > 0 ? ((totalYield / totalInvested) * 100).toFixed(2) : "0.00"}%</span>
              </div>
              <Progress value={totalInvested > 0 ? Math.min((totalYield / totalInvested) * 100, 100) : 0} />
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-medium">Allocation</h4>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24">
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-muted">
                    <div className="absolute top-0 left-0 w-1/2 h-full bg-primary"></div>
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-background flex items-center justify-center">
                      <PieChart className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="text-sm">Yield Pool (50%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                    <span className="text-sm">Reward Pool (50%)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Investment History</CardTitle>
          <CardDescription>Record of your platform investments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {investments.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No investments yet. Start investing to see your history.
              </p>
            ) : (
              <div className="space-y-4">
                {investments.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{inv.amount.toFixed(2)} ETH</p>
                      <p className="text-sm text-muted-foreground">{inv.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">+{inv.yield.toFixed(3)} ETH</p>
                      <p className="text-sm text-muted-foreground">
                        {inv.yield > 0 ? ((inv.yield / inv.amount) * 100).toFixed(2) : "0.00"}% return
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

