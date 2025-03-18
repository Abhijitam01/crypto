"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ConnectWallet() {
  const { address, balance, isConnected, connectWallet, disconnectWallet } = useWallet()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await connectWallet()
    } finally {
      setIsConnecting(false)
    }
  }

  if (!isConnected) {
    return (
      <Button onClick={handleConnect} disabled={isConnecting} className="flex items-center gap-2">
        <Wallet className="h-4 w-4" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          <span className="hidden md:inline">
            {address?.substring(0, 6)}...{address?.substring(38)}
          </span>
          <span className="md:hidden">Wallet</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex flex-col items-start">
          <span className="text-xs text-muted-foreground">Address</span>
          <span className="font-mono text-sm">
            {address?.substring(0, 10)}...{address?.substring(34)}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex flex-col items-start">
          <span className="text-xs text-muted-foreground">Balance</span>
          <span>{balance} ETH</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnectWallet} className="text-destructive focus:text-destructive">
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

