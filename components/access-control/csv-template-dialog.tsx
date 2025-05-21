"use client"

import { useState } from "react"
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
import { FileText } from "lucide-react"
import { downloadCSV } from "@/lib/csv-utils"

export function CSVTemplateDialog() {
  const [open, setOpen] = useState(false)

  const handleDownloadTemplate = () => {
    const templateContent = `Name,Email,Role,Status
John Doe,john@example.com,expert,active
Jane Smith,jane@example.com,client,invited
Michael Johnson,michael@example.com,client,active`

    downloadCSV(templateContent, "user-import-template.csv")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1">
          <FileText className="h-4 w-4" />
          Template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>CSV Template</DialogTitle>
          <DialogDescription>Download a CSV template for importing users.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm">The CSV file should have the following columns:</p>
          <ul className="list-disc list-inside text-sm mt-2 space-y-1">
            <li>
              <strong>Name</strong> - User's full name
            </li>
            <li>
              <strong>Email</strong> - User's email address (required)
            </li>
            <li>
              <strong>Role</strong> - User's role (owner, expert, client, custom)
            </li>
            <li>
              <strong>Status</strong> - User's status (active, invited, suspended)
            </li>
          </ul>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDownloadTemplate}>Download Template</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
