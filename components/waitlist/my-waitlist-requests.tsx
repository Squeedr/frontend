"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { Calendar, Clock, MapPin, Users, X, CheckCircle, Clock4 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { mockWaitlistRequests } from "@/lib/mock-waitlist-data"
import type { WaitlistRequest } from "@/lib/types/waitlist"

// Mock current user
const currentUser = {
  id: "u1",
  name: "Jane Smith",
  email: "jane@example.com",
  role: "expert",
}

export function MyWaitlistRequests() {
  const { toast } = useToast()
  const [waitlistRequests, setWaitlistRequests] = useState<WaitlistRequest[]>(
    mockWaitlistRequests.filter((request) => request.userId === currentUser.id),
  )

  // Filter active requests (pending or notified)
  const activeRequests = waitlistRequests.filter(
    (request) => request.status === "pending" || request.status === "notified",
  )

  // Filter past requests (fulfilled, expired, or cancelled)
  const pastRequests = waitlistRequests.filter((request) =>
    ["fulfilled", "expired", "cancelled"].includes(request.status),
  )

  const handleCancelRequest = async (requestId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update local state
      setWaitlistRequests(
        waitlistRequests.map((request) => (request.id === requestId ? { ...request, status: "cancelled" } : request)),
      )

      // Show success toast
      toast({
        title: "Request cancelled",
        description: "Your waitlist request has been cancelled.",
      })
    } catch (error) {
      toast({
        title: "Failed to cancel request",
        description: "There was an error cancelling your request. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAcceptNotification = async (requestId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update local state
      setWaitlistRequests(
        waitlistRequests.map((request) => (request.id === requestId ? { ...request, status: "fulfilled" } : request)),
      )

      // Show success toast
      toast({
        title: "Booking confirmed",
        description: "You've successfully claimed the available slot. Your booking is confirmed.",
      })
    } catch (error) {
      toast({
        title: "Failed to confirm booking",
        description: "There was an error confirming your booking. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Pending
          </Badge>
        )
      case "notified":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Available
          </Badge>
        )
      case "fulfilled":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Fulfilled
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Expired
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">My Waitlist Requests</h2>
        <p className="text-muted-foreground">Manage your workspace waitlist requests</p>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Requests ({activeRequests.length})</TabsTrigger>
          <TabsTrigger value="past">Past Requests ({pastRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeRequests.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeRequests.map((request) => (
                <Card key={request.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{request.workspaceName}</CardTitle>
                      {getStatusBadge(request.status)}
                    </div>
                    <CardDescription className="flex items-center text-xs">
                      <MapPin className="mr-1 h-3 w-3" />
                      {request.workspaceName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2">
                    <div className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{format(parseISO(request.date), "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {request.startTime} - {request.endTime}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{request.attendees} attendees</span>
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Purpose:</span> {request.purpose}
                    </div>
                    {request.notes && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Notes:</span> {request.notes}
                      </div>
                    )}

                    {request.status === "notified" && request.expiresAt && (
                      <Alert className="mt-3 bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800">Space Available!</AlertTitle>
                        <AlertDescription className="text-green-700">
                          This workspace is now available. You have until{" "}
                          {format(parseISO(request.expiresAt), "h:mm a")} to claim it.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    {request.status === "notified" ? (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleAcceptNotification(request.id)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Claim Spot
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500"
                          onClick={() => handleCancelRequest(request.id)}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Decline
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 ml-auto"
                        onClick={() => handleCancelRequest(request.id)}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel Request
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">You don't have any active waitlist requests.</p>
                <Button variant="link" asChild className="mt-2">
                  <a href="/dashboard/workspace/book-space">Book a workspace</a>
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastRequests.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastRequests.map((request) => (
                <Card key={request.id} className="overflow-hidden opacity-80">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{request.workspaceName}</CardTitle>
                      {getStatusBadge(request.status)}
                    </div>
                    <CardDescription className="flex items-center text-xs">
                      <MapPin className="mr-1 h-3 w-3" />
                      {request.workspaceName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2">
                    <div className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{format(parseISO(request.date), "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {request.startTime} - {request.endTime}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{request.attendees} attendees</span>
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Purpose:</span> {request.purpose}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <Clock4 className="mr-2 h-4 w-4 inline-block" />
                      Requested on {format(parseISO(request.requestedAt), "MMM d, yyyy")}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-end">
                    <Button variant="outline" size="sm" asChild>
                      <a href="/dashboard/workspace/book-space">Book Similar</a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">You don't have any past waitlist requests.</p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
