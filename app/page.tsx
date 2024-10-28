"use client"

import { ClinicDashboardComponent } from "@/components/clinic-dashboard"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen">
      <ClinicDashboardComponent />
    </div>
  )
}
