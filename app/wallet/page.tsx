"use client"

import { useEffect } from "react"
import { useWeb3 } from "@/lib/web3-service"
import { WalletConnect } from "@/components/wallet/wallet-connect"
import { TokenBalance } from "@/components/wallet/token-balance"
import { TransactionHistory } from "@/components/wallet/transaction-history"
import { NetworkSelector } from "@/components/wallet/network-selector"
import { Web3Status } from "@/components/wallet/web3-status"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, History, Award, ShoppingCart } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

/**
 * WalletPage Component
 *
 * This page provides a comprehensive dashboard for managing the user's
 * wallet, including balances, transactions, certificates, and marketplace.
 */
export default function WalletPage() {
  const { isConnected, connect } = useWeb3()

  // Attempt to connect wallet on page load if previously connected
  useEffect(() => {
    const attemptReconnect = async () => {
      try {
        if (!isConnected && localStorage.getItem("web3-storage")) {
          await connect()
        }
      } catch (error) {
        console.error("Failed to reconnect wallet:", error)
      }
    }

    attemptReconnect()
  }, [isConnected, connect])

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Wallet Dashboard</h1>
          <p className="text-gray-400">Manage your crypto assets and transactions</p>
        </div>

        <div className="flex items-center gap-4">
          <Web3Status />
          <NetworkSelector />
          <WalletConnect />
        </div>
      </div>

      {isConnected ? (
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-[#1E293B] border border-[#2D3748]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#2D3748]">
              <Wallet className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-[#2D3748]">
              <History className="h-4 w-4 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="certificates" className="data-[state=active]:bg-[#2D3748]">
              <Award className="h-4 w-4 mr-2" />
              Certificates
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="data-[state=active]:bg-[#2D3748]">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Marketplace
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <TokenBalance />
              </div>
              <div className="md:col-span-2">
                <TransactionHistory />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionHistory />
          </TabsContent>

          <TabsContent value="certificates">
            <Card className="bg-[#1E293B] border-[#2D3748]">
              <CardHeader>
                <CardTitle>Your Certificates</CardTitle>
                <CardDescription className="text-gray-400">View and manage your earned certificates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">
                  <Award className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="mb-4">You don't have any certificates yet</p>
                  <Button
                    onClick={() =>
                      toast({
                        title: "Coming Soon",
                        description: "Certificate functionality will be available soon!",
                      })
                    }
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Explore Courses
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketplace">
            <Card className="bg-[#1E293B] border-[#2D3748]">
              <CardHeader>
                <CardTitle>Token Marketplace</CardTitle>
                <CardDescription className="text-gray-400">Redeem your LEARN tokens for rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="mb-4">Marketplace coming soon!</p>
                  <Button
                    onClick={() =>
                      toast({
                        title: "Coming Soon",
                        description: "Marketplace functionality will be available soon!",
                      })
                    }
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Get Notified
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="bg-[#1E293B] border-[#2D3748]">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <Wallet className="h-16 w-16 text-gray-400 mb-6" />
            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6 max-w-md">
              Connect your wallet to view your balances, transactions, and certificates
            </p>
            <Button
              onClick={() => connect()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
            >
              <Wallet className="mr-2 h-5 w-5" />
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

