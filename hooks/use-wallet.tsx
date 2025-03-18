"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { ethers } from "ethers"
import { useToast } from "@/components/ui/use-toast"

interface WalletContextType {
  address: string | null
  balance: string
  isConnected: boolean
  provider: any
  signer: any
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  sendTransaction: (to: string, amount: string) => Promise<boolean>
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  balance: "0",
  isConnected: false,
  provider: null,
  signer: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  sendTransaction: async () => false,
})

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState("0")
  const [provider, setProvider] = useState<any>(null)
  const [signer, setSigner] = useState<any>(null)
  const { toast } = useToast()

  const isConnected = !!address

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window !== "undefined" && window.ethereum) {
      // Initialize provider
      const ethProvider = new ethers.BrowserProvider(window.ethereum)
      setProvider(ethProvider)

      // Check if already connected
      const checkConnection = async () => {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            const ethSigner = await ethProvider.getSigner()
            setSigner(ethSigner)
            setAddress(accounts[0])
            const ethBalance = await ethProvider.getBalance(accounts[0])
            setBalance(ethers.formatEther(ethBalance).substring(0, 6))
          }
        } catch (error) {
          console.error("Error checking connection:", error)
        }
      }

      checkConnection()

      // Listen for account changes
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          setAddress(null)
          setSigner(null)
          setBalance("0")
        } else {
          // Account changed
          setAddress(accounts[0])
          const updateSigner = async () => {
            const ethSigner = await ethProvider.getSigner()
            setSigner(ethSigner)
            const ethBalance = await ethProvider.getBalance(accounts[0])
            setBalance(ethers.formatEther(ethBalance).substring(0, 6))
          }
          updateSigner()
        }
      })

      // Listen for chain changes
      window.ethereum.on("chainChanged", () => {
        window.location.reload()
      })
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged")
        window.ethereum.removeAllListeners("chainChanged")
      }
    }
  }, [])

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to connect your wallet",
        variant: "destructive",
      })
      return
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      const ethSigner = await provider.getSigner()
      setSigner(ethSigner)
      setAddress(accounts[0])
      const ethBalance = await provider.getBalance(accounts[0])
      setBalance(ethers.formatEther(ethBalance).substring(0, 6))

      toast({
        title: "Wallet connected",
        description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
      })
    } catch (error: any) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      })
    }
  }

  const disconnectWallet = () => {
    setAddress(null)
    setSigner(null)
    setBalance("0")
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  const sendTransaction = async (to: string, amount: string) => {
    if (!signer) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return false
    }

    try {
      const tx = await signer.sendTransaction({
        to,
        value: ethers.parseEther(amount),
      })

      toast({
        title: "Transaction sent",
        description: `Transaction hash: ${tx.hash.substring(0, 10)}...`,
      })

      await tx.wait()

      // Update balance after transaction
      if (address) {
        const ethBalance = await provider.getBalance(address)
        setBalance(ethers.formatEther(ethBalance).substring(0, 6))
      }

      return true
    } catch (error: any) {
      console.error("Transaction error:", error)
      toast({
        title: "Transaction failed",
        description: error.message || "Failed to send transaction",
        variant: "destructive",
      })
      return false
    }
  }

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        isConnected,
        provider,
        signer,
        connectWallet,
        disconnectWallet,
        sendTransaction,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext)

