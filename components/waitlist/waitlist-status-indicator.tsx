"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { AlertCircle, Users, Calendar, Clock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { JoinWaitlistDialog } from "@/components/waitlist/join-waitlist-dialog"
import { useToast } from "@/hooks/use-toast"
import type { WaitlistRequest } from "@/lib/types/waitlist"

interface WaitlistStatusIndicatorProps {
  workspace: {
    id: string
    name: string
    capacity: number
    type: string
  }
  date: string
  startTime: string
  endTime: string
  waitlistCount: number
  isUserInWaitlist: boolean
  currentUser: {
    id: string
    name: string
    email: string
    role: string
  }
}

export function WaitlistStatusIndicator({
  workspace,
  date,
  startTime,
  endTime,
  waitlistCount,
  isUserInWaitlist,
  currentUser,
}: WaitlistStatusIndicatorProps) {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [userInWaitlist, setUserInWaitlist] = useState(isUserInWaitlist)

  const handleJoinWaitlist = (request: WaitlistRequest) => {
    // In a real app, this would be an API call
    setUserInWaitlist(true)

    // Show success toast
    toast({
      title: "Added to waitlist",
      description: `You've been added to the waitlist for ${workspace.name} on ${format(parseISO(date), "MMMM d, yyyy")}`,
    })
  }

  return (
    <div className="space-y-4">
      <Alert variant="destructive" className="bg-red-50 border-red-200">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-800">Workspace Unavailable</AlertTitle>
        <AlertDescription className="text-red-700">
          This workspace is fully booked for the selected time. You can join the waitlist to be notified if it becomes
          available.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg bg-muted/50">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{workspace.name}</h3>
            <Badge variant="outline">{workspace.type}</Badge>
          </div>
          <div className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{format(parseISO(date), "MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>
                {startTime} - {endTime}
              </span>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Capacity: {workspace.capacity}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">{waitlistCount}</span> {waitlistCount === 1 ? "person" : "people"} in
                  waitlist
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Join the waitlist to be notified if this workspace becomes available</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {userInWaitlist ? (
            <Button variant="outline" disabled>
              Already in Waitlist
            </Button>
          ) : (
            <Button onClick={() => setIsDialogOpen(true)}>Join Waitlist</Button>
          )}
        </div>
      </div>

      <JoinWaitlistDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        workspace={workspace}
        date={date}
        startTime={startTime}
        endTime={endTime}
        onJoinWaitlist={handleJoinWaitlist}
        currentUser={currentUser}
      />
    </div>
  )
}
