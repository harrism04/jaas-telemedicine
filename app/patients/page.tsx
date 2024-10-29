"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Calendar, Clock, Phone, Mail, MapPin } from "lucide-react"

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  phone: string;
  address: string;
  lastVisit: string;
  nextAppointment?: string;
  status: 'Active' | 'Inactive' | 'Pending';
  medicalHistory: {
    conditions: string[];
    allergies: string[];
    medications: string[];
  };
  visitHistory: {
    date: string;
    type: 'Virtual' | 'In-Person';
    reason: string;
    diagnosis?: string;
    prescription?: string;
  }[];
}

// Mock patient data
const patients: Patient[] = [
  {
    id: 1,
    name: "Berus Wayne",
    age: 45,
    gender: "Male",
    email: "berus.wayne@email.com",
    phone: "(555) 123-4567",
    address: "1007 Mountain Drive, Gotham City",
    lastVisit: "2024-01-15",
    nextAppointment: "2024-02-01",
    status: "Active",
    medicalHistory: {
      conditions: ["Type 2 Diabetes", "Hypertension"],
      allergies: ["Penicillin"],
      medications: ["Metformin 1000mg", "Glipizide 5mg"]
    },
    visitHistory: [
      {
        date: "2024-01-15",
        type: "Virtual",
        reason: "Follow-up: Diabetes Management",
        diagnosis: "Well-controlled diabetes",
        prescription: "Continue current medications"
      }
    ]
  },
  {
    id: 2,
    name: "Tom Kurus",
    age: 58,
    gender: "Male",
    email: "tom.kurus@email.com",
    phone: "(555) 234-5678",
    address: "456 Steel Avenue, Metropolis",
    lastVisit: "2024-01-20",
    nextAppointment: "2024-01-30",
    status: "Active",
    medicalHistory: {
      conditions: ["Hypertension", "High Cholesterol"],
      allergies: ["Sulfa drugs"],
      medications: ["Lisinopril 20mg", "Amlodipine 5mg"]
    },
    visitHistory: [
      {
        date: "2024-01-20",
        type: "In-Person",
        reason: "Urgent: High Blood Pressure",
        diagnosis: "Uncontrolled hypertension",
        prescription: "Increased Lisinopril dosage"
      }
    ]
  },
  {
    id: 3,
    name: "Mydin Johnson",
    age: 35,
    gender: "Male",
    email: "mydin.johnson@email.com",
    phone: "(555) 345-6789",
    address: "789 Health Street, Central City",
    lastVisit: "2023-12-15",
    nextAppointment: "2024-01-30",
    status: "Active",
    medicalHistory: {
      conditions: [],
      allergies: [],
      medications: []
    },
    visitHistory: [
      {
        date: "2023-12-15",
        type: "In-Person",
        reason: "Annual Check-up",
        diagnosis: "Healthy, no concerns",
        prescription: "None"
      }
    ]
  },
  {
    id: 4,
    name: "Leonardo DiKopi-o",
    age: 52,
    gender: "Male",
    email: "leonardo.dikopi@email.com",
    phone: "(555) 456-7890",
    address: "321 Star Boulevard, Hollywood",
    lastVisit: "2024-01-10",
    nextAppointment: "2024-01-30",
    status: "Active",
    medicalHistory: {
      conditions: ["High Cholesterol", "Mild Hypertension"],
      allergies: ["Ibuprofen"],
      medications: ["Atorvastatin 40mg", "Aspirin 81mg"]
    },
    visitHistory: [
      {
        date: "2024-01-10",
        type: "Virtual",
        reason: "Follow-up: Medication Review",
        diagnosis: "Stable condition",
        prescription: "Continue current medications"
      }
    ]
  },
  {
    id: 5,
    name: "Emily Paris",
    age: 29,
    gender: "Female",
    email: "emily.paris@email.com",
    phone: "(555) 567-8901",
    address: "567 Fashion Avenue, Paris District",
    lastVisit: "2024-01-25",
    nextAppointment: "2024-01-30",
    status: "Active",
    medicalHistory: {
      conditions: [],
      allergies: ["Latex"],
      medications: []
    },
    visitHistory: [
      {
        date: "2024-01-25",
        type: "In-Person",
        reason: "New Patient Consultation",
        diagnosis: "Initial assessment",
        prescription: "None"
      }
    ]
  }
]

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-primary mb-6">Patients</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Patient List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-250px)]">
              <div className="space-y-2">
                {filteredPatients.map(patient => (
                  <div
                    key={patient.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors
                      ${selectedPatient?.id === patient.id 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:bg-muted'}`}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {patient.age} years • {patient.gender}
                        </p>
                      </div>
                      <Badge variant={
                        patient.status === 'Active' ? 'default' :
                        patient.status === 'Inactive' ? 'secondary' : 'outline'
                      }>
                        {patient.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Patient Details */}
        {selectedPatient ? (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{selectedPatient.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="history">Medical History</TabsTrigger>
                  <TabsTrigger value="visits">Visit History</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Age</p>
                      <p>{selectedPatient.age} years</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p>{selectedPatient.gender}</p>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p>{selectedPatient.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p>{selectedPatient.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <p>{selectedPatient.address}</p>
                    </div>
                  </div>

                  {/* Appointments */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Last Visit</p>
                        <p>{new Date(selectedPatient.lastVisit).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {selectedPatient.nextAppointment && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Next Appointment</p>
                          <p>{new Date(selectedPatient.nextAppointment).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="history" className="space-y-6">
                  {/* Medical Conditions */}
                  <div>
                    <h3 className="font-semibold mb-2">Medical Conditions</h3>
                    <div className="flex gap-2 flex-wrap">
                      {selectedPatient.medicalHistory.conditions.map((condition, i) => (
                        <Badge key={i} variant="outline">{condition}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Allergies */}
                  <div>
                    <h3 className="font-semibold mb-2">Allergies</h3>
                    <div className="flex gap-2 flex-wrap">
                      {selectedPatient.medicalHistory.allergies.map((allergy, i) => (
                        <Badge key={i} variant="destructive">{allergy}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Current Medications */}
                  <div>
                    <h3 className="font-semibold mb-2">Current Medications</h3>
                    <div className="flex gap-2 flex-wrap">
                      {selectedPatient.medicalHistory.medications.map((medication, i) => (
                        <Badge key={i} variant="secondary">{medication}</Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="visits">
                  <div className="space-y-4">
                    {selectedPatient.visitHistory.map((visit, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <p>{new Date(visit.date).toLocaleDateString()}</p>
                            </div>
                            <Badge>{visit.type}</Badge>
                          </div>
                          <p className="font-medium mb-2">Reason: {visit.reason}</p>
                          {visit.diagnosis && (
                            <p className="text-sm text-muted-foreground mb-1">
                              Diagnosis: {visit.diagnosis}
                            </p>
                          )}
                          {visit.prescription && (
                            <p className="text-sm text-muted-foreground">
                              Prescription: {visit.prescription}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <Card className="md:col-span-2 flex items-center justify-center h-[calc(100vh-250px)]">
            <p className="text-muted-foreground">Select a patient to view details</p>
          </Card>
        )}
      </div>
    </div>
  )
} 