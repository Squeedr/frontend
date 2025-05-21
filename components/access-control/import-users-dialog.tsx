"use client"

import type React from "react"

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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, AlertCircle } from "lucide-react"
import { csvToUsers } from "@/lib/csv-utils"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@/lib/mock-access"

interface ImportUsersDialogProps {
  onImportUsers: (users: Partial<User>[]) => void
}

export function ImportUsersDialog({ onImportUsers }: ImportUsersDialogProps) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<Partial<User>[]>([])
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Check file type
    if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
      setError("Please upload a CSV file")
      setFile(null)
      setPreview([])
      return
    }

    setFile(selectedFile)
    setError(null)

    try {
      // Read file content
      const text = await selectedFile.text()
      const users = csvToUsers(text)

      if (users.length === 0) {
        setError("No valid users found in the CSV file")
        return
      }

      // Show preview of first 5 users
      setPreview(users.slice(0, 5))
    } catch (err) {
      setError("Error reading CSV file")
      console.error(err)
    }
  }

  const handleImport = async () => {
    if (!file) return

    try {
      const text = await file.text()
      const users = csvToUsers(text)

      if (users.length === 0) {
        setError("No valid users found in the CSV file")
        return
      }

      onImportUsers(users)

      toast({
        title: "Users imported",
        description: `Successfully imported ${users.length} users`,
      })

      // Reset and close dialog
      setFile(null)
      setPreview([])
      setOpen(false)
    } catch (err) {
      setError("Error importing users")
      console.error(err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Import Users</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import users. The file should have columns for name, email, role, and status.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="csv-file">CSV File</Label>
            <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} />
            <p className="text-xs text-muted-foreground">CSV format: Name, Email, Role, Status</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {preview.length > 0 && (
            <div className="space-y-2">
              <Label>
                Preview ({preview.length} of {file ? "?" : 0} users)
              </Label>
              <div className="rounded-md border max-h-40 overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-2 text-left text-xs font-medium">Name</th>
                      <th className="p-2 text-left text-xs font-medium">Email</th>
                      <th className="p-2 text-left text-xs font-medium">Role</th>
                      <th className="p-2 text-left text-xs font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((user, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 text-xs">{user.name || "-"}</td>
                        <td className="p-2 text-xs">{user.email}</td>
                        <td className="p-2 text-xs capitalize">{user.role}</td>
                        <td className="p-2 text-xs capitalize">{user.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!file || preview.length === 0}>
            Import Users
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
