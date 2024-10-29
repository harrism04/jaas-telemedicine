"use client"

import { usePathname } from 'next/navigation'
import { ClinicSidebar } from "@/components/clinic-sidebar"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  
  // Check if current page is video conference
  const isVideoConference = pathname.includes('video-conference')
  
  // Get the role from URL params if it's video conference page
  const isPatientView = isVideoConference && new URLSearchParams(window.location.search).get('role') === 'patient'

  // Don't show sidebar for patient view
  if (isPatientView) {
    return <main>{children}</main>
  }

  return (
    <div className="flex min-h-screen">
      <ClinicSidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
