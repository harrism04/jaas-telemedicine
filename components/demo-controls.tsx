"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
  const [isMinimized, setIsMinimized] = useState(false);

  if (!appointmentId) return null;

  const handleDoctorClick = () => {
    if (appointmentId && onJoinAsDoctor) {
      window.open('', 'doctor_view', 'width=1200,height=800')
      onJoinAsDoctor(Number(appointmentId))
    }
  }

  if (isMinimized) {
    return (
      <Button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-primary hover:bg-primary/90"
      >
        Show Demo Controls
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[425px] shadow-lg border border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-semibold text-primary">Demo Controls</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsMinimized(true)}
            className="h-8 px-2 text-muted-foreground"
          >
            Minimize
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
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
                onClick={onLaunchPatientView}
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
      </CardContent>
    </Card>
  );
}
