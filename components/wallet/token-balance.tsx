"use client"

import { useState } from "react"
import { useWeb3 } from "@/lib/web3-service"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Wallet, Zap } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

/**
 * TokenBalance Component
 *
 * This component displays the user's LEARN token and native currency balances,
 * with the ability to refresh the balances.
 */
export function TokenBalance() {
  const { tokenBalance, nativeBalance, refreshBalances, isConnected, address } = useWeb3()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Handle balance refresh
  const handleRefresh = async () => {
    if (!isConnected) return

    setIsRefreshing(true)
    try {
      await refreshBalances()
      toast({
        title: "Balances Updated",
        description: "Your wallet balances have been refreshed",
      })
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh balances",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  if (!isConnected) {
    return (
      <Card className="bg-[#1E293B] border-[#2D3748]">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
          <Wallet className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-400">Connect your wallet to view your token balance</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-[#1E293B] border-[#2D3748]">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Your Balance</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#2D3748]"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center p-4 rounded-lg bg-[#0F172A] border border-[#2D3748]">
            <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center mr-4">
              <Zap className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-400">LEARN Token</p>
              <p className="text-xl font-bold text-yellow-400">{Number.parseFloat(tokenBalance).toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center p-4 rounded-lg bg-[#0F172A] border border-[#2D3748]">
            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L19.5 15H4.5L12 2Z" fill="currentColor" />
                <path d="M12 22L4.5 15H19.5L12 22Z" fill="currentColor" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-400">ETH Balance</p>
              <p className="text-xl font-bold">{Number.parseFloat(nativeBalance).toFixed(4)} ETH</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

