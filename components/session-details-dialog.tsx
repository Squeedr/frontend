"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, DollarSign, User } from "lucide-react"
import type { Session } from "@/lib/mock-data"

interface SessionDetailsDialogProps {
  session: Session | null
  isOpen: boolean
  onClose: () => void
}

export function SessionDetailsDialog({ session, isOpen, onClose }: SessionDetailsDialogProps) {
  if (!session) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{session.title}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Expert</p>
                <p className="text-sm text-gray-500">{session.expertName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Client</p>
                <p className="text-sm text-gray-500">{session.clientName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm text-gray-500">{session.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Time</p>
                <p className="text-sm text-gray-500">
                  {session.startTime} - {session.endTime}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <p className="text-sm font-medium">${session.price}</p>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Session Recording</h3>
            {session.recordingUrl ? (
              <video controls className="w-full rounded-lg border">
                <source src={session.recordingUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <p className="text-sm text-gray-500 py-8 text-center border rounded-lg bg-gray-50">
                Recording not available
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
