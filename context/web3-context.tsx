/**
 * Web3 Context Provider
 *
 * This context provides wallet connection and blockchain interaction capabilities.
 * Features:
 * - Wallet connection/disconnection
 * - Account information (address, balance)
 * - Network detection and switching
 * - Transaction handling
 * - Smart contract interaction utilities
 *
 * The context uses ethers.js to interact with Ethereum and other EVM-compatible
 * blockchains, providing a consistent interface for all blockchain operations.
 */

"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { ethers } from "ethers"
import { useToast } from "@/components/ui/use-toast"

interface Web3ContextType {
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  address: string | null
  chainId: number | null
  balance: string | null
  isConnecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
  switchNetwork: (chainId: number) => Promise<void>
  getContract: (address: string, abi: any) => ethers.Contract | null
}

const Web3Context = createContext<Web3ContextType>({
  provider: null,
  signer: null,
  address: null,
  chainId: null,
  balance: null,
  isConnecting: false,
  connect: async () => {},
  disconnect: () => {},
  switchNetwork: async () => {},
  getContract: () => null,
})

export function Web3Provider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  // Initialize provider from window.ethereum if available
  useEffect(() => {
    const initProvider = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum)
          setProvider(provider)

          // Check if already connected
          const accounts = await provider.listAccounts()
          if (accounts.length > 0) {
            const signer = await provider.getSigner()
            const address = await signer.getAddress()
            const network = await provider.getNetwork()
            const balance = await provider.getBalance(address)

            setSigner(signer)
            setAddress(address)
            setChainId(Number(network.chainId))
            setBalance(ethers.formatEther(balance))
          }
        } catch (error) {
          console.error("Failed to initialize provider:", error)
        }
      }
    }

    initProvider()
  }, [])

  // Set up event listeners for account and chain changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          setSigner(null)
          setAddress(null)
          setBalance(null)
        } else if (provider) {
          // Account changed
          const signer = await provider.getSigner()
          const address = await signer.getAddress()
          const balance = await provider.getBalance(address)

          setSigner(signer)
          setAddress(address)
          setBalance(ethers.formatEther(balance))
        }
      }

      const handleChainChanged = (chainIdHex: string) => {
        const newChainId = Number.parseInt(chainIdHex, 16)
        setChainId(newChainId)

        // Reload the page to ensure all data is fresh for the new chain
        window.location.reload()
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [provider])

  // Connect wallet function
  const connect = async () => {
    if (!provider) {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask or another Ethereum wallet.",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" })

      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const network = await provider.getNetwork()
      const balance = await provider.getBalance(address)

      setSigner(signer)
      setAddress(address)
      setChainId(Number(network.chainId))
      setBalance(ethers.formatEther(balance))

      toast({
        title: "Wallet Connected",
        description: `Connected to ${address.substring(0, 6)}...${address.substring(38)}`,
      })
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect to your wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect wallet function
  const disconnect = () => {
    setSigner(null)
    setAddress(null)
    setBalance(null)

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    })
  }

  // Switch network function
  const switchNetwork = async (targetChainId: number) => {
    if (!provider) return

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      })
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (error.code === 4902) {
        // Add the network
        // This would need network-specific parameters
        toast({
          title: "Network Not Found",
          description: "This network needs to be added to your wallet first.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Network Switch Failed",
          description: "Failed to switch networks. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  // Get contract instance
  const getContract = (contractAddress: string, abi: any) => {
    if (!signer) return null
    return new ethers.Contract(contractAddress, abi, signer)
  }

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        address,
        chainId,
        balance,
        isConnecting,
        connect,
        disconnect,
        switchNetwork,
        getContract,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export const useWeb3 = () => useContext(Web3Context)

