"use client"

import { useState } from "react"
import { useWeb3 } from "@/lib/web3-service"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function ConnectWallet() {
  const { isConnected, isConnecting, connect, disconnect, address, chainId } = useWeb3()
  const [isDisconnecting, setIsDisconnecting] = useState(false)

  const handleConnect = async () => {
    try {
      await connect()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const handleDisconnect = async () => {
    try {
      setIsDisconnecting(true)
      await disconnect()
    } catch (error) {
      console.error("Failed to disconnect wallet:", error)
    } finally {
      setIsDisconnecting(false)
    }
  }

  if (isConnected) {
    return (
      <Button variant="outline" onClick={handleDisconnect} disabled={isDisconnecting}>
        {isDisconnecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Disconnecting...
          </>
        ) : (
          <>
            {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
          </>
        )}
      </Button>
    )
  }

  return (
    <Button onClick={handleConnect} disabled={isConnecting}>
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        "Connect Wallet"
      )}
    </Button>
  )
}

