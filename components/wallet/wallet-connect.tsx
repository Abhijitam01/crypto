"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useWeb3, NETWORKS } from "@/lib/web3-service"
import { Wallet, ExternalLink, Copy, Check, ChevronDown, LogOut, History, RefreshCw, AlertTriangle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

// Dummy CONTRACT_ADDRESSES object for demonstration purposes.
// In a real application, these addresses would be fetched from a config file or environment variables.
const CONTRACT_ADDRESSES = {
  LearnToken: {
    [1]: "0x...", // Mainnet address
    [5]: "0x...", // Goerli address
    [11155111]: "0x...", // Sepolia address
  },
}

/**
 * WalletConnect Component
 *
 * This component provides a comprehensive interface for connecting to a Web3 wallet,
 * displaying wallet information, switching networks, and managing transactions.
 */
export function WalletConnect() {
  const {
    connect,
    disconnect,
    switchNetwork,
    refreshBalances,
    isConnected,
    isConnecting,
    address,
    chainId,
    network,
    tokenBalance,
    nativeBalance,
    error,
  } = useWeb3()

  const [copied, setCopied] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

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

      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  // View on block explorer
  const viewOnExplorer = () => {
    if (address && chainId) {
      const explorerUrl = NETWORKS[chainId]?.blockExplorer || "https://etherscan.io"
      window.open(`${explorerUrl}/address/${address}`, "_blank")
    }
  }

  // Handle network switch
  const handleNetworkSwitch = async (newChainId: number) => {
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
    }
  }

  // Handle balance refresh
  const handleRefreshBalance = async () => {
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

  // Handle wallet connection
  const handleConnect = async () => {
    try {
      await connect()
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
      })
    }
  }

  // Handle wallet disconnection
  const handleDisconnect = () => {
    disconnect()
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  // View transaction history
  const viewTransactionHistory = () => {
    // In a real app, this would navigate to a transaction history page
    toast({
      title: "Transaction History",
      description: "Coming soon!",
    })
  }

  // Wrong network warning
  const isWrongNetwork = chainId && !CONTRACT_ADDRESSES.LearnToken?.[chainId]

  if (!isConnected) {
    return (
      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        <Wallet className="mr-2 h-4 w-4" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {isWrongNetwork && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="destructive" className="flex items-center gap-1 cursor-help">
                <AlertTriangle className="h-3 w-3" />
                <span className="hidden sm:inline">Wrong Network</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Please switch to a supported network</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="border-[#2D3748] hover:bg-[#2D3748]">
            <Wallet className="mr-2 h-4 w-4 text-blue-400" />
            <span className="hidden md:inline mr-2">{formatAddress(address!)}</span>
            <span className="font-bold text-yellow-400">{Number.parseFloat(tokenBalance).toFixed(2)} LEARN</span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 bg-[#1E293B] border-[#2D3748] text-white">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <div className="flex justify-between items-center">
                <span>My Wallet</span>
                <Badge variant="outline" className="text-xs">
                  {network}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>{formatAddress(address!)}</span>
                <button onClick={copyAddress} className="hover:text-white transition-colors">
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-[#2D3748]" />

          <div className="px-2 py-1.5 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">LEARN Balance:</span>
              <div className="flex items-center">
                <span className="font-bold text-yellow-400">{Number.parseFloat(tokenBalance).toFixed(2)}</span>
                <button
                  onClick={handleRefreshBalance}
                  disabled={isRefreshing}
                  className="ml-1 text-gray-400 hover:text-white transition-colors"
                >
                  <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">ETH Balance:</span>
              <span className="font-medium">{Number.parseFloat(nativeBalance).toFixed(4)} ETH</span>
            </div>
          </div>

          <DropdownMenuSeparator className="bg-[#2D3748]" />

          <DropdownMenuGroup>
            <DropdownMenuItem
              className="flex justify-between cursor-pointer hover:bg-[#2D3748]"
              onClick={viewOnExplorer}
            >
              <span>View on Explorer</span>
              <ExternalLink className="h-4 w-4" />
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex justify-between cursor-pointer hover:bg-[#2D3748]"
              onClick={viewTransactionHistory}
            >
              <span>Transaction History</span>
              <History className="h-4 w-4" />
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="hover:bg-[#2D3748]">
                <span>Switch Network</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-[#1E293B] border-[#2D3748] text-white">
                  {Object.entries(NETWORKS).map(([id, network]) => (
                    <DropdownMenuItem
                      key={id}
                      className="cursor-pointer hover:bg-[#2D3748]"
                      onClick={() => handleNetworkSwitch(Number.parseInt(id))}
                    >
                      <span>{network.name}</span>
                      {chainId === Number.parseInt(id) && <Check className="ml-2 h-4 w-4" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="bg-[#2D3748]" />

          <DropdownMenuItem className="cursor-pointer hover:bg-[#2D3748] text-red-400" onClick={handleDisconnect}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

