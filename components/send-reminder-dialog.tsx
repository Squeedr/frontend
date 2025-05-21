"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface SendReminderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedInvoices: string[]
}

export function SendReminderDialog({ open, onOpenChange, selectedInvoices }: SendReminderDialogProps) {
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  const handleSendReminder = () => {
    setIsSending(true)

    // Simulate API call
    setTimeout(() => {
      setIsSending(false)
      onOpenChange(false)

      toast({
        title: "Reminder sent",
        description: `Reminder sent to ${selectedInvoices.length} invoice(s)`,
      })
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Payment Reminder</DialogTitle>
          <DialogDescription>Send a payment reminder to the client(s) for the selected invoice(s).</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>You are about to send a payment reminder for {selectedInvoices.length} invoice(s).</p>
          <p className="mt-2 text-sm text-gray-500">
            This will send an email to the client(s) reminding them to pay their outstanding invoice(s).
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendReminder} disabled={isSending}>
            {isSending ? "Sending..." : "Send Reminder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
