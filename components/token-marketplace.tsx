"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useWeb3 } from "@/lib/web3-service"
import { Zap, ShoppingCart, Lock } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Reward {
  id: number
  name: string
  description: string
  tokenPrice: number
  image: string
}

/**
 * TokenMarketplace Component
 *
 * This component displays a marketplace where users can redeem their
 * LEARN tokens for various rewards such as premium courses, NFT certificates,
 * and other digital assets.
 */
export function TokenMarketplace() {
  const { isConnected, tokenBalance, contracts } = useWeb3()
  const [rewards, setRewards] = useState<Reward[]>([])
  const [isPurchasing, setPurchasing] = useState<number | null>(null)

  // Sample rewards data - in a real app, this would come from the blockchain
  useEffect(() => {
    setRewards([
      {
        id: 1,
        name: "Premium Course Access",
        description: "Unlock all premium courses for 30 days",
        tokenPrice: 200,
        image: "/marketplace/premium-courses.jpg",
      },
      {
        id: 2,
        name: "NFT Certificate",
        description: "Convert your certificate to an NFT",
        tokenPrice: 150,
        image: "/marketplace/nft-certificate.jpg",
      },
      {
        id: 3,
        name: "1-on-1 Mentoring",
        description: "30-minute session with an expert",
        tokenPrice: 300,
        image: "/marketplace/mentoring.jpg",
      },
      {
        id: 4,
        name: "Community Access",
        description: "Access to private community channels",
        tokenPrice: 100,
        image: "/marketplace/community.jpg",
      },
    ])
  }, [])

  const handlePurchase = async (rewardId: number) => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to purchase rewards",
        variant: "destructive",
      })
      return
    }

    const reward = rewards.find((r) => r.id === rewardId)
    if (!reward) return

    if (Number.parseFloat(tokenBalance) < reward.tokenPrice) {
      toast({
        title: "Insufficient tokens",
        description: `You need ${reward.tokenPrice} LEARN tokens to purchase this reward`,
        variant: "destructive",
      })
      return
    }

    setPurchasing(rewardId)

    try {
      // In a real app, this would call the smart contract
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Purchase Successful!",
        description: `You have successfully purchased ${reward.name}`,
        variant: "default",
      })

      // Update the local token balance
      // In a real app, this would happen automatically through events
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive",
      })
    } finally {
      setPurchasing(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Token Marketplace</h2>
          <p className="text-gray-400">Redeem your LEARN tokens for rewards</p>
        </div>
        <div className="bg-[#1E293B] border border-[#2D3748] rounded-lg px-4 py-2 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-yellow-400" />
          <span className="font-bold text-yellow-400">{Number.parseFloat(tokenBalance).toFixed(2)} LEARN</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {rewards.map((reward) => (
          <Card key={reward.id} className="bg-[#1E293B] border-[#2D3748] overflow-hidden">
            <div className="h-40 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              {reward.image ? (
                <img
                  src={reward.image || "/placeholder.svg"}
                  alt={reward.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ShoppingCart className="h-16 w-16 text-white" />
              )}
            </div>
            <CardHeader className="p-4 pb-0">
              <CardTitle className="text-lg">{reward.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="text-sm text-gray-400 mb-2">{reward.description}</p>
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-1 text-yellow-400" />
                <span className="font-bold text-yellow-400">{reward.tokenPrice} LEARN</span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                onClick={() => handlePurchase(reward.id)}
                disabled={isPurchasing !== null || !isConnected || Number.parseFloat(tokenBalance) < reward.tokenPrice}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isPurchasing === reward.id ? (
                  "Processing..."
                ) : !isConnected ? (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </>
                ) : Number.parseFloat(tokenBalance) < reward.tokenPrice ? (
                  "Insufficient Tokens"
                ) : (
                  "Purchase"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

