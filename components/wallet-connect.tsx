"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useWeb3 } from "@/lib/web3-service"
import { Wallet, ExternalLink, Copy, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"

/**
 * WalletConnect Component
 *
 * This component provides a button to connect to a Web3 wallet (e.g., MetaMask)
 * and displays the connected wallet address and token balance.
 */
export function WalletConnect() {
  const { connect, disconnect, isConnected, isConnecting, address, tokenBalance, error } = useWeb3()

  const [copied, setCopied] = useState(false)

  // Handle connection errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Connection Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error])

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Copy address to clipboard
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // View on block explorer
  const viewOnExplorer = () => {
    if (address) {
      // This would be configurable based on the network
      window.open(`https://etherscan.io/address/${address}`, "_blank")
    }
  }

  if (!isConnected) {
    return (
      <Button
        onClick={connect}
        disabled={isConnecting}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        <Wallet className="mr-2 h-4 w-4" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-[#2D3748] hover:bg-[#2D3748]">
          <Wallet className="mr-2 h-4 w-4 text-blue-400" />
          <span className="hidden md:inline mr-2">{formatAddress(address!)}</span>
          <span className="font-bold text-yellow-400">{Number.parseFloat(tokenBalance).toFixed(2)} LEARN</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[#1E293B] border-[#2D3748] text-white">
        <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#2D3748]" />
        <DropdownMenuItem className="flex justify-between cursor-pointer hover:bg-[#2D3748]" onClick={copyAddress}>
          <span>Copy Address</span>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem className="flex justify-between cursor-pointer hover:bg-[#2D3748]" onClick={viewOnExplorer}>
          <span>View on Explorer</span>
          <ExternalLink className="h-4 w-4" />
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#2D3748]" />
        <DropdownMenuItem className="cursor-pointer hover:bg-[#2D3748] text-red-400" onClick={disconnect}>
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

