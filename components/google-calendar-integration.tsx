"use client"

import { useState, useEffect } from "react"
import { Calendar, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import type { AvailabilitySlot } from "@/lib/google-calendar"

interface GoogleCalendarIntegrationProps {
  availabilitySlots: AvailabilitySlot[]
  onSlotsUpdated: (slots: AvailabilitySlot[]) => void
}

interface CalendarListItem {
  id: string
  summary: string
  primary?: boolean
}

export function GoogleCalendarIntegration({ availabilitySlots, onSlotsUpdated }: GoogleCalendarIntegrationProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [syncDirection, setSyncDirection] = useState<"export" | "import" | "both">("export")
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>("")
  const [calendars, setCalendars] = useState<CalendarListItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [syncInProgress, setSyncInProgress] = useState(false)

  const { toast } = useToast()

  // Check if the user is connected to Google Calendar
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch("/api/google/calendars")
        if (response.ok) {
          setIsConnected(true)
          const data = await response.json()
          setCalendars(data.items || [])

          // Set the primary calendar as the default selected calendar
          const primaryCalendar = data.items?.find((calendar: CalendarListItem) => calendar.primary)
          if (primaryCalendar) {
            setSelectedCalendarId(primaryCalendar.id)
          } else if (data.items?.length > 0) {
            setSelectedCalendarId(data.items[0].id)
          }
        } else {
          setIsConnected(false)
        }
      } catch (error) {
        console.error("Error checking Google Calendar connection:", error)
        setIsConnected(false)
      }
    }

    checkConnection()
  }, [])

  // Handle connecting to Google Calendar
  const handleConnect = () => {
    window.location.href = "/api/google/auth"
  }

  // Handle syncing with Google Calendar
  const handleSync = async () => {
    if (!selectedCalendarId) {
      setError("Please select a calendar")
      return
    }

    setSyncInProgress(true)
    setError(null)

    try {
      if (syncDirection === "export" || syncDirection === "both") {
        // Export availability slots
        const exportResponse = await fetch("/api/google/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            calendarId: selectedCalendarId,
            slots: availabilitySlots,
          }),
        })

        if (!exportResponse.ok) {
          throw new Error("Failed to export availability slots to Google Calendar")
        }

        const exportData = await exportResponse.json()
        onSlotsUpdated(exportData.slots)

        toast({
          title: "Export Successful",
          description: `${exportData.slots.length} availability slots exported to Google Calendar.`,
        })
      }

      if (syncDirection === "import" || syncDirection === "both") {
        // Import events from Google Calendar
        const now = new Date()
        const sixMonthsLater = new Date(now)
        sixMonthsLater.setMonth(now.getMonth() + 6)

        const importResponse = await fetch("/api/google/import", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            calendarId: selectedCalendarId,
            startDate: now.toISOString(),
            endDate: sixMonthsLater.toISOString(),
          }),
        })

        if (!importResponse.ok) {
          throw new Error("Failed to import events from Google Calendar")
        }

        const importData = await importResponse.json()

        // Merge imported slots with existing slots
        const mergedSlots = [...availabilitySlots]

        // Add only new slots that don't have a matching googleCalendarEventId
        importData.slots.forEach((importedSlot: AvailabilitySlot) => {
          const existingSlotIndex = mergedSlots.findIndex(
            (slot) => slot.googleCalendarEventId === importedSlot.googleCalendarEventId,
          )

          if (existingSlotIndex === -1) {
            mergedSlots.push(importedSlot)
          }
        })

        onSlotsUpdated(mergedSlots)

        toast({
          title: "Import Successful",
          description: `${importData.slots.length} events imported from Google Calendar.`,
        })
      }

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error syncing with Google Calendar:", error)
      setError((error as Error).message || "Failed to sync with Google Calendar")
    } finally {
      setSyncInProgress(false)
    }
  }

  return (
    <>
      {isConnected ? (
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          <Calendar className="h-4 w-4 mr-2" />
          Sync with Google Calendar
        </Button>
      ) : (
        <Button variant="outline" onClick={handleConnect}>
          <Calendar className="h-4 w-4 mr-2" />
          Connect Google Calendar
        </Button>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Google Calendar Sync</DialogTitle>
            <DialogDescription>Synchronize your availability slots with Google Calendar.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="calendar">Select Calendar</Label>
              <Select value={selectedCalendarId} onValueChange={setSelectedCalendarId}>
                <SelectTrigger id="calendar">
                  <SelectValue placeholder="Select a calendar" />
                </SelectTrigger>
                <SelectContent>
                  {calendars.map((calendar) => (
                    <SelectItem key={calendar.id} value={calendar.id}>
                      {calendar.summary} {calendar.primary ? "(Primary)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sync Direction</Label>
              <RadioGroup value={syncDirection} onValueChange={(value) => setSyncDirection(value as any)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="export" id="export" />
                  <Label htmlFor="export">Export to Google Calendar</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="import" id="import" />
                  <Label htmlFor="import">Import from Google Calendar</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both">Two-way sync</Label>
                </div>
              </RadioGroup>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSync} disabled={syncInProgress || !selectedCalendarId}>
              {syncInProgress ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Now
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
