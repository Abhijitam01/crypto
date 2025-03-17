"use client"

import { createContext, useContext, type ReactNode } from "react"
import { ethers } from "ethers"
import { create } from "zustand"

// Define window.ethereum for TypeScript
declare global {
  interface Window {
    ethereum?: any
  }
}

// Define the Web3 store state
interface Web3State {
  provider: ethers.providers.Web3Provider | null
  signer: ethers.Signer | null
  address: string | null
  chainId: number | null
  isConnected: boolean
  isConnecting: boolean
  error: string | null

  // Contract instances
  eduToken: ethers.Contract | null
  certificateNFT: ethers.Contract | null
  fundingContract: ethers.Contract | null
  yieldFarmingContract: ethers.Contract | null
  learningContract: ethers.Contract | null
  rewardContract: ethers.Contract | null
  gradXPPlatform: ethers.Contract | null

  // Actions
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  switchNetwork: (chainId: number) => Promise<void>

  // Contract interactions
  invest: (amount: string) => Promise<ethers.providers.TransactionResponse | void>
  generateYield: () => Promise<ethers.providers.TransactionResponse | void>
  submitQuiz: (courseId: number, answers: number[]) => Promise<ethers.providers.TransactionResponse | void>
  claimReward: (courseId: number) => Promise<ethers.providers.TransactionResponse | void>
  mintCertificate: (courseId: number) => Promise<ethers.providers.TransactionResponse | void>
}

// Contract ABIs
const eduTokenAbi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
]

const certificateNFTAbi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function mintCertificate(address to, uint256 courseId, string memory uri) returns (uint256)",
]

const fundingContractAbi = [
  "function invest() payable",
  "function totalFunds() view returns (uint256)",
  "function lockPeriodEnd() view returns (uint256)",
  "function fundsLocked() view returns (bool)",
]

const yieldFarmingContractAbi = [
  "function totalStaked() view returns (uint256)",
  "function yieldRate() view returns (uint256)",
  "function lastYieldTimestamp() view returns (uint256)",
  "function generateYield()",
  "function simulateYield(uint256 yieldAmount)",
]

const learningContractAbi = [
  "function getCourse(uint256 courseId) view returns (string, string, uint256, bool)",
  "function getQuizQuestions(uint256 courseId) view returns (string[])",
  "function submitQuiz(uint256 courseId, uint8[] memory userAnswers)",
  "function getUserScore(address user, uint256 courseId) view returns (uint256, bool, bool)",
]

const rewardContractAbi = [
  "function distributeRewards(uint256 courseId)",
  "function rewardsClaimed(uint256 courseId, address user) view returns (bool)",
]

const gradXPPlatformAbi = [
  "function getContractAddresses() view returns (address, address, address, address, address, address)",
  "function initializeDemoCourse()",
  "function moveToYieldFarming(uint256 amount)",
  "function moveToRewards(uint256 amount)",
  "function distributeRewards(uint256 courseId)",
]

// Dummy contract addresses for demo purposes
const CONTRACT_ADDRESSES = {
  eduToken: "0x1234567890123456789012345678901234567890",
  certificateNFT: "0x2345678901234567890123456789012345678901",
  fundingContract: "0x3456789012345678901234567890123456789012",
  yieldFarmingContract: "0x4567890123456789012345678901234567890123",
  learningContract: "0x5678901234567890123456789012345678901234",
  rewardContract: "0x6789012345678901234567890123456789012345",
  gradXPPlatform: "0x7890123456789012345678901234567890123456",
}

