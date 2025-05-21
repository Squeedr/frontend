"use client"

import { useState } from "react"
import { Calendar, Download } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { downloadICalendarFile } from "@/lib/ical-utils"
import { useToast } from "@/hooks/use-toast"

// Define the AvailabilitySlot interface (matching the one in availability page)
interface AvailabilitySlot {
  id: string
  date: string // ISO
  start: string // '09:00'
  end: string // '10:00'
  status: "available" | "booked" | "unavailable"
  expert?: string
  workspace?: string
  recurring?: boolean
  recurrencePattern?: "weekly" | "biweekly" | "monthly"
  recurrenceEndDate?: string
  recurrenceExceptions?: string[] // Dates where the recurrence doesn't apply
}

interface ExportCalendarDialogProps {
  availabilitySlots: AvailabilitySlot[]
}

export function ExportCalendarDialog({ availabilitySlots }: ExportCalendarDialogProps) {
  const [open, setOpen] = useState(false)
  const [exportType, setExportType] = useState<"all" | "available" | "booked">("all")
  const [calendarName, setCalendarName] = useState("Squeedr Availability")
  const [includeRecurring, setIncludeRecurring] = useState(true)
  const [dateRange, setDateRange] = useState<"all" | "future" | "custom">("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const { toast } = useToast()

  const handleExport = () => {
    // Filter slots based on export options
    let filteredSlots = [...availabilitySlots]

    // Filter by status
    if (exportType === "available") {
      filteredSlots = filteredSlots.filter((slot) => slot.status === "available")
    } else if (exportType === "booked") {
      filteredSlots = filteredSlots.filter((slot) => slot.status === "booked")
    }

    // Filter by recurring option
    if (!includeRecurring) {
      filteredSlots = filteredSlots.filter((slot) => !slot.recurring)
    }

    // Filter by date range
    if (dateRange === "future") {
      const today = new Date().toISOString().split("T")[0]
      filteredSlots = filteredSlots.filter((slot) => slot.date >= today)
    } else if (dateRange === "custom" && startDate && endDate) {
      filteredSlots = filteredSlots.filter((slot) => slot.date >= startDate && slot.date <= endDate)
    }

    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").substring(0, 19)
    const filename = `squeedr-availability-${timestamp}.ics`

    // Download the file
    downloadICalendarFile(filteredSlots, calendarName, filename)

    // Close the dialog
    setOpen(false)

    // Show success toast
    toast({
      title: "Calendar Exported",
      description: `${filteredSlots.length} availability slots exported to ICS file.`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Export to Calendar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export Availability</DialogTitle>
          <DialogDescription>
            Export your availability slots to use with external calendar applications.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Export Options</Label>
            <RadioGroup
              value={exportType}
              onValueChange={(value) => setExportType(value as "all" | "available" | "booked")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="export-all" />
                <Label htmlFor="export-all">All availability slots</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="available" id="export-available" />
                <Label htmlFor="export-available">Available slots only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="booked" id="export-booked" />
                <Label htmlFor="export-booked">Booked slots only</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="calendar-name">Calendar Name</Label>
            <Input id="calendar-name" value={calendarName} onChange={(e) => setCalendarName(e.target.value)} />
            <p className="text-xs text-gray-500">This name will appear in your calendar application.</p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-recurring"
              checked={includeRecurring}
              onCheckedChange={(checked) => setIncludeRecurring(checked as boolean)}
            />
            <Label htmlFor="include-recurring">Include recurring slots</Label>
          </div>

          <div className="space-y-2">
            <Label>Date Range</Label>
            <RadioGroup value={dateRange} onValueChange={(value) => setDateRange(value as "all" | "future" | "custom")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="date-all" />
                <Label htmlFor="date-all">All dates</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="future" id="date-future" />
                <Label htmlFor="date-future">Future dates only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="date-custom" />
                <Label htmlFor="date-custom">Custom date range</Label>
              </div>
            </RadioGroup>
          </div>

          {dateRange === "custom" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} className="bg-black hover:bg-gray-800 text-white">
            <Download className="h-4 w-4 mr-2" />
            Download ICS File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
