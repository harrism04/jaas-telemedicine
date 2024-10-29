"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Clock } from "lucide-react"
import { format } from "date-fns"

interface Appointment {
  id: number;
  patientName: string;
  time: string;
  date: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'In Progress';
  type: 'Follow-up' | 'New Patient' | 'Urgent' | 'Regular';
}

// Mock appointments data
const appointments: Appointment[] = [
  {
    id: 1,
    patientName: "John Smith",
    time: "09:00 AM",
    date: "2024-01-29",
    status: "Scheduled",
    type: "Follow-up"
  },
  {
    id: 2,
    patientName: "Sarah Johnson",
    time: "10:30 AM",
    date: "2024-01-29",
    status: "Scheduled",
    type: "New Patient"
  },
  {
    id: 3,
    patientName: "Michael Brown",
    time: "02:00 PM",
    date: "2024-01-30",
    status: "Scheduled",
    type: "Regular"
  },
  {
    id: 4,
    patientName: "Emily Davis",
    time: "03:30 PM",
    date: "2024-01-30",
    status: "Scheduled",
    type: "Urgent"
  },
  {
    id: 5,
    patientName: "Robert Wilson",
    time: "11:00 AM",
    date: "2024-01-31",
    status: "Scheduled",
    type: "Follow-up"
  }
]

export default function SchedulePage() {
  const [date, setDate] = useState<Date>(new Date())

  // Filter appointments for selected date
  const dailyAppointments = appointments.filter(
    appointment => appointment.date === format(date, 'yyyy-MM-dd')
  )

  // Group appointments by date for calendar
  const appointmentDates = appointments.reduce((acc, appointment) => {
    acc[appointment.date] = (acc[appointment.date] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-primary mb-6">Schedule</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar View */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              modifiers={{
                hasAppointment: (date) => {
                  const dateStr = format(date, 'yyyy-MM-dd')
                  return dateStr in appointmentDates
                }
              }}
              modifiersStyles={{
                hasAppointment: {
                  fontWeight: 'bold',
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'white'
                }
              }}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Daily Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>
              Daily Schedule
              <span className="text-sm font-normal text-muted-foreground ml-2">
                {format(date, 'EEEE, MMMM d, yyyy')}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dailyAppointments.length > 0 ? (
                dailyAppointments.map(appointment => (
                  <div
                    key={appointment.id}
                    className="flex items-start space-x-4 p-3 rounded-lg border hover:shadow-md transition-shadow"
                  >
                    <div className="flex-shrink-0">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {appointment.patientName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.time}
                      </p>
                    </div>
                    <Badge
                      variant={
                        appointment.type === 'Urgent' ? 'destructive' :
                        appointment.type === 'New Patient' ? 'default' :
                        'secondary'
                      }
                    >
                      {appointment.type}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">
                  No appointments scheduled for this day
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 