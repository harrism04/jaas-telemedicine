"use client"

import { ClinicSidebar } from "@/components/clinic-sidebar"
import { usePathname, useSearchParams } from "next/navigation"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const isPatientView = pathname.includes('video-conference') && 
    searchParams.get('role') === 'patient'

  return (
    <div className="flex">
      {!isPatientView && <ClinicSidebar />}
      <main className={`flex-1 ${!isPatientView ? 'ml-64' : ''}`}>
        {children}
      </main>
    </div>
  )
}
