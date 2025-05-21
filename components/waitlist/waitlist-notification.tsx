"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { Bell, Calendar, Clock, MapPin, CheckCircle, X } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import type { WaitlistRequest } from "@/lib/types/waitlist"

interface WaitlistNotificationProps {
  request: WaitlistRequest
  onAccept: (requestId: string) => void
  onDecline: (requestId: string) => void
}

export function WaitlistNotification({ request, onAccept, onDecline }: WaitlistNotificationProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleAccept = async () => {
    setLoading(true)
    try {
      await onAccept(request.id)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept the waitlist notification. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDecline = async () => {
    try {
      await onDecline(request.id)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to decline the waitlist notification. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Only show notification for notified requests
  if (request.status !== "notified") return null

  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-green-100 p-2">
            <Bell className="h-5 w-5 text-green-600" />
          </div>
          <div className="space-y-1">
            <h4 className="font-medium text-green-800">Workspace Available!</h4>
            <p className="text-sm text-green-700">
              The workspace you requested is now available. You have until{" "}
              {request.expiresAt && format(parseISO(request.expiresAt), "h:mm a")} to claim it.
            </p>
            <div className="mt-2 space-y-1 text-xs text-green-700">
              <div className="flex items-center">
                <MapPin className="mr-1 h-3 w-3" />
                {request.workspaceName}
              </div>
              <div className="flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                {format(parseISO(request.date), "MMMM d, yyyy")}
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                {request.startTime} - {request.endTime}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t border-green-200 bg-green-100/50 p-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-green-300 bg-white text-green-700 hover:bg-green-50 hover:text-green-800"
          onClick={handleDecline}
        >
          <X className="mr-1 h-3 w-3" />
          Decline
        </Button>
        <Button
          variant="default"
          size="sm"
          className="h-8 bg-green-600 text-white hover:bg-green-700"
          onClick={handleAccept}
          disabled={loading}
        >
          <CheckCircle className="mr-1 h-3 w-3" />
          {loading ? "Claiming..." : "Claim Spot"}
        </Button>
      </CardFooter>
    </Card>
  )
}
