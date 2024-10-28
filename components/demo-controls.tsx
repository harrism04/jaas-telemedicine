"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DemoControlsProps {
  appointmentId: number | null;
  onJoinAsDoctor: (id: number) => void;
}

export function DemoControls({ appointmentId, onJoinAsDoctor }: DemoControlsProps) {
  if (!appointmentId) return null

  const handleDoctorClick = () => {
    if (appointmentId) {
      window.open('', 'doctor_view', 'width=1200,height=800')
      onJoinAsDoctor(appointmentId)
    }
  }

  return (
    <Dialog defaultOpen={true} modal={false}>
      <DialogContent className="sm:max-w-[425px] bottom-4 right-4 fixed p-4 rounded-lg shadow-lg border border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-primary">Demo Controls</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Open the doctor view to start consultation
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Button 
            onClick={handleDoctorClick}
            className="bg-primary hover:bg-primary/90 w-full"
          >
            Open Doctor View
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            You can launch the patient view from the doctor&apos;s interface
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
