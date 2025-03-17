/**
 * Certificate Gallery Component
 *
 * This component displays a gallery of earned certificates.
 * Features:
 * - Visual certificate cards
 * - Certificate details
 * - Sharing options
 * - Verification links
 *
 * The component showcases the student's achievements and allows
 * them to share their credentials with others.
 */

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Share2, ExternalLink } from "lucide-react"
import type { Certificate } from "@/types/certificate"

interface CertificateGalleryProps {
  certificates: Certificate[]
}

export default function CertificateGallery({ certificates }: CertificateGalleryProps) {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (certificates.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium mb-2">No certificates yet</h3>
        <p className="text-gray-500 mb-6">
          Complete courses to earn NFT certificates that verify your skills on the blockchain.
        </p>
        <Button asChild>
          <Link href="/dashboard/courses">Continue Learning</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {certificates.map((certificate) => (
        <Card key={certificate.id} className="overflow-hidden">
          <div className="relative aspect-[4/3] bg-gray-100 border-b">
            <Image
              src={certificate.imageUrl || "/placeholder.svg"}
              alt={`Certificate for ${certificate.courseTitle}`}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="font-bold mb-1">{certificate.courseTitle}</h3>
            <p className="text-sm text-gray-500 mb-4">Issued on {formatDate(certificate.issueDate)}</p>

            <div className="flex space-x-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href={`/certificates/${certificate.id}`}>
                  <ExternalLink size={14} className="mr-1" />
                  View
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Share2 size={14} className="mr-1" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

