"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { PermissionRequest } from "@/lib/mock-permission-requests"
import { formatDistanceToNow } from "date-fns"
import { CheckCircle, Clock, XCircle, Filter, User } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ManagePermissionRequestsProps {
  requests: PermissionRequest[]
  onUpdateRequest: (requestId: string, status: "approved" | "denied", reason: string) => void
}

export function ManagePermissionRequests({ requests, onUpdateRequest }: ManagePermissionRequestsProps) {
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedRequest, setSelectedRequest] = useState<PermissionRequest | null>(null)
  const [responseReason, setResponseReason] = useState("")
  const [responseAction, setResponseAction] = useState<"approve" | "deny" | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  const filteredRequests = requests.filter((request) => {
    if (activeTab === "all") return true
    return request.status === activeTab
  })

  const handleApprove = (request: PermissionRequest) => {
    setSelectedRequest(request)
    setResponseAction("approve")
    setResponseReason("")
    setDialogOpen(true)
  }

  const handleDeny = (request: PermissionRequest) => {
    setSelectedRequest(request)
    setResponseAction("deny")
    setResponseReason("")
    setDialogOpen(true)
  }

  const handleSubmitResponse = () => {
    if (!selectedRequest || !responseAction) return

    if (!responseReason.trim()) {
      toast({
        title: "Response reason required",
        description: "Please provide a reason for your decision",
        variant: "destructive",
      })
      return
    }

    onUpdateRequest(selectedRequest.id, responseAction === "approve" ? "approved" : "denied", responseReason.trim())

    toast({
      title: `Request ${responseAction === "approve" ? "approved" : "denied"}`,
      description: `You have ${responseAction === "approve" ? "approved" : "denied"} the permission request from ${selectedRequest.userName}`,
    })

    setDialogOpen(false)
    setSelectedRequest(null)
    setResponseReason("")
    setResponseAction(null)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Permission Requests</CardTitle>
            <CardDescription>Review and manage permission requests from users</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" /> Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setActiveTab("all")}>All Requests</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("pending")}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("approved")}>Approved</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("denied")}>Denied</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="denied">Denied</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-6">
                <Clock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  No {activeTab !== "all" ? activeTab : ""} permission requests found.
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {filteredRequests.map((request) => (
                    <div key={request.id} className="rounded-lg border p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">
                              {request.userName} <span className="text-muted-foreground">({request.userEmail})</span>
                            </h3>
                            <StatusBadge status={request.status} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Requested {formatDistanceToNow(new Date(request.requestDate), { addSuffix: true })}
                          </p>
                        </div>
                        {request.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600"
                              onClick={() => handleApprove(request)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600"
                              onClick={() => handleDeny(request)}
                            >
                              <XCircle className="h-4 w-4 mr-1" /> Deny
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-1">Requested Permissions:</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {request.requestedPermissions.map((permission) => (
                            <Badge key={permission} variant="outline">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-1">Reason:</h4>
                        <p className="text-sm">{request.reason}</p>
                      </div>

                      {request.status !== "pending" && request.responseReason && (
                        <div className="mt-3 pt-3 border-t">
                          <h4 className="text-sm font-medium mb-1">Response:</h4>
                          <p className="text-sm">{request.responseReason}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            By {request.responseBy} •{" "}
                            {formatDistanceToNow(new Date(request.responseDate!), { addSuffix: true })}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Response Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{responseAction === "approve" ? "Approve" : "Deny"} Permission Request</DialogTitle>
            <DialogDescription>
              {responseAction === "approve"
                ? "Provide a reason for approving this permission request."
                : "Provide a reason for denying this permission request."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">User</h3>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>
                  {selectedRequest?.userName} ({selectedRequest?.userEmail})
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Requested Permissions</h3>
              <div className="flex flex-wrap gap-1.5">
                {selectedRequest?.requestedPermissions.map((permission) => (
                  <Badge key={permission} variant="outline">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">User&apos;s Reason</h3>
              <p className="text-sm">{selectedRequest?.reason}</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="response-reason" className="text-sm font-medium">
                Your Response
              </label>
              <Textarea
                id="response-reason"
                placeholder={`Reason for ${responseAction === "approve" ? "approving" : "denying"} this request...`}
                value={responseReason}
                onChange={(e) => setResponseReason(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitResponse} variant={responseAction === "approve" ? "default" : "destructive"}>
              {responseAction === "approve" ? "Approve Request" : "Deny Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

function StatusBadge({ status }: { status: "pending" | "approved" | "denied" }) {
  if (status === "pending") {
    return (
      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
        <Clock className="h-3 w-3 mr-1" /> Pending
      </Badge>
    )
  }

  if (status === "approved") {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <CheckCircle className="h-3 w-3 mr-1" /> Approved
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
      <XCircle className="h-3 w-3 mr-1" /> Denied
    </Badge>
  )
}