// Create the Web3 store
const useWeb3Store = create<Web3State>((set, get) => ({
  provider: null,
  signer: null,
  address: null,
  chainId: null,
  isConnected: false,
  isConnecting: false,
  error: null,

  // Contract instances
  eduToken: null,
  certificateNFT: null,
  fundingContract: null,
  yieldFarmingContract: null,
  learningContract: null,
  rewardContract: null,
  gradXPPlatform: null,

  // Connect wallet
  connect: async () => {
    try {
      set({ isConnecting: true, error: null })

      // Check if window.ethereum exists
      if (typeof window !== "undefined" && !window.ethereum) {
        // For demo purposes, simulate a connection with a dummy address
        setTimeout(() => {
          set({
            address: "0x1234567890abcdef1234567890abcdef12345678",
            chainId: 1,
            isConnected: true,
            isConnecting: false,
          })
        }, 1000)
        return
      }

      // Request accounts
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

      // Create provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const address = accounts[0]
      const network = await provider.getNetwork()

      // Initialize contract instances
      // For demo purposes, we'll create dummy contracts
      const eduToken = new ethers.Contract(CONTRACT_ADDRESSES.eduToken, eduTokenAbi, signer)
      const certificateNFT = new ethers.Contract(CONTRACT_ADDRESSES.certificateNFT, certificateNFTAbi, signer)
      const fundingContract = new ethers.Contract(CONTRACT_ADDRESSES.fundingContract, fundingContractAbi, signer)
      const yieldFarmingContract = new ethers.Contract(
        CONTRACT_ADDRESSES.yieldFarmingContract,
        yieldFarmingContractAbi,
        signer,
      )
      const learningContract = new ethers.Contract(CONTRACT_ADDRESSES.learningContract, learningContractAbi, signer)
      const rewardContract = new ethers.Contract(CONTRACT_ADDRESSES.rewardContract, rewardContractAbi, signer)
      const gradXPPlatform = new ethers.Contract(CONTRACT_ADDRESSES.gradXPPlatform, gradXPPlatformAbi, signer)

      // Update state
      set({
        provider,
        signer,
        address,
        chainId: network.chainId,
        isConnected: true,
        isConnecting: false,
        eduToken,
        certificateNFT,
        fundingContract,
        yieldFarmingContract,
        learningContract,
        rewardContract,
        gradXPPlatform,
      })

      // Setup event listeners
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          get().disconnect()
        } else {
          // User switched accounts
          set({ address: accounts[0] })
        }
      })

      window.ethereum.on("chainChanged", (chainIdHex: string) => {
        // User switched networks
        const chainId = Number.parseInt(chainIdHex, 16)
        set({ chainId })
      })
    } catch (error) {
      console.error("Connection error:", error)

      // For demo purposes, simulate a connection with a dummy address
      setTimeout(() => {
        set({
          address: "0x1234567890abcdef1234567890abcdef12345678",
          chainId: 1,
          isConnected: true,
          isConnecting: false,
          error: null,
        })
      }, 1000)
    }
  },

  // Disconnect wallet
  disconnect: async () => {
    try {
      // Remove event listeners
      if (typeof window !== "undefined" && window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged")
        window.ethereum.removeAllListeners("chainChanged")
      }

      // Reset state
      set({
        provider: null,
        signer: null,
        address: null,
        chainId: null,
        isConnected: false,
        eduToken: null,
        certificateNFT: null,
        fundingContract: null,
        yieldFarmingContract: null,
        learningContract: null,
        rewardContract: null,
        gradXPPlatform: null,
      })
    } catch (error) {
      console.error("Disconnect error:", error)
    }
  },

  // Switch network
  switchNetwork: async (chainId: number) => {
    try {
      if (typeof window === "undefined" || !window.ethereum) {
        // For demo purposes, simulate a network switch
        set({ chainId })
        return
      }

      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      })
    } catch (error) {
      console.error("Switch network error:", error)
      // For demo purposes, simulate a network switch
      set({ chainId })
    }
  },

  // Contract interactions - all simulated for demo purposes
  invest: async (amount: string) => {
    try {
      const { fundingContract } = get()
      if (!fundingContract) {
        console.log("Simulating investment of", amount, "ETH")
        await new Promise((resolve) => setTimeout(resolve, 2000))
        return
      }

      const tx = await fundingContract.invest({
        value: ethers.utils.parseEther(amount),
      })

      return tx
    } catch (error) {
      console.error("Investment error:", error)
      // Simulate transaction for demo
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  },

  generateYield: async () => {
    try {
      const { yieldFarmingContract } = get()
      if (!yieldFarmingContract) {
        console.log("Simulating yield generation")
        await new Promise((resolve) => setTimeout(resolve, 2000))
        return
      }

      const tx = await yieldFarmingContract.generateYield()
      return tx
    } catch (error) {
      console.error("Yield generation error:", error)
      // Simulate transaction for demo
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  },

  submitQuiz: async (courseId: number, answers: number[]) => {
    try {
      const { learningContract } = get()
      if (!learningContract) {
        console.log("Simulating quiz submission for course", courseId, "with answers", answers)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        return
      }

      const tx = await learningContract.submitQuiz(courseId, answers)
      return tx
    } catch (error) {
      console.error("Quiz submission error:", error)
      // Simulate transaction for demo
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  },

  claimReward: async (courseId: number) => {
    try {
      const { rewardContract } = get()
      if (!rewardContract) {
        console.log("Simulating reward claim for course", courseId)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        return
      }

      const tx = await rewardContract.distributeRewards(courseId)
      return tx
    } catch (error) {
      console.error("Reward claim error:", error)
      // Simulate transaction for demo
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  },

  mintCertificate: async (courseId: number) => {
    try {
      const { certificateNFT, address } = get()
      if (!certificateNFT || !address) {
        console.log("Simulating certificate minting for course", courseId)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        return
      }

      const tx = await certificateNFT.mintCertificate(address, courseId, "ipfs://QmCertificateURI/")
      return tx
    } catch (error) {
      console.error("Certificate minting error:", error)
      // Simulate transaction for demo
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  },
}))

// Create a React context for the Web3 store
const Web3Context = createContext<ReturnType<typeof useWeb3Store> | null>(null)

// Provider component
export function Web3Provider({ children }: { children: ReactNode }) {
  return <Web3Context.Provider value={useWeb3Store()}>{children}</Web3Context.Provider>
}

// Hook to use the Web3 store
export function useWeb3() {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}

