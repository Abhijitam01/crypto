"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { verifyCertificate } from "@/lib/web3-service"
import { CheckCircle, XCircle, Search, Clock } from "lucide-react"

/**
 * CertificateVerifier Component
 *
 * This component allows users to verify the authenticity of a certificate
 * by entering its ID. It queries the blockchain to confirm if the certificate
 * is valid and displays the verification result.
 */
export function CertificateVerifier() {
  const [certificateId, setCertificateId] = useState("")
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async () => {
    if (!certificateId.trim()) {
      setError("Please enter a certificate ID")
      return
    }

    setIsVerifying(true)
    setError(null)

    try {
      const result = await verifyCertificate(certificateId)
      setVerificationResult(result)
    } catch (err) {
      setError("Failed to verify certificate. Please check your connection and try again.")
      setVerificationResult(null)
    } finally {
      setIsVerifying(false)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="bg-[#1E293B] border-[#2D3748] w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verify Certificate</CardTitle>
        <CardDescription className="text-gray-400">
          Enter a certificate ID to verify its authenticity on the blockchain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Input
            placeholder="Enter certificate ID"
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
            className="bg-[#0F172A] border-[#2D3748] text-white"
          />
          <Button onClick={handleVerify} disabled={isVerifying} className="bg-blue-600 hover:bg-blue-700">
            {isVerifying ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Verifying
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Verify
              </>
            )}
          </Button>
        </div>

        {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}

        {verificationResult && (
          <div className="mt-4 p-4 rounded-lg bg-[#0F172A] border border-[#2D3748]">
            <div className="flex items-center mb-4">
              {verificationResult.isValid ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-400 mr-2" />
                  <h3 className="text-lg font-medium text-green-400">Certificate Verified</h3>
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-400 mr-2" />
                  <h3 className="text-lg font-medium text-red-400">Invalid Certificate</h3>
                </>
              )}
            </div>

            {verificationResult.isValid && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Student:</span>
                  <span className="font-medium">{`${verificationResult.student.slice(0, 6)}...${verificationResult.student.slice(-4)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Course:</span>
                  <span className="font-medium">{verificationResult.courseId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Issued On:</span>
                  <span className="font-medium">{formatDate(verificationResult.timestamp)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center text-xs text-gray-400">
        All certificates are securely stored on the blockchain and cannot be altered
      </CardFooter>
    </Card>
  )
}

