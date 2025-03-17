"use client"

import { useState } from "react"
import { useWeb3 } from "@/lib/web3-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, ExternalLink, Award } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Certificates() {
  const { isConnected, address } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const [certificateMinted, setCertificateMinted] = useState(false)
  const [certificateId, setCertificateId] = useState<string | null>(null)

  const mintCertificate = async () => {
    if (!isConnected) return

    setIsLoading(true)

    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate a random certificate ID
    const id = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    setCertificateId(id)
    setCertificateMinted(true)

    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>NFT Certificates</CardTitle>
          <CardDescription>Receive verifiable proof of course completion as an NFT</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!certificateMinted ? (
            <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
              <GraduationCap className="h-16 w-16 text-primary mb-4" />

              <h3 className="text-xl font-bold mb-2">Claim Your Certificate</h3>

              <p className="text-center text-muted-foreground mb-6 max-w-md">
                If you've completed the course with a score of 70% or higher, you're eligible to claim an NFT
                certificate.
              </p>

              <Button
                onClick={mintCertificate}
                disabled={isLoading || !isConnected}
                className="flex items-center gap-2"
              >
                <Award className="h-4 w-4" />
                {isLoading ? "Minting..." : "Mint Certificate NFT"}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
              <div className="relative mb-6">
                <div className="w-64 h-64 border-8 border-primary/20 rounded-lg flex items-center justify-center bg-primary/5 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-4">
                      <GraduationCap className="h-16 w-16 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-1">Certificate of Completion</h3>
                      <p className="text-sm text-muted-foreground mb-2">GradXP Platform</p>
                      <div className="text-sm mb-2">awarded to</div>
                      <div className="font-mono text-xs mb-4">
                        {address?.substring(0, 8)}...{address?.substring(address.length - 6)}
                      </div>
                      <Badge className="mb-2">Intro to Web3</Badge>
                      <div className="text-xs text-muted-foreground mt-2">Certificate #{certificateId}</div>
                    </div>
                  </div>
                </div>
                <Badge className="absolute -top-2 -right-2 px-3 py-1">NFT</Badge>
              </div>

              <Alert className="mb-4">
                <Award className="h-4 w-4" />
                <AlertTitle>Certificate Minted Successfully!</AlertTitle>
                <AlertDescription>
                  Your NFT certificate has been minted with ID #{certificateId}. This certificate is stored on the
                  blockchain and can be verified by anyone.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View on Explorer
                </Button>

                <Button variant="outline" className="flex items-center gap-2">
                  Share Certificate
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Certificate Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="verification">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="verification">Verification</TabsTrigger>
              <TabsTrigger value="utility">Utility</TabsTrigger>
              <TabsTrigger value="showcase">Showcase</TabsTrigger>
            </TabsList>

            <TabsContent value="verification" className="space-y-4">
              <p className="text-muted-foreground">Your certificate is stored on the blockchain, making it:</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Tamper-Proof</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">
                      Once issued, the certificate cannot be altered or forged
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Verifiable</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">
                      Anyone can verify the authenticity of your certificate
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Permanent</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">
                      Your certificate will exist as long as the blockchain exists
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="utility" className="space-y-4">
              <p className="text-muted-foreground">Your certificate NFT provides additional utility:</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Access</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">Unlock advanced courses and exclusive content</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Community</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">Join communities of certificate holders</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Future Staking</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">
                      Stake your certificate for additional yield (coming soon)
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="showcase" className="space-y-4">
              <p className="text-muted-foreground">Ways to showcase your achievement:</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Social Media</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">
                      Share your certificate on Twitter, LinkedIn, and other platforms
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Digital Resume</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">
                      Add your certificate to your digital resume or portfolio
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">NFT Gallery</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">Display in NFT galleries and metaverse spaces</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

