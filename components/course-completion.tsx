/**
 * Course Completion Component
 *
 * This component handles the course completion process and certificate claiming.
 * Features:
 * - Progress tracking
 * - Completion requirements display
 * - Certificate claiming button
 * - NFT minting process
 * - Success celebration
 *
 * The component interacts with smart contracts to mint the NFT certificate
 * when a student completes all course requirements.
 */

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { useWeb3 } from "@/context/web3-context"
import { getCourseProgress, markCourseComplete } from "@/lib/progress-service"
import { mintCertificate } from "@/lib/certificate-service"
import confetti from "canvas-confetti"

interface CourseCompletionProps {
  courseId: string
  courseTitle: string
}

export default function CourseCompletion({ courseId, courseTitle }: CourseCompletionProps) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [certificateId, setCertificateId] = useState<string | null>(null)
  const { address } = useWeb3()
  const { toast } = useToast()

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const { percentComplete, completed } = await getCourseProgress(courseId)
        setProgress(percentComplete)
        setIsComplete(completed)
      } catch (error) {
        console.error("Failed to load course progress:", error)
      }
    }

    if (address) {
      loadProgress()
    }
  }, [courseId, address])

  const handleClaimCertificate = async () => {
    if (!address) return

    setIsClaiming(true)

    try {
      // Mark the course as complete if not already
      if (!isComplete) {
        await markCourseComplete(courseId)
        setIsComplete(true)
      }

      // Mint the NFT certificate
      const { certificateId: newCertificateId } = await mintCertificate(courseId, courseTitle)
      setCertificateId(newCertificateId)

      // Show success message
      toast({
        title: "Certificate Claimed!",
        description: "Your NFT certificate has been minted and added to your wallet.",
      })

      // Trigger confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    } catch (error) {
      console.error("Failed to claim certificate:", error)
      toast({
        title: "Certificate Claim Failed",
        description: "There was an error minting your certificate. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsClaiming(false)
    }
  }

  if (!address) {
    return null
  }

  return (
    <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Your Progress</h2>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">{progress}% Complete</span>
          {isComplete && <span className="text-sm font-medium text-green-600">Course Completed</span>}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {certificateId ? (
        <div className="text-center">
          <div className="mb-6 relative mx-auto w-64 h-48 border-8 border-gray-800 rounded-md overflow-hidden">
            <Image src="/certificate-preview.jpg" alt="Certificate Preview" fill className="object-cover" />
          </div>
          <h3 className="text-lg font-bold mb-2">Certificate Claimed!</h3>
          <p className="text-gray-500 mb-4">Your NFT certificate has been minted and added to your wallet.</p>
          <Button asChild>
            <Link href="/certificates">View My Certificates</Link>
          </Button>
        </div>
      ) : (
        <>
          {progress >= 100 ? (
            <div className="text-center">
              <h3 className="text-lg font-bold mb-2">Congratulations!</h3>
              <p className="text-gray-500 mb-6">
                You've completed all the course requirements. Claim your NFT certificate now!
              </p>
              <Button onClick={handleClaimCertificate} disabled={isClaiming} className="w-full">
                {isClaiming ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                    Minting Certificate...
                  </span>
                ) : (
                  "Claim NFT Certificate"
                )}
              </Button>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-bold mb-2">Requirements to Complete</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${progress >= 100 ? "bg-green-500" : "bg-gray-200"}`}
                  >
                    {progress >= 100 && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span>Complete all lessons and modules</span>
                </li>
                <li className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${progress >= 80 ? "bg-green-500" : "bg-gray-200"}`}
                  >
                    {progress >= 80 && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span>Pass all quizzes with at least 80% score</span>
                </li>
                <li className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center ${progress >= 50 ? "bg-green-500" : "bg-gray-200"}`}
                  >
                    {progress >= 50 && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span>Complete the final project (if applicable)</span>
                </li>
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  )
}

