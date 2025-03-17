"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useWeb3 } from "@/lib/web3-service"
import { useAuth } from "@/lib/auth-service"
import { Zap, Lock, CheckCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface TokenRewardProps {
  courseId: string
  lessonId: string
  tokenAmount: number
  isCompleted: boolean
  onComplete: () => void
}

/**
 * TokenReward Component
 *
 * This component displays a token reward card for completing a lesson.
 * Users can claim tokens after completing the lesson, which are then
 * added to their wallet.
 */
export function TokenReward({ courseId, lessonId, tokenAmount, isCompleted, onComplete }: TokenRewardProps) {
  const { isConnected, address } = useWeb3()
  const { user } = useAuth()
  const [isClaiming, setIsClaiming] = useState(false)
  const [isClaimed, setIsClaimed] = useState(isCompleted)

  const handleClaim = async () => {
    if (!isConnected || !user) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to claim tokens",
        variant: "destructive",
      })
      return
    }

    setIsClaiming(true)

    try {
      // In a real app, this would call a server endpoint that would
      // verify the completion and then trigger the smart contract
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful claim
      setIsClaimed(true)
      onComplete()

      toast({
        title: "Tokens Claimed!",
        description: `${tokenAmount} LEARN tokens have been added to your wallet`,
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Claim Failed",
        description: "There was an error claiming your tokens. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsClaiming(false)
    }
  }

  return (
    <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-[#2D3748] overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-yellow-500/20 p-2 rounded-full mr-3">
              <Zap className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-medium">Lesson Reward</h3>
              <p className="text-sm text-gray-400">Complete this lesson to earn tokens</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-yellow-400">{tokenAmount} LEARN</p>
          </div>
        </div>

        <div className="mt-4">
          {isClaimed ? (
            <Button disabled className="w-full bg-green-600">
              <CheckCircle className="mr-2 h-4 w-4" />
              Claimed
            </Button>
          ) : isConnected ? (
            <Button onClick={handleClaim} disabled={isClaiming} className="w-full bg-blue-600 hover:bg-blue-700">
              {isClaiming ? "Claiming..." : "Claim Tokens"}
            </Button>
          ) : (
            <Button disabled className="w-full bg-gray-700">
              <Lock className="mr-2 h-4 w-4" />
              Connect Wallet to Claim
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

