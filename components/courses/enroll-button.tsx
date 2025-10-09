"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface EnrollButtonProps {
  courseId: string
}

export default function EnrollButton({ courseId }: EnrollButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleEnroll = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to enroll:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button size="lg" onClick={handleEnroll} disabled={loading}>
      {loading ? "Enrolling..." : "Enroll Now"}
    </Button>
  )
}
