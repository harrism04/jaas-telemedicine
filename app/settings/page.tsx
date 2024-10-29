"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface JaaSFeatures {
  startWithAudioMuted: boolean;
  startWithVideoMuted: boolean;
}

export default function SettingsPage() {
  const { toast } = useToast()
  const [features, setFeatures] = useState<JaaSFeatures>({
    startWithAudioMuted: false,
    startWithVideoMuted: false,
  })

  // Load saved settings on mount
  useEffect(() => {
    const savedFeatures = localStorage.getItem('jaasFeatures')
    if (savedFeatures) {
      setFeatures(JSON.parse(savedFeatures))
    }
  }, [])

  const handleFeatureToggle = (feature: keyof JaaSFeatures) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }))
  }

  const saveSettings = () => {
    // Save to localStorage for now
    localStorage.setItem('jaasFeatures', JSON.stringify(features))
    toast({
      title: "Settings saved",
      description: "Your video conference settings have been updated.",
    })
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>JaaS Video Conference Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {Object.entries(features).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={key} className="flex-1">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Label>
                <Switch
                  id={key}
                  checked={value}
                  onCheckedChange={() => handleFeatureToggle(key as keyof JaaSFeatures)}
                />
              </div>
            ))}
            
            <Button onClick={saveSettings} className="mt-4">
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
} 