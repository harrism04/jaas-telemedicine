"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface VideoDemoControlsProps {
  appointmentId: string | null;
  patientName: string;
  onLaunchPatientView: () => void;
}

export function VideoDemoControls({ appointmentId, patientName, onLaunchPatientView }: VideoDemoControlsProps) {
  if (!appointmentId) return null

  return (
    <Dialog defaultOpen={true} modal={false}>
      <DialogContent className="sm:max-w-[425px] bottom-4 right-4 fixed p-4 rounded-lg shadow-lg border border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-primary">Demo Controls</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Launch patient view for {patientName}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Button 
            onClick={onLaunchPatientView}
            className="bg-primary hover:bg-primary/90 w-full"
          >
            Launch Patient View
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Patient view will open in a new window
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
