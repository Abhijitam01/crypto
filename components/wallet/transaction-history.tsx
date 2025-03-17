"use client"

import { useState } from "react"
import { useWeb3, TransactionStatus } from "@/lib/web3-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, CheckCircle, XCircle, Clock, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

/**
 * TransactionHistory Component
 *
 * This component displays a history of blockchain transactions,
 * allowing users to view, filter, and clear their transaction history.
 */
export function TransactionHistory() {
  const { transactions, clearTransactions } = useWeb3()
  const [activeTab, setActiveTab] = useState("all")

  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  // Get status badge
  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.PENDING:
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
          >
            <Clock className="h-3 w-3" />
            <span>Pending</span>
          </Badge>
        )
      case TransactionStatus.CONFIRMED:
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-green-500/10 text-green-500 border-green-500/20"
          >
            <CheckCircle className="h-3 w-3" />
            <span>Confirmed</span>
          </Badge>
        )
      case TransactionStatus.FAILED:
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-red-500/10 text-red-500 border-red-500/20">
            <XCircle className="h-3 w-3" />
            <span>Failed</span>
          </Badge>
        )
    }
  }

  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter((tx) => {
    if (activeTab === "all") return true
    return tx.status === activeTab
  })

  // View transaction on block explorer
  const viewOnExplorer = (hash: string) => {
    // In a real app, you'd use the correct block explorer based on the network
    window.open(`https://etherscan.io/tx/${hash}`, "_blank")
  }

  // Handle clear transactions
  const handleClearTransactions = () => {
    clearTransactions()
    toast({
      title: "Transactions Cleared",
      description: "Your transaction history has been cleared",
    })
  }

  return (
    <Card className="bg-[#1E293B] border-[#2D3748] w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription className="text-gray-400">View your recent blockchain transactions</CardDescription>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-[#2D3748]"
              disabled={transactions.length === 0}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#1E293B] border-[#2D3748] text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Clear Transaction History</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This will clear your local transaction history. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-[#2D3748] hover:bg-[#3D4758] text-white">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearTransactions} className="bg-red-600 hover:bg-red-700">
                Clear
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="bg-[#2D3748] w-full">
            <TabsTrigger value="all" className="flex-1">
              All
            </TabsTrigger>
            <TabsTrigger value={TransactionStatus.PENDING} className="flex-1">
              Pending
            </TabsTrigger>
            <TabsTrigger value={TransactionStatus.CONFIRMED} className="flex-1">
              Confirmed
            </TabsTrigger>
            <TabsTrigger value={TransactionStatus.FAILED} className="flex-1">
              Failed
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="pt-4">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              {activeTab === "all" ? "No transactions found" : `No ${activeTab} transactions found`}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.hash}
                  className="p-4 rounded-lg border border-[#2D3748] bg-[#0F172A] hover:bg-[#1A2234] transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="max-w-[70%]">
                      <h4 className="font-medium text-sm truncate">{tx.description}</h4>
                      <p className="text-xs text-gray-400">{formatDate(tx.timestamp)}</p>
                    </div>
                    {getStatusBadge(tx.status)}
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <div className="truncate">
                      <span>
                        Tx: {tx.hash.substring(0, 10)}...{tx.hash.substring(tx.hash.length - 4)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-white"
                      onClick={() => viewOnExplorer(tx.hash)}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Tabs>
    </Card>
  )
}

