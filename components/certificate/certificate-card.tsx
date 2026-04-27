"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Download, Eye } from "lucide-react"
import Link from "next/link"
import { trpc } from "@/lib/trpc/client"

interface CertificateCardProps {
  certificate: {
    id: string
    certificateNumber: string
    issuedAt: Date | string
    course: {
      title: string
      slug: string
    }
  }
}

export default function CertificateCard({ certificate }: CertificateCardProps) {
  const [downloading, setDownloading] = useState(false)
  const downloadMutation = trpc.certificates.download.useMutation()

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const { pdfBase64, filename } = await downloadMutation.mutateAsync({ id: certificate.id })
      
      const byteCharacters = atob(pdfBase64)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: "application/pdf" })

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Failed to download certificate:", error)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Award className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-lg">{certificate.course.title}</CardTitle>
        <CardDescription>
          Issued on{" "}
          {new Date(certificate.issuedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Certificate #: <span className="font-mono">{certificate.certificateNumber}</span>
        </p>
        <div className="flex gap-2 pt-2">
          <Link href={`/courses/${certificate.course.slug}/certificate`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          </Link>
          <Button size="sm" className="flex-1" onClick={handleDownload} disabled={downloading}>
            <Download className="h-4 w-4 mr-2" />
            {downloading ? "..." : "Download"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
