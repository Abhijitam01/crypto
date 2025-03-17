"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useWeb3 } from "@/context/web3-context"
import { enrollInCourse } from "@/lib/enrollment-service"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CourseEnrollButtonProps {
  courseId: string
  price: number
}

export default function CourseEnrollButton({ courseId, price }: CourseEnrollButtonProps) {
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const { address, connect, isConnecting } = useWeb3()
  const { toast } = useToast()
  const router = useRouter()

  const handleEnroll = async () => {
    if (price > 0 && !address) {
      // If course is paid and user is not connected, show wallet connection dialog
      setShowDialog(true)
      return
    }

    setIsEnrolling(true)

    try {
      await enrollInCourse(courseId, price)

      toast({
        title: "Enrollment Successful",
        description: "You have successfully enrolled in this course.",
      })

      // Redirect to the course learning page
      router.push(`/courses/${courseId}/learn`)
    } catch (error) {
      console.error("Enrollment failed:", error)
      toast({
        title: "Enrollment Failed",
        description: "There was an error processing your enrollment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsEnrolling(false)
    }
  }

  const handleConnectWallet = async () => {
    try {
      await connect()
      setShowDialog(false)
      // After connecting wallet, proceed with enrollment
      handleEnroll()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect your wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Button
        onClick={handleEnroll}
        disabled={isEnrolling || (price > 0 && isConnecting)}
        className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700"
      >
        {isEnrolling ? (
          <span className="flex items-center">
            <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-current rounded-full"></span>
            {price === 0 ? "Enrolling..." : "Processing Payment..."}
          </span>
        ) : (
          <span>{price === 0 ? "Enroll for Free" : "Enroll Now"}</span>
        )}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle>Connect Your Wallet</DialogTitle>
            <DialogDescription className="text-gray-400">
              You need to connect your wallet to enroll in this paid course.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 mb-4">
              <h4 className="font-medium mb-2">Course Details</h4>
              <p className="text-sm text-gray-400">Price: {price} ETH</p>
            </div>
            <div className="space-y-4">
              <div
                className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex items-center cursor-pointer hover:border-blue-500"
                onClick={handleConnectWallet}
              >
                <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">MetaMask</p>
                  <p className="text-sm text-gray-400">Connect using browser wallet</p>
                </div>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex items-center cursor-pointer hover:border-blue-500">
                <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">WalletConnect</p>
                  <p className="text-sm text-gray-400">Connect using mobile wallet</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="border-gray-700 hover:bg-gray-700"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

