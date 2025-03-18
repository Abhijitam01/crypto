"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Download, Share2, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useWallet } from "@/hooks/use-wallet"

const certificates = [
  {
    id: "CERT-BF-001",
    title: "Blockchain Fundamentals",
    issueDate: "March 15, 2025",
    score: 95,
    image: "/placeholder.svg?height=400&width=600",
  },
]

export default function Certificates() {
  const { isConnected } = useWallet()
  const [selectedCertificate, setSelectedCertificate] = useState(null)

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Certificates</h2>

      {!isConnected && (
        <Alert className="bg-amber-50 border-amber-200 text-amber-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wallet not connected</AlertTitle>
          <AlertDescription>Connect your wallet to view and manage your certificates.</AlertDescription>
        </Alert>
      )}

      {certificates.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Certificates Yet</CardTitle>
            <CardDescription>Complete courses with a score of 70% or higher to earn certificates.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Award className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground">
              Your certificates will appear here once you've earned them.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <Card key={cert.id} className="overflow-hidden">
              <div className="relative">
                <img src={cert.image || "/placeholder.svg"} alt={cert.title} className="w-full h-48 object-cover" />
                <div className="absolute top-2 right-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                        <Award className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Certificate of Completion</DialogTitle>
                        <DialogDescription>
                          This certifies that you have successfully completed the course.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="p-4 border rounded-lg bg-muted/40">
                        <div className="relative border-8 border-primary/10 p-8 text-center">
                          <div className="absolute -top-4 -left-4 h-8 w-8 border-t-4 border-l-4 border-primary"></div>
                          <div className="absolute -top-4 -right-4 h-8 w-8 border-t-4 border-r-4 border-primary"></div>
                          <div className="absolute -bottom-4 -left-4 h-8 w-8 border-b-4 border-l-4 border-primary"></div>
                          <div className="absolute -bottom-4 -right-4 h-8 w-8 border-b-4 border-r-4 border-primary"></div>

                          <div className="mb-6">
                            <Award className="h-16 w-16 mx-auto text-primary mb-2" />
                            <h2 className="text-2xl font-bold uppercase tracking-wider">Certificate of Achievement</h2>
                          </div>

                          <p className="text-lg mb-2">This certifies that</p>
                          <p className="text-xl font-bold mb-4">John Doe</p>
                          <p className="text-lg mb-2">has successfully completed</p>
                          <p className="text-xl font-bold mb-4">{cert.title}</p>
                          <p className="text-lg mb-6">with a score of {cert.score}%</p>

                          <div className="flex justify-between items-center mt-8">
                            <div className="text-left">
                              <p className="font-medium">Certificate ID:</p>
                              <p className="text-sm">{cert.id}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">Issue Date:</p>
                              <p className="text-sm">{cert.issueDate}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <CardHeader>
                <CardTitle>{cert.title}</CardTitle>
                <CardDescription>Issued on {cert.issueDate}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Certificate ID</p>
                    <p className="font-medium">{cert.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Score</p>
                    <p className="font-medium">{cert.score}%</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

