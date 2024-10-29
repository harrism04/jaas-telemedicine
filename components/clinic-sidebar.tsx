"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Calendar,
  Users,
  Settings,
  MessageSquare,
  FileText,
  BarChart,
  Bell,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Notification type
interface Notification {
  id: number
  title: string
  message: string
  time: string
  isRead: boolean
}

// Mock notifications
const notifications: Notification[] = [
  {
    id: 1,
    title: "New Patient",
    message: "Jane Smith has joined the waiting room",
    time: "2 min ago",
    isRead: false,
  },
  {
    id: 2,
    title: "Appointment Reminder",
    message: "Upcoming appointment with John Doe at 2:00 PM",
    time: "10 min ago",
    isRead: false,
  },
]

// Mock stats
const stats = {
  todayPatients: 8,
  waitingRoom: 2,
  totalAppointments: 12,
  completedToday: 6,
}

export function ClinicSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(2)
  const router = useRouter()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed top-4 left-4 lg:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-64 p-0">
        <SidebarContent 
          unreadNotifications={unreadNotifications}
          onNavigate={(path) => router.push(path)}
        />
      </SheetContent>

      {/* Desktop sidebar */}
      <div className={`hidden lg:flex h-screen border-r border-border transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
        <SidebarContent 
          unreadNotifications={unreadNotifications} 
          isCollapsed={isCollapsed} 
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          onNavigate={(path) => router.push(path)}
        />
      </div>
    </Sheet>
  )
}

interface SidebarContentProps {
  unreadNotifications: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate: (path: string) => void;
}

function SidebarContent({ unreadNotifications, isCollapsed, onToggleCollapse, onNavigate }: SidebarContentProps) {
  const navigationItems = [
    { icon: Calendar, label: 'Schedule', path: '/schedule', enabled: true },
    { icon: Users, label: 'Patients', path: '/patients', enabled: true },
    { icon: MessageSquare, label: 'Messages', path: '/messages', enabled: false },
    { icon: FileText, label: 'Records', path: '/records', enabled: false },
    { icon: BarChart, label: 'Analytics', path: '/analytics', enabled: false },
    { icon: Bell, label: 'Notifications', path: '/notifications', badge: unreadNotifications, enabled: false },
    { icon: Settings, label: 'Settings', path: '/settings', enabled: true },
  ]

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full bg-background relative">
        {/* Collapse button */}
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background"
            onClick={onToggleCollapse}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}

        {/* Header with Logo */}
        <div className="p-4 border-b border-border">
          <Link href="/schedule" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="Clinic Logo"
              width={40}
              height={40}
              className="cursor-pointer"
            />
            {!isCollapsed && <h2 className="font-bold text-primary ml-2">Harris' Clinic Portal</h2>}
          </Link>
        </div>

        {/* Quick Stats */}
        {!isCollapsed && (
          <div className="p-4 border-b border-border">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/5 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Today's Patients</p>
                <p className="text-xl font-bold text-primary">{stats.todayPatients}</p>
              </div>
              <div className="bg-accent/5 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Waiting Room</p>
                <p className="text-xl font-bold text-accent">{stats.waitingRoom}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-2">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Tooltip key={item.label} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-${isCollapsed ? 'center' : 'start'} relative
                      ${!item.enabled && 'pointer-events-none'}`}
                    onClick={() => item.enabled && onNavigate(item.path)}
                  >
                    <item.icon className={`h-4 w-4 ${!isCollapsed && 'mr-2'}`} />
                    {!isCollapsed && item.label}
                    {item.badge && item.badge > 0 && (
                      <span className="absolute top-1 right-1 bg-accent text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-border">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                className={`w-full justify-${isCollapsed ? 'center' : 'start'} pointer-events-none`}
              >
                <LogOut className={`h-4 w-4 ${!isCollapsed && 'mr-2'}`} />
                {!isCollapsed && 'Logout'}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                Logout
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
