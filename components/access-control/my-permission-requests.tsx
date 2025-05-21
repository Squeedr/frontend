"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { PermissionRequest } from "@/lib/mock-permission-requests"
import { formatDistanceToNow } from "date-fns"
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RequestPermissionDialog } from "./request-permission-dialog"
import { v4 as uuidv4 } from "uuid"

interface MyPermissionRequestsProps {
  requests: PermissionRequest[]
  onRequestPermission: (request: PermissionRequest) => void
}

export function MyPermissionRequests({ requests, onRequestPermission }: MyPermissionRequestsProps) {
  const handleNewRequest = (requestData: {
    userId: string
    userName: string
    userEmail: string
    requestedPermissions: string[]
    reason: string
  }) => {
    const newRequest: PermissionRequest = {
      id: uuidv4(),
      userId: requestData.userId,
      userName: requestData.userName,
      userEmail: requestData.userEmail,
      requestedPermissions: requestData.requestedPermissions,
      reason: requestData.reason,
      status: "pending",
      requestDate: new Date().toISOString(),
    }

    onRequestPermission(newRequest)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>My Permission Requests</CardTitle>
            <CardDescription>View and manage your permission requests</CardDescription>
          </div>
          <RequestPermissionDialog onRequestPermission={handleNewRequest} />
        </div>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-6">
            <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">You haven&apos;t made any permission requests yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Use the &quot;Request Permissions&quot; button to request additional access.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[320px] pr-4">
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="rounded-lg border p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">
                          {request.requestedPermissions.length} Permission
                          {request.requestedPermissions.length !== 1 && "s"} Requested
                        </h3>
                        <StatusBadge status={request.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Requested {formatDistanceToNow(new Date(request.requestDate), { addSuffix: true })}
                      </p>
                    </div>
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
      </CardContent>
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
