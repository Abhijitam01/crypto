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
  addWallet: (privateKey: string) => Promise<boolean>
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
  addWallet: async () => false,
})

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState("0")
  const [provider, setProvider] = useState<any>(null)
  const [signer, setSigner] = useState<any>(null)
  const { toast } = useToast()

  const isConnected = !!address

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") return

    // Check if MetaMask is installed
    if (window.ethereum) {
      try {
        // Initialize provider
        const ethProvider = new ethers.BrowserProvider(window.ethereum)
        setProvider(ethProvider)

        // Check if already connected
        const checkConnection = async () => {
          try {
            // Safely check for accounts
            let accounts = []
            try {
              accounts = await window.ethereum.request({ method: "eth_accounts" })
            } catch (error) {
              console.error("Error requesting accounts:", error)
              return
            }

            if (accounts && accounts.length > 0) {
              try {
                const ethSigner = await ethProvider.getSigner()
                setSigner(ethSigner)
                setAddress(accounts[0])

                try {
                  const ethBalance = await ethProvider.getBalance(accounts[0])
                  setBalance(ethers.formatEther(ethBalance).substring(0, 6))
                } catch (error) {
                  console.error("Error getting balance:", error)
                  setBalance("0")
                }
              } catch (error) {
                console.error("Error getting signer:", error)
              }
            }
          } catch (error) {
            console.error("Error checking connection:", error)
          }
        }

        checkConnection()

        // Safely add event listeners
        const safeAddEventListener = (event: string, handler: (...args: any[]) => void) => {
          if (window.ethereum && typeof window.ethereum.on === "function") {
            window.ethereum.on(event, handler)
          }
        }

        // Handle account changes
        const handleAccountsChanged = (accounts: string[] | undefined) => {
          if (!accounts || accounts.length === 0) {
            // User disconnected
            setAddress(null)
            setSigner(null)
            setBalance("0")
          } else {
            // Account changed
            setAddress(accounts[0])
            const updateSigner = async () => {
              try {
                const ethSigner = await ethProvider.getSigner()
                setSigner(ethSigner)

                try {
                  const ethBalance = await ethProvider.getBalance(accounts[0])
                  setBalance(ethers.formatEther(ethBalance).substring(0, 6))
                } catch (error) {
                  console.error("Error getting balance after account change:", error)
                  setBalance("0")
                }
              } catch (error) {
                console.error("Error getting signer after account change:", error)
              }
            }
            updateSigner()
          }
        }

        // Handle chain changes
        const handleChainChanged = () => {
          window.location.reload()
        }

        safeAddEventListener("accountsChanged", handleAccountsChanged)
        safeAddEventListener("chainChanged", handleChainChanged)

        // Cleanup function
        return () => {
          if (window.ethereum && typeof window.ethereum.removeListener === "function") {
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
            window.ethereum.removeListener("chainChanged", handleChainChanged)
          }
        }
      } catch (error) {
        console.error("Error initializing wallet provider:", error)
      }
    }
  }, [])

  const connectWallet = async () => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") return

    if (!window.ethereum) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to connect your wallet",
        variant: "destructive",
      })
      return
    }

    try {
      let accounts = []
      try {
        accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      } catch (error) {
        console.error("Error requesting accounts:", error)
        throw error
      }

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts returned from wallet")
      }

      let ethProvider = provider
      if (!ethProvider) {
        ethProvider = new ethers.BrowserProvider(window.ethereum)
        setProvider(ethProvider)
      }

      try {
        const ethSigner = await ethProvider.getSigner()
        setSigner(ethSigner)
        setAddress(accounts[0])

        try {
          const ethBalance = await ethProvider.getBalance(accounts[0])
          setBalance(ethers.formatEther(ethBalance).substring(0, 6))
        } catch (error) {
          console.error("Error getting balance after connect:", error)
          setBalance("0")
        }

        toast({
          title: "Wallet connected",
          description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
        })
      } catch (error) {
        console.error("Error getting signer after connect:", error)
        throw error
      }
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
      if (address && provider) {
        try {
          const ethBalance = await provider.getBalance(address)
          setBalance(ethers.formatEther(ethBalance).substring(0, 6))
        } catch (error) {
          console.error("Error getting balance after transaction:", error)
        }
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

  // Add wallet using private key
  const addWallet = async (privateKey: string) => {
    try {
      if (!privateKey || privateKey.trim() === "") {
        throw new Error("Private key is required")
      }

      // Create a new wallet instance from the private key
      const wallet = new ethers.Wallet(privateKey)

      // If we don't have a provider yet, create one
      let ethProvider = provider
      if (!ethProvider) {
        // Use a public provider if MetaMask is not available
        try {
          ethProvider = new ethers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/demo")
          setProvider(ethProvider)
        } catch (error) {
          console.error("Error creating provider:", error)
          throw new Error("Failed to create provider")
        }
      }

      // Connect the wallet to the provider
      try {
        const connectedWallet = wallet.connect(ethProvider)

        // Set the wallet as the signer
        setSigner(connectedWallet)
        setAddress(wallet.address)

        // Get and set the balance
        try {
          const ethBalance = await ethProvider.getBalance(wallet.address)
          setBalance(ethers.formatEther(ethBalance).substring(0, 6))
        } catch (error) {
          console.error("Error getting balance for added wallet:", error)
          setBalance("0")
        }

        toast({
          title: "Wallet added",
          description: `Added wallet ${wallet.address.substring(0, 6)}...${wallet.address.substring(38)}`,
        })

        return true
      } catch (error) {
        console.error("Error connecting wallet to provider:", error)
        throw error
      }
    } catch (error: any) {
      console.error("Error adding wallet:", error)
      toast({
        title: "Failed to add wallet",
        description: error.message || "Invalid private key or network error",
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
        addWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext)

