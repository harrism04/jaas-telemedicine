"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

// Import UI components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DemoControls } from "@/components/demo-controls"

// Update these constants
const JITSI_DOMAIN = '8x8.vc'  // Change to JaaS server
const JAAS_APP_ID = process.env.NEXT_PUBLIC_JAAS_APP_ID
const generateRoomName = (appointmentId: string) => appointmentId  // Remove APP_ID prefix

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

// Update the mock data to be dynamic
const getPatientData = (patientName: string) => ({
  name: patientName,
  age: 35,
  gender: "Male",
  reason: "Follow-up consultation for hypertension",
  medications: ["Lisinopril 10mg daily", "Aspirin 81mg daily"],
  allergies: ["Penicillin"],
  vitalSigns: {
    bloodPressure: "120/80 mmHg",
    heartRate: "72 bpm",
    temperature: "98.6°F",
  },
})

// Add these types at the top of the file
interface Message {
  sender: string;
  text: string;
}

interface JitsiMeetAPI {
  dispose: () => void;
  executeCommand: (command: string) => void;
  addEventListeners: (listeners: {
    videoMuteStatusChanged: (data: { muted: boolean }) => void;
    audioMuteStatusChanged: (data: { muted: boolean }) => void;
    participantLeft: (data: { id: string; displayName: string }) => void;
    participantJoined: (data: { id: string; displayName: string }) => void;
    readyToClose: () => void;
    endpointTextMessageReceived: (data: { nick: string; message: string }) => void;
  }) => void;
}

// Add this near the top with other mock data
const PLACEHOLDER_MESSAGE = {
  sender: "System",
  text: "Chat currently isn't implemented yet, but feel free to talk to yourself 😊\nMessages will only appear in your window.",
  isSystem: true
}

// Add import at the top
import { generateJWT } from '@/lib/jitsi-utils'

