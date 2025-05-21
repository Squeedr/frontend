"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImportUsersDialog } from "./import-users-dialog"
import { ExportUsersDialog } from "./export-users-dialog"
import { CSVTemplateDialog } from "./csv-template-dialog"
import type { User } from "@/lib/mock-access"

interface ImportExportSectionProps {
  users: User[]
  onImportUsers: (users: Partial<User>[]) => void
}

export function ImportExportSection({ users, onImportUsers }: ImportExportSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Import & Export</CardTitle>
        <CardDescription>Import users from a CSV file or export current users to CSV.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Import Users</h3>
              <p className="text-xs text-muted-foreground">Upload a CSV file to import multiple users at once.</p>
            </div>
            <div className="flex items-center gap-2">
              <CSVTemplateDialog />
              <ImportUsersDialog onImportUsers={onImportUsers} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Export Users</h3>
              <p className="text-xs text-muted-foreground">Download current users as a CSV file.</p>
            </div>
            <ExportUsersDialog users={users} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
