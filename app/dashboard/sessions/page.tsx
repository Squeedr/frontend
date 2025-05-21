"use client"

import { useState } from "react"
import { Calendar, Clock, DollarSign, MoreHorizontal, User, Video, Eye } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchFilter } from "@/components/search-filter"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRole } from "@/hooks/use-role"
import { sessions as initialSessions, filterOptions } from "@/lib/mock-data"
import type { Session } from "@/lib/mock-data"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RecordingDialog } from "@/components/recording-dialog"
import { SessionDetailsDialog } from "@/components/session-details-dialog"
import { Badge } from "@/components/ui/badge"

export default function SessionsPage() {
  const { role } = useRole()
  const [sessions, setSessions] = useState<Session[]>(initialSessions)
  const [filteredSessions, setFilteredSessions] = useState<Session[]>(initialSessions)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [isRecordingDialogOpen, setIsRecordingDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredSessions(sessions)
      return
    }

    const filtered = sessions.filter(
      (session) =>
        session.title.toLowerCase().includes(query.toLowerCase()) ||
        session.expertName.toLowerCase().includes(query.toLowerCase()) ||
        session.clientName.toLowerCase().includes(query.toLowerCase()),
    )

    setFilteredSessions(filtered)
  }

  const handleFilter = (filters: any) => {
    let filtered = [...sessions]

    if (filters.workspace) {
      filtered = filtered.filter((session) => session.workspace === filters.workspace)
    }

    if (filters.status) {
      filtered = filtered.filter((session) => session.status === filters.status)
    }

    // Date range filtering would go here

    setFilteredSessions(filtered)
  }

  const handleRecordingComplete = (sessionId: string, recordingUrl: string) => {
    const updatedSessions = sessions.map((session) =>
      session.id === sessionId ? { ...session, recordingUrl, status: "completed" as const } : session,
    )

    setSessions(updatedSessions)
    setFilteredSessions(updatedSessions)
  }

  const openRecordingDialog = (session: Session) => {
    setSelectedSession(session)
    setIsRecordingDialogOpen(true)
  }

  const openDetailsDialog = (session: Session) => {
    setSelectedSession(session)
    setIsDetailsDialogOpen(true)
  }

  const canRecordSession = (session: Session) => {
    return (role === "owner" || role === "expert") && session.status === "in-progress"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchFilter
          onSearch={handleSearch}
          onFilter={handleFilter}
          filterOptions={{
            workspaces: filterOptions.workspaces,
            statuses: filterOptions.statuses,
            dateRanges: filterOptions.dateRanges,
          }}
          exportOptions={{
            csv: true,
            ics: true,
          }}
        />

        {role === "owner" && <Button className="bg-black hover:bg-gray-800 text-white">Create Session</Button>}
      </div>

      <div className="grid gap-4">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <Card key={session.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{session.title}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openDetailsDialog(session)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {role !== "client" && <DropdownMenuItem>Edit Session</DropdownMenuItem>}
                      <DropdownMenuItem>Send Message</DropdownMenuItem>
                      {role === "owner" && <DropdownMenuItem className="text-red-600">Cancel Session</DropdownMenuItem>}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
                  <div className="flex items-center gap-2">
                    {session.recordingUrl ? (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        <Video className="h-3 w-3" />
                        Recorded
                      </Badge>
                    ) : canRecordSession(session) ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                              onClick={() => openRecordingDialog(session)}
                            >
                              <Video className="h-3 w-3" />
                              Record
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Start recording this session</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : null}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <p className="text-sm font-medium">${session.price}</p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      session.status === "upcoming"
                        ? "bg-blue-100 text-blue-800"
                        : session.status === "in-progress"
                          ? "bg-green-100 text-green-800"
                          : session.status === "completed"
                            ? "bg-gray-100 text-gray-800"
                            : session.status === "recording"
                              ? "bg-red-100 text-red-800"
                              : "bg-red-100 text-red-800"
                    }`}
                  >
                    {session.status === "recording"
                      ? "Recording"
                      : session.status.charAt(0).toUpperCase() + session.status.slice(1).replace(/-/g, " ")}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No sessions found</p>
          </div>
        )}
      </div>

      {/* Recording Dialog */}
      {selectedSession && (
        <RecordingDialog
          session={selectedSession}
          isOpen={isRecordingDialogOpen}
          onClose={() => setIsRecordingDialogOpen(false)}
          onRecordingComplete={handleRecordingComplete}
        />
      )}

      {/* Session Details Dialog */}
      <SessionDetailsDialog
        session={selectedSession}
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
      />
    </div>
  )
}
