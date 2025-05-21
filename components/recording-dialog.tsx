"use client"

import { useState, useEffect } from "react"
import { Play, Square, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import type { Session } from "@/lib/mock-data"

interface RecordingDialogProps {
  session: Session
  isOpen: boolean
  onClose: () => void
  onRecordingComplete: (sessionId: string, recordingUrl: string) => void
}

export function RecordingDialog({ session, isOpen, onClose, onRecordingComplete }: RecordingDialogProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  // Format timer as HH:MM:SS
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600)
      .toString()
      .padStart(2, "0")
    const minutes = Math.floor((time % 3600) / 60)
      .toString()
      .padStart(2, "0")
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0")
    return `${hours}:${minutes}:${seconds}`
  }

  // Handle timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRecording])

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setIsRecording(false)
      setTimer(0)
      setIsUploading(false)
    }
  }, [isOpen])

  const handleStartRecording = () => {
    setIsRecording(true)
    toast({
      title: "Recording started",
      description: "Session recording has begun",
    })
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    setIsUploading(true)

    // Simulate upload delay
    setTimeout(() => {
      const mockRecordingUrl = `/recordings/session-${session.id}-${Date.now()}.mp4`
      setIsUploading(false)
      onRecordingComplete(session.id, mockRecordingUrl)
      toast({
        title: "Recording complete",
        description: "Session recording has been saved",
      })
      onClose()
    }, 1500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record Session</DialogTitle>
          <DialogDescription>
            {session.title} with {session.expertName} and {session.clientName}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6 space-y-6">
          <div className="text-4xl font-mono font-bold">
            {isRecording && <span className="text-red-500 mr-2">●</span>}
            {formatTime(timer)}
          </div>

          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-gray-500">Saving recording...</p>
            </div>
          ) : (
            <Button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              variant={isRecording ? "destructive" : "default"}
              size="lg"
              className="w-40"
            >
              {isRecording ? (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start Recording
                </>
              )}
            </Button>
          )}
        </div>

        <div className="text-xs text-gray-500 text-center">
          {isRecording
            ? "Recording in progress. Click Stop when finished."
            : "Click Start Recording to begin capturing this session."}
        </div>
      </DialogContent>
    </Dialog>
  )
}
