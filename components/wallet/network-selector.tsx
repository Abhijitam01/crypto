"use client"

import { useState } from "react"
import { useWeb3, NETWORKS } from "@/lib/web3-service"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown, Globe } from "lucide-react"
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
 * NetworkSelector Component
 *
 * This component provides a dropdown menu for selecting and switching
 * between different blockchain networks.
 */
export function NetworkSelector() {
  const { chainId, network, switchNetwork, isConnected } = useWeb3()
  const [isSwitching, setIsSwitching] = useState(false)

  // Handle network switch
  const handleNetworkSwitch = async (newChainId: number) => {
    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    if (chainId === newChainId) return

    setIsSwitching(true)

    try {
      const success = await switchNetwork(newChainId)
      if (success) {
        toast({
          title: "Network Switched",
          description: `Connected to ${NETWORKS[newChainId]?.name}`,
        })
      }
    } catch (error) {
      toast({
        title: "Network Switch Failed",
        description: error instanceof Error ? error.message : "Failed to switch network",
        variant: "destructive",
      })
    } finally {
      setIsSwitching(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-[#2D3748] hover:bg-[#2D3748]"
          disabled={!isConnected || isSwitching}
        >
          <Globe className="mr-2 h-4 w-4" />
          {isSwitching ? "Switching..." : network || "Select Network"}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[#1E293B] border-[#2D3748] text-white">
        <DropdownMenuLabel>Select Network</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#2D3748]" />
        {Object.entries(NETWORKS).map(([id, network]) => (
          <DropdownMenuItem
            key={id}
            className="flex justify-between cursor-pointer hover:bg-[#2D3748]"
            onClick={() => handleNetworkSwitch(Number.parseInt(id))}
          >
            <span>{network.name}</span>
            {chainId === Number.parseInt(id) && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

