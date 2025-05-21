"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnhancedBookingForm } from "@/components/expert/enhanced-booking-form"
import { ExpertBookingsManager } from "@/components/workspace/expert-bookings-manager"
import { PermissionGuard } from "@/components/guards/permission-guard"
import { useRole } from "@/hooks/use-role"

export default function BookSpacePage() {
  const { role } = useRole()
  const [activeTab, setActiveTab] = useState("book")

  const isExpert = role === "expert" || role === "owner"

  return (
    <PermissionGuard allowedRoles={["owner", "expert", "client"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Workspace Booking</h1>
          <p className="text-muted-foreground mt-1">Book and manage workspace reservations</p>
        </div>

        <Tabs defaultValue="book" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="book">Book Space</TabsTrigger>
            {isExpert && <TabsTrigger value="manage">My Bookings</TabsTrigger>}
          </TabsList>
          <TabsContent value="book" className="mt-6">
            <EnhancedBookingForm />
          </TabsContent>
          {isExpert && (
            <TabsContent value="manage" className="mt-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">My Upcoming Bookings</h2>
                  <p className="text-muted-foreground">View and manage your workspace reservations</p>
                </div>
                <ExpertBookingsManager />
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </PermissionGuard>
  )
}
