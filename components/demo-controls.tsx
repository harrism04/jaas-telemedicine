"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface DemoControlsProps {
  appointmentId: string | number | null;
  mode: 'dashboard' | 'consultation';
  patientName?: string;
  onJoinAsDoctor?: (id: number) => void;
  onLaunchPatientView?: () => void;
}

export function DemoControls({ 
  appointmentId, 
  mode,
  patientName,
  onJoinAsDoctor,
  onLaunchPatientView 
}: DemoControlsProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!appointmentId) return null;

  const handleDoctorClick = () => {
    if (appointmentId && onJoinAsDoctor) {
      window.open('', 'doctor_view', 'width=1200,height=800')
      onJoinAsDoctor(Number(appointmentId))
      setIsOpen(false)
    }
  }

  const handlePatientClick = () => {
    if (onLaunchPatientView) {
      onLaunchPatientView()
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-primary">Demo Controls</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          {mode === 'dashboard' ? (
            <>
              <Button 
                onClick={handleDoctorClick}
                className="bg-primary hover:bg-primary/90 w-full"
              >
                Open Doctor View
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                You can launch the patient view from the doctor&apos;s interface
              </p>
            </>
          ) : (
            <>
              <Button 
                onClick={handlePatientClick}
                className="bg-primary hover:bg-primary/90 w-full"
              >
                Launch Patient View
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Patient view will open in a new window
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