export function VideoConferenceComponent() {
  const router = useRouter()
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [messages, setMessages] = useState<(Message & { isSystem?: boolean })[]>([PLACEHOLDER_MESSAGE])
  const [newMessage, setNewMessage] = useState("")
  const [jitsiApi, setJitsiApi] = useState<JitsiMeetAPI | null>(null)
  const jitsiContainerRef = useRef(null)

  // Add this near the top of the component
  const searchParams = useSearchParams()
  const appointmentId = searchParams.get('appointment')
  const role = searchParams.get('role') || 'doctor'
  const patientName = searchParams.get('patient') || 'Unknown Patient'
  const ROOM_NAME = appointmentId || 'demo'  // Simplified room name without APP_ID prefix

  // Get patient data based on the name
  const currentPatientData = getPatientData(patientName)

  // Define initJitsi before useEffect
  const initJitsi = async () => {
    if (!jitsiContainerRef.current) return null;

    try {
      const jwt = generateJWT(ROOM_NAME, role === 'doctor')
      console.log('Generated JWT:', jwt);
      console.log('Room Name:', ROOM_NAME);
      console.log('Role:', role);
      
      const options = {
        roomName: `${JAAS_APP_ID}/${ROOM_NAME}`,  // Add APP_ID prefix here
        width: '100%',
        height: '100%',
        parentNode: jitsiContainerRef.current,
        jwt,
        configOverwrite: {
          ...getJaaSFeatures(),
          // Basic settings
          prejoinPageEnabled: false,
          disableDeepLinking: true,
          disableProfile: true,

          // Debug settings
          testing: {
            enableFirefoxSimulcast: false,
            p2pTestMode: false
          },
          p2p: {
            enabled: false
          },
          analytics: {
            disabled: true
          },
          
          // Connection settings
          websocket: `wss://8x8.vc/${JAAS_APP_ID}/xmpp-websocket`,
          bosh: `https://8x8.vc/${JAAS_APP_ID}/http-bind`,

          // Disable all security features
          security: {
            enableInsecureRoomNameWarning: false,
            roomPasswordNumberOfDigits: 0,
            enableLobby: false,
            requireDisplayName: false
          },

          // Other settings
          resolution: 720,
          constraints: {
            video: {
              height: {
                ideal: 720,
                max: 720,
                min: 180
              }
            }
          }
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'settings'
          ],
          SETTINGS_SECTIONS: ['devices', 'language'],
          SHOW_PROMOTIONAL_CLOSE_PAGE: false,
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          DEFAULT_REMOTE_DISPLAY_NAME: role === 'doctor' ? patientName : 'Dr. Smith',
          MOBILE_APP_PROMO: false,
          HIDE_INVITE_MORE_HEADER: true,
          DISABLE_FOCUS_INDICATOR: true,
          DISABLE_VIDEO_BACKGROUND: true,
          DISABLE_TRANSCRIPTION_SUBTITLES: true,
          DISABLE_RINGING: true,
          DISABLE_LOBBY_UI: true,
          RECENT_LIST_ENABLED: false
        },
        onload: () => {
          console.log('Jitsi iframe loaded');
        }
      }

      // Log options without parentNode
      const loggableOptions = {
        ...options,
        parentNode: 'DOM_ELEMENT_REF' // Replace DOM reference with string for logging
      };
      console.log('Initializing Jitsi with options:', loggableOptions);

      try {
        const api = new window.JitsiMeetExternalAPI(JITSI_DOMAIN, options);

        // Add event listeners for debugging
        api.addEventListeners({
          videoConferenceJoined: (data: any) => {
            console.log('Joined conference:', data);
          },
          participantJoined: (data: any) => {
            console.log('Participant joined:', data);
          },
          participantLeft: (data: any) => {
            console.log('Participant left:', data);
          },
          videoConferenceLeft: (data: any) => {
            console.log('Left conference:', data);
          },
          readyToClose: () => {
            console.log('Ready to close');
          },
          errorOccurred: (error: any) => {
            console.error('Jitsi error:', error);
          }
        });

        return api;
      } catch (initError) {
        console.error('Failed to initialize JitsiMeetExternalAPI:', initError);
        return null;
      }
    } catch (error) {
      console.error('Failed to initialize Jitsi:', error)
      return null
    }
  }

  // Use useEffect after initJitsi is defined
  useEffect(() => {
    let mounted = true;
    let api: any = null;

    const loadJitsiScript = async () => {
      try {
        console.log('Loading Jitsi script...');
        if (!window.JitsiMeetExternalAPI) {
          console.log('JitsiMeetExternalAPI not found, loading script...');
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script')
            const scriptUrl = `https://8x8.vc/${JAAS_APP_ID}/external_api.js`;
            console.log('Loading script from:', scriptUrl);
            script.src = scriptUrl
            script.async = true
            script.onload = () => {
              console.log('Jitsi script loaded successfully');
              resolve()
            }
            script.onerror = (error) => {
              console.error('Failed to load Jitsi script:', error)
              reject(error)
            }
            document.body.appendChild(script)
          })
        } else {
          console.log('JitsiMeetExternalAPI already loaded');
        }

        if (mounted && !api) {
          console.log('Initializing Jitsi API...');
          api = await initJitsi()
          if (api) {
            console.log('Jitsi API initialized successfully');
            setJitsiApi(api)
          }
        }
      } catch (error) {
        console.error('Failed to load Jitsi script:', error)
      }
    }

    loadJitsiScript()

    return () => {
      mounted = false;
      if (api) {
        api.dispose()
      }
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => iframe.remove());
    }
  }, []) // Remove initJitsi from dependencies

  const handleParticipantJoined = (participant: { id: string; displayName: string }) => {
    console.log('Participant joined:', participant)
  }

  const handleParticipantLeft = (participant: { id: string; displayName: string }) => {
    console.log('Participant left:', participant)
  }

  const handleReadyToClose = () => {
    console.log('Call ended')
  }

  const toggleAudio = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand('toggleAudio')
    }
    setIsMuted(!isMuted)
  }

  const toggleVideo = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand('toggleVideo')
    }
    setIsVideoOff(!isVideoOff)
  }

  const endCall = () => {
    if (jitsiApi) {
      jitsiApi.executeCommand('hangup')
    }
    router.push('/') // Go back to dashboard after ending call
  }

  const handleIncomingMessage = (data: { nick: string; message: string }) => {
    setMessages(prev => [...prev, {
      sender: data.nick,
      text: data.message
    }])
  }

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      // Only add to local state, don't try to send via Jitsi
      setMessages(prev => [...prev, {
        sender: role === 'doctor' ? 'Dr. Smith' : patientName,
        text: newMessage
      }])
      setNewMessage("")
    }
  }

  // Add function to launch patient view
  const launchPatientView = () => {
    if (appointmentId && patientName) {
      const patientUrl = `${window.location.origin}/video-conference?appointment=${appointmentId}&role=patient&patient=${patientName}`
      window.open(patientUrl, 'patient_view', 'width=1200,height=800')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.svg"
                alt="Clinic Logo"
                width={40}
                height={40}
                className="cursor-pointer"
              />
            </Link>
            <h1 className="text-2xl font-bold text-primary">
              {role === 'doctor' ? 'Doctor Consultation' : 'Patient Room'}
            </h1>
          </div>
          {role === 'doctor' && (
            <Button 
              variant="outline" 
              onClick={() => router.push('/')}
              className="border-destructive text-destructive hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]"
            >
              Back to Dashboard
            </Button>
          )}
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <Card className="shadow-custom overflow-hidden">
              <CardContent className="p-0 aspect-video">
                <div ref={jitsiContainerRef} className="w-full h-full" />
              </CardContent>
            </Card>
          </div>

          <div className="w-96">
            <Card className="shadow-custom h-full">
              <Tabs defaultValue={role === 'doctor' ? "info" : "chat"} className="h-full">
                <TabsList className="grid w-full grid-cols-2">
                  {role === 'doctor' && <TabsTrigger value="info">Patient Info</TabsTrigger>}
                  <TabsTrigger value="chat" className={role === 'doctor' ? '' : 'col-span-2'}>Chat</TabsTrigger>
                </TabsList>

                {/* Patient Info Tab - Only for Doctor */}
                {role === 'doctor' && (
                  <TabsContent value="info" className="flex-1 overflow-auto">
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle>Patient Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <dl className="space-y-4">
                          <div>
                            <dt className="font-semibold">Name</dt>
                            <dd>{currentPatientData.name}</dd>
                          </div>
                          <div>
                            <dt className="font-semibold">Age</dt>
                            <dd>{currentPatientData.age}</dd>
                          </div>
                          <div>
                            <dt className="font-semibold">Gender</dt>
                            <dd>{currentPatientData.gender}</dd>
                          </div>
                          <div>
                            <dt className="font-semibold">Reason for Visit</dt>
                            <dd>{currentPatientData.reason}</dd>
                          </div>
                          <div>
                            <dt className="font-semibold">Medications</dt>
                            <dd>
                              <ul className="list-disc pl-4">
                                {currentPatientData.medications.map((med, index) => (
                                  <li key={index}>{med}</li>
                                ))}
                              </ul>
                            </dd>
                          </div>
                          <div>
                            <dt className="font-semibold">Allergies</dt>
                            <dd>
                              <ul className="list-disc pl-4">
                                {currentPatientData.allergies.map((allergy, index) => (
                                  <li key={index}>{allergy}</li>
                                ))}
                              </ul>
                            </dd>
                          </div>
                          <div>
                            <dt className="font-semibold">Vital Signs</dt>
                            <dd>
                              <ul className="list-disc pl-4">
                                <li>BP: {currentPatientData.vitalSigns.bloodPressure}</li>
                                <li>HR: {currentPatientData.vitalSigns.heartRate}</li>
                                <li>Temp: {currentPatientData.vitalSigns.temperature}</li>
                              </ul>
                            </dd>
                          </div>
                        </dl>
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}

                {/* Chat Tab - For Both Roles */}
                <TabsContent value="chat" className="flex-1 overflow-auto">
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <CardTitle>Chat</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto">
                      <ScrollArea className="h-[calc(100vh-350px)]">
                        {messages.map((message, index) => (
                          <div 
                            key={index} 
                            className={`mb-4 ${
                              message.isSystem 
                                ? 'text-center text-muted-foreground italic' 
                                : message.sender === (role === 'doctor' ? 'Dr. Smith' : patientName) 
                                  ? 'text-right' 
                                  : 'text-left'
                            }`}
                          >
                            {!message.isSystem && <p className="font-semibold">{message.sender}</p>}
                            <p className="whitespace-pre-line">{message.text}</p>
                          </div>
                        ))}
                      </ScrollArea>
                    </CardContent>
                    <CardContent>
                      <form onSubmit={sendMessage} className="flex gap-2">
                        <Input
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <Button type="submit">Send</Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>

        {/* Add demo controls for doctor view */}
        {role === 'doctor' && (
          <DemoControls 
            appointmentId={appointmentId}
            mode="consultation"
            patientName={patientName}
            onLaunchPatientView={launchPatientView}
          />
        )}

        {/* Add credit for patient view */}
        {role === 'patient' && (
          <div className="fixed bottom-4 right-4 text-xs text-muted-foreground">
            made with ❤️ by{' '}
            <a 
              href="https://github.com/harrism04" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              harrism04
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

// Add at the top of your component
const getJaaSFeatures = () => {
  if (typeof window === 'undefined') return {};
  const savedFeatures = localStorage.getItem('jaasFeatures');
  return savedFeatures ? JSON.parse(savedFeatures) : {};
}
