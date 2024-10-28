"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Video, Users } from "lucide-react"
import { DemoControls } from "@/components/demo-controls"

// Add status type for better type safety
type AppointmentStatus = 'In Waiting Room' | 'Scheduled' | 'In Progress' | 'Completed';

interface Appointment {
  id: number;
  patientName: string;
  time: string;
  status: AppointmentStatus;
  waitingSince?: string;  // Add this for waiting room patients
  reason?: string;        // Add visit reason
}

interface AppointmentCardProps {
  appointment: Appointment;
  onStartConsultation: (id: number) => void;
  onJoinAsDoctor: (id: number) => void;
  isActive: boolean;
}

// Keep mock data outside
const appointments: Appointment[] = [
  { 
    id: 1, 
    patientName: "Berus Wayne", 
    time: "10:30 AM", 
    status: "In Waiting Room",
    waitingSince: "12 minutes",
    reason: "Follow-up: Diabetes Management"
  },
  { 
    id: 2, 
    patientName: "Tom Kurus", 
    time: "10:45 AM", 
    status: "In Waiting Room",
    waitingSince: "5 minutes",
    reason: "Urgent: High Blood Pressure"
  },
  { 
    id: 3, 
    patientName: "Mydin Johnson", 
    time: "11:00 AM", 
    status: "Scheduled",
    reason: "Annual Check-up"
  },
  { 
    id: 4, 
    patientName: "Leonardo DiKopi-o", 
    time: "11:30 AM", 
    status: "Scheduled",
    reason: "Follow-up: Medication Review"
  },
  { 
    id: 5, 
    patientName: "Emily Paris", 
    time: "2:00 PM", 
    status: "Scheduled",
    reason: "New Patient Consultation"
  },
]

export function ClinicDashboardComponent() {
  const router = useRouter()
  const [activeAppointment, setActiveAppointment] = useState<number | null>(null)

  // Move waitingRoomPatients inside component
  const waitingRoomPatients = appointments
    .filter(a => a.status === "In Waiting Room")
    .sort((a, b) => {
      const aMinutes = parseInt(a.waitingSince?.split(' ')[0] || '0')
      const bMinutes = parseInt(b.waitingSince?.split(' ')[0] || '0')
      return bMinutes - aMinutes
    })

  const startConsultation = (appointmentId: number) => {
    console.log("Starting consultation for appointment", appointmentId)
    setActiveAppointment(appointmentId)
  }

  const joinAsDoctor = (appointmentId: number) => {
    const appointment = appointments.find(a => a.id === appointmentId)
    // Open in new tab for consistency
    const doctorUrl = `${window.location.origin}/video-conference?appointment=${appointmentId}&role=doctor&patient=${appointment?.patientName}`
    window.open(doctorUrl, 'doctor_view', 'width=1200,height=800')
  }

  const openPatientWindow = (appointmentId: number) => {
    const appointment = appointments.find(a => a.id === appointmentId)
    const patientUrl = `${window.location.origin}/video-conference?appointment=${appointmentId}&role=patient&patient=${appointment?.patientName}`
    window.open(patientUrl, 'patient_view', 'width=1200,height=800')
  }

  // Add sorting function for appointments
  const sortedAppointments = [...appointments].sort((a, b) => {
    if (a.status === "In Waiting Room" && b.status !== "In Waiting Room") return -1
    if (b.status === "In Waiting Room" && a.status !== "In Waiting Room") return 1
    
    // Convert times to comparable values
    const aTime = new Date(`1970/01/01 ${a.time}`).getTime()
    const bTime = new Date(`1970/01/01 ${b.time}`).getTime()
    return aTime - bTime
  })

  return (
    <div className="container mx-auto p-6 bg-background">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Telemedicine Portal</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 shadow-custom">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="text-xl text-primary">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All ({appointments.length})</TabsTrigger>
                <TabsTrigger value="waiting" className="text-accent">
                  Waiting Room ({waitingRoomPatients.length})
                </TabsTrigger>
                <TabsTrigger value="scheduled">
                  Scheduled ({appointments.filter(a => a.status === "Scheduled").length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                {sortedAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onStartConsultation={startConsultation}
                    onJoinAsDoctor={joinAsDoctor}
                    isActive={activeAppointment === appointment.id}
                  />
                ))}
              </TabsContent>
              <TabsContent value="waiting">
                {waitingRoomPatients.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onStartConsultation={startConsultation}
                    onJoinAsDoctor={joinAsDoctor}
                    isActive={activeAppointment === appointment.id}
                  />
                ))}
              </TabsContent>
              <TabsContent value="scheduled">
                {sortedAppointments
                  .filter(a => a.status === "Scheduled")
                  .map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onStartConsultation={startConsultation}
                      onJoinAsDoctor={joinAsDoctor}
                      isActive={activeAppointment === appointment.id}
                    />
                  ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="shadow-custom h-fit">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="text-xl text-primary">
              Waiting Room ({waitingRoomPatients.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {waitingRoomPatients.length > 0 ? (
              waitingRoomPatients.map((patient) => (
                <div key={patient.id} className="flex flex-col mb-6 last:mb-0">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{patient.patientName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium">{patient.patientName}</p>
                      <p className="text-xs text-muted-foreground">
                        Waiting for {patient.waitingSince}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-accent/5 text-accent">
                      {patient.time}
                    </Badge>
                  </div>
                  {patient.reason && (
                    <p className="mt-2 text-sm text-muted-foreground ml-14">
                      {patient.reason}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No patients in waiting room</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Update the DemoControls usage */}
      <DemoControls 
        appointmentId={activeAppointment}
        onJoinAsDoctor={joinAsDoctor}
      />
    </div>
  )
}

function AppointmentCard({ 
  appointment, 
  onStartConsultation, 
  onJoinAsDoctor, 
  isActive 
}: AppointmentCardProps) {
  return (
    <Card className={`mb-4 transition-all duration-200 hover:shadow-lg ${isActive ? 'border-primary shadow-md' : 'shadow-custom'}`}>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 border-2 border-primary/10">
                <AvatarFallback className="bg-primary/5 text-primary">
                  {appointment.patientName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4">
                <p className="font-semibold text-foreground">{appointment.patientName}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  {appointment.time}
                </div>
              </div>
            </div>
            <Badge 
              variant={appointment.status === "In Waiting Room" ? "default" : "secondary"}
              className={appointment.status === "In Waiting Room" ? 'bg-accent text-white' : ''}
            >
              {appointment.status}
            </Badge>
          </div>

          <div className="flex justify-end gap-3">
            {isActive ? (
              <Button 
                size="sm"
                className="bg-primary hover:bg-primary/90"
                onClick={() => onStartConsultation(appointment.id)}
              >
                Start Demo
              </Button>
            ) : (
              <Button 
                size="sm"
                className="bg-primary hover:bg-primary/90"
                onClick={() => onStartConsultation(appointment.id)}
              >
                Start Consultation
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
