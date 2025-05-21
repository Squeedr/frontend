"use client"

import { useState } from "react"
import { useRole } from "@/hooks/use-role"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

export function RoleSpecificSettings() {
  const { role } = useRole()

  // Owner specific state
  const [autoApproveExperts, setAutoApproveExperts] = useState(false)
  const [autoAssignClients, setAutoAssignClients] = useState(true)
  const [analyticsLevel, setAnalyticsLevel] = useState("advanced")

  // Expert specific state
  const [autoAcceptSessions, setAutoAcceptSessions] = useState(false)
  const [visibilityLevel, setVisibilityLevel] = useState("public")
  const [maxClientsPerDay, setMaxClientsPerDay] = useState([5])

  // Client specific state
  const [autoConfirmSessions, setAutoConfirmSessions] = useState(true)
  const [preferredExpertLevel, setPreferredExpertLevel] = useState("all")
  const [receiveRecommendations, setReceiveRecommendations] = useState(true)

  const handleSaveOwnerSettings = () => {
    console.log("Saving owner settings:", {
      autoApproveExperts,
      autoAssignClients,
      analyticsLevel,
    })
  }

  const handleSaveExpertSettings = () => {
    console.log("Saving expert settings:", {
      autoAcceptSessions,
      visibilityLevel,
      maxClientsPerDay: maxClientsPerDay[0],
    })
  }

  const handleSaveClientSettings = () => {
    console.log("Saving client settings:", {
      autoConfirmSessions,
      preferredExpertLevel,
      receiveRecommendations,
    })
  }

  if (role === "owner") {
    return (
      <Card className="border-owner-light bg-gradient-to-br from-white to-owner-light/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Owner Settings</CardTitle>
            <Badge className="bg-owner-medium text-white">Owner Only</Badge>
          </div>
          <CardDescription>Configure settings specific to your owner role.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="auto-approve-experts" className="flex flex-col space-y-1">
              <span>Auto-approve new experts</span>
              <span className="font-normal text-sm text-muted-foreground">
                Automatically approve new expert registrations
              </span>
            </Label>
            <Switch id="auto-approve-experts" checked={autoApproveExperts} onCheckedChange={setAutoApproveExperts} />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="auto-assign-clients" className="flex flex-col space-y-1">
              <span>Auto-assign clients to experts</span>
              <span className="font-normal text-sm text-muted-foreground">
                Automatically assign new clients to available experts
              </span>
            </Label>
            <Switch id="auto-assign-clients" checked={autoAssignClients} onCheckedChange={setAutoAssignClients} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="analytics-level">Analytics Detail Level</Label>
            <Select value={analyticsLevel} onValueChange={setAnalyticsLevel}>
              <SelectTrigger id="analytics-level">
                <SelectValue placeholder="Select analytics level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="comprehensive">Comprehensive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="platform-fee">Platform Fee Percentage</Label>
            <Input id="platform-fee" type="number" min="0" max="100" defaultValue="15" />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveOwnerSettings} className="bg-owner-DEFAULT hover:bg-owner-dark text-white">
            Save Owner Settings
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (role === "expert") {
    return (
      <Card className="border-expert-light bg-gradient-to-br from-white to-expert-light/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Expert Settings</CardTitle>
            <Badge className="bg-expert-medium text-white">Expert Only</Badge>
          </div>
          <CardDescription>Configure settings specific to your expert role.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="auto-accept-sessions" className="flex flex-col space-y-1">
              <span>Auto-accept session requests</span>
              <span className="font-normal text-sm text-muted-foreground">
                Automatically accept session requests from clients
              </span>
            </Label>
            <Switch id="auto-accept-sessions" checked={autoAcceptSessions} onCheckedChange={setAutoAcceptSessions} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visibility-level">Profile Visibility</Label>
            <Select value={visibilityLevel} onValueChange={setVisibilityLevel}>
              <SelectTrigger id="visibility-level">
                <SelectValue placeholder="Select visibility level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Visible to all</SelectItem>
                <SelectItem value="platform">Platform - Only visible within Squeedr</SelectItem>
                <SelectItem value="clients">Clients - Only visible to your clients</SelectItem>
                <SelectItem value="private">Private - By invitation only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="max-clients">Maximum Clients Per Day</Label>
              <span className="text-sm font-medium">{maxClientsPerDay[0]}</span>
            </div>
            <Slider
              id="max-clients"
              min={1}
              max={20}
              step={1}
              value={maxClientsPerDay}
              onValueChange={setMaxClientsPerDay}
              className="[&>span:first-child]:bg-expert-medium"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourly-rate">Hourly Rate ($)</Label>
            <Input id="hourly-rate" type="number" min="0" defaultValue="150" />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveExpertSettings} className="bg-expert-DEFAULT hover:bg-expert-dark text-white">
            Save Expert Settings
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (role === "client") {
    return (
      <Card className="border-client-light bg-gradient-to-br from-white to-client-light/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Client Settings</CardTitle>
            <Badge className="bg-client-medium text-white">Client Only</Badge>
          </div>
          <CardDescription>Configure settings specific to your client role.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="auto-confirm-sessions" className="flex flex-col space-y-1">
              <span>Auto-confirm scheduled sessions</span>
              <span className="font-normal text-sm text-muted-foreground">
                Automatically confirm scheduled sessions with experts
              </span>
            </Label>
            <Switch id="auto-confirm-sessions" checked={autoConfirmSessions} onCheckedChange={setAutoConfirmSessions} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferred-expert-level">Preferred Expert Level</Label>
            <Select value={preferredExpertLevel} onValueChange={setPreferredExpertLevel}>
              <SelectTrigger id="preferred-expert-level">
                <SelectValue placeholder="Select preferred expert level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="junior">Junior Experts</SelectItem>
                <SelectItem value="mid">Mid-Level Experts</SelectItem>
                <SelectItem value="senior">Senior Experts</SelectItem>
                <SelectItem value="principal">Principal Experts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="receive-recommendations" className="flex flex-col space-y-1">
              <span>Receive expert recommendations</span>
              <span className="font-normal text-sm text-muted-foreground">
                Receive personalized expert recommendations based on your needs
              </span>
            </Label>
            <Switch
              id="receive-recommendations"
              checked={receiveRecommendations}
              onCheckedChange={setReceiveRecommendations}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget-limit">Monthly Budget Limit ($)</Label>
            <Input id="budget-limit" type="number" min="0" defaultValue="2000" />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveClientSettings} className="bg-client-DEFAULT hover:bg-client-dark text-white">
            Save Client Settings
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return null
}
