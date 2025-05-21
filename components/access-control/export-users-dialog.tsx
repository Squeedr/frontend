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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Download } from "lucide-react"
import { usersToCSV, downloadCSV } from "@/lib/csv-utils"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@/lib/mock-access"

interface ExportUsersDialogProps {
  users: User[]
}

export function ExportUsersDialog({ users }: ExportUsersDialogProps) {
  const [open, setOpen] = useState(false)
  const [filename, setFilename] = useState("squeedr-users.csv")
  const [includeAll, setIncludeAll] = useState(true)
  const [includeActive, setIncludeActive] = useState(true)
  const [includeInvited, setIncludeInvited] = useState(true)
  const [includeSuspended, setIncludeSuspended] = useState(true)
  const { toast } = useToast()

  const handleExport = () => {
    // Filter users based on selected statuses
    let filteredUsers = users

    if (!includeAll) {
      filteredUsers = users.filter((user) => {
        if (user.status === "active" && includeActive) return true
        if (user.status === "invited" && includeInvited) return true
        if (user.status === "suspended" && includeSuspended) return true
        return false
      })
    }

    // Convert to CSV and download
    const csvContent = usersToCSV(filteredUsers)
    downloadCSV(csvContent, filename)

    toast({
      title: "Users exported",
      description: `Successfully exported ${filteredUsers.length} users to CSV`,
    })

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Users</DialogTitle>
          <DialogDescription>
            Export users to a CSV file. Select which users to include in the export.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="filename">Filename</Label>
            <Input id="filename" value={filename} onChange={(e) => setFilename(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Include Users</Label>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-all"
                checked={includeAll}
                onCheckedChange={(checked) => {
                  setIncludeAll(!!checked)
                  if (checked) {
                    setIncludeActive(true)
                    setIncludeInvited(true)
                    includeSuspended(true)
                  }
                }}
              />
              <Label htmlFor="include-all" className="text-sm font-normal">
                All Users ({users.length})
              </Label>
            </div>

            {!includeAll && (
              <div className="space-y-2 ml-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-active"
                    checked={includeActive}
                    onCheckedChange={(checked) => setIncludeActive(!!checked)}
                  />
                  <Label htmlFor="include-active" className="text-sm font-normal">
                    Active Users ({users.filter((u) => u.status === "active").length})
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-invited"
                    checked={includeInvited}
                    onCheckedChange={(checked) => setIncludeInvited(!!checked)}
                  />
                  <Label htmlFor="include-invited" className="text-sm font-normal">
                    Invited Users ({users.filter((u) => u.status === "invited").length})
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-suspended"
                    checked={includeSuspended}
                    onCheckedChange={(checked) => setIncludeSuspended(!!checked)}
                  />
                  <Label htmlFor="include-suspended" className="text-sm font-normal">
                    Suspended Users ({users.filter((u) => u.status === "suspended").length})
                  </Label>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport}>Export Users</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
