import { getCertificates } from "@/lib/certificate-service"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { Download, Share2, ExternalLink } from "lucide-react"

export default async function CertificatesPage() {
  const certificates = await getCertificates()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Certificates</h1>
        <Button variant="outline" className="border-[#2D3748] hover:bg-[#1E293B]">
          Verify a Certificate
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-[#1E293B] border border-[#2D3748]">
          <TabsTrigger value="all" className="data-[state=active]:bg-[#2D3748]">
            All Certificates
          </TabsTrigger>
          <TabsTrigger value="blockchain" className="data-[state=active]:bg-[#2D3748]">
            Blockchain
          </TabsTrigger>
          <TabsTrigger value="development" className="data-[state=active]:bg-[#2D3748]">
            Development
          </TabsTrigger>
          <TabsTrigger value="defi" className="data-[state=active]:bg-[#2D3748]">
            DeFi
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          {certificates.length === 0 ? (
            <div className="text-center py-12 bg-[#1E293B] rounded-lg border border-[#2D3748]">
              <h3 className="text-lg font-medium mb-2">No Certificates Yet</h3>
              <p className="text-gray-400 mb-6">
                Complete courses to earn NFT certificates that verify your skills on the blockchain.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">Explore Courses</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((certificate) => (
                <Card key={certificate.id} className="bg-[#1E293B] border-[#2D3748] overflow-hidden">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={certificate.imageUrl || "/placeholder.svg"}
                      alt={`Certificate for ${certificate.courseTitle}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{certificate.courseTitle}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-400">
                    <p>Issued on {new Date(certificate.issueDate).toLocaleDateString()}</p>
                    <p className="mt-1">Token ID: {certificate.tokenId}</p>
                  </CardContent>
                  <CardFooter className="flex gap-2 border-t border-[#2D3748] pt-4">
                    <Button variant="outline" size="sm" className="flex-1 border-[#2D3748] hover:bg-[#2D3748]">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 border-[#2D3748] hover:bg-[#2D3748]">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 border-[#2D3748] hover:bg-[#2D3748]">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="blockchain" className="mt-6">
          <div className="text-center py-12 bg-[#1E293B] rounded-lg border border-[#2D3748]">
            <h3 className="text-lg font-medium mb-2">No Blockchain Certificates</h3>
            <p className="text-gray-400 mb-6">You haven't earned any certificates in this category yet.</p>
            <Button className="bg-blue-600 hover:bg-blue-700">Explore Blockchain Courses</Button>
          </div>
        </TabsContent>
        <TabsContent value="development" className="mt-6">
          <div className="text-center py-12 bg-[#1E293B] rounded-lg border border-[#2D3748]">
            <h3 className="text-lg font-medium mb-2">No Development Certificates</h3>
            <p className="text-gray-400 mb-6">You haven't earned any certificates in this category yet.</p>
            <Button className="bg-blue-600 hover:bg-blue-700">Explore Development Courses</Button>
          </div>
        </TabsContent>
        <TabsContent value="defi" className="mt-6">
          <div className="text-center py-12 bg-[#1E293B] rounded-lg border border-[#2D3748]">
            <h3 className="text-lg font-medium mb-2">No DeFi Certificates</h3>
            <p className="text-gray-400 mb-6">You haven't earned any certificates in this category yet.</p>
            <Button className="bg-blue-600 hover:bg-blue-700">Explore DeFi Courses</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

