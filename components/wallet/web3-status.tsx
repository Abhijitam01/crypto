"use client"

import { useEffect, useState } from "react"
import { useWeb3 } from "@/lib/web3-service"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertTriangle, CheckCircle, Wifi, WifiOff } from "lucide-react"
import { CONTRACT_ADDRESSES } from "@/lib/constants"

/**
 * Web3Status Component
 *
 * This component displays the current status of the Web3 connection,
 * including connection status, network, and any potential issues.
 */
export function Web3Status() {
  const { isConnected, chainId, network } = useWeb3()
  const [isOnline, setIsOnline] = useState(true)

  // Check if we're on a supported network
  const isWrongNetwork = chainId && !CONTRACT_ADDRESSES.LearnToken

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!isOnline) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="destructive" className="flex items-center gap-1">
              <WifiOff className="h-3 w-3" />
              <span>Offline</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>You are currently offline. Please check your internet connection.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  if (!isConnected) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              className="flex items-center gap-1 bg-gray-500/10 text-gray-400 border-gray-500/20"
            >
              <Wifi className="h-3 w-3" />
              <span>Not Connected</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Connect your wallet to interact with the blockchain</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  if (isWrongNetwork) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              <span>Wrong Network</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Please switch to a supported network</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-green-500/10 text-green-500 border-green-500/20"
          >
            <CheckCircle className="h-3 w-3" />
            <span>{network}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Connected to {network}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

