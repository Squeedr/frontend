"use client"

import { useState } from "react"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRole } from "@/hooks/use-role"

export function LogoThemeDemo() {
  const { role, setRole } = useRole()
  const [collapsed, setCollapsed] = useState(false)
  const [useRoleColors, setUseRoleColors] = useState(true)
  const [customColor, setCustomColor] = useState("#6d28d9")
  const [customBgColor, setCustomBgColor] = useState("#f5f3ff")

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Logo Theme Demo</CardTitle>
        <CardDescription>Preview the logo with different themes and settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-medium">Preview:</div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setCollapsed(!collapsed)}>
                {collapsed ? "Expand" : "Collapse"}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 border rounded-md bg-background">
            <Logo
              collapsed={collapsed}
              size="lg"
              useRoleColors={useRoleColors}
              color={!useRoleColors ? customColor : undefined}
              secondaryColor={!useRoleColors ? customBgColor : undefined}
            />
          </div>
        </div>

        <Tabs defaultValue="role">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="role">Role-Based Colors</TabsTrigger>
            <TabsTrigger value="custom">Custom Colors</TabsTrigger>
          </TabsList>

          <TabsContent value="role" className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={role === "owner" ? "default" : "outline"}
                onClick={() => setRole("owner")}
                className="w-full"
              >
                Owner
              </Button>
              <Button
                variant={role === "expert" ? "default" : "outline"}
                onClick={() => setRole("expert")}
                className="w-full"
              >
                Expert
              </Button>
              <Button
                variant={role === "client" ? "default" : "outline"}
                onClick={() => setRole("client")}
                className="w-full"
              >
                Client
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useRoleColors"
                checked={useRoleColors}
                onChange={() => setUseRoleColors(!useRoleColors)}
              />
              <label htmlFor="useRoleColors">Use role-based colors</label>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="textColor" className="text-sm font-medium">
                  Text Color
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    id="textColor"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="h-10 w-10"
                  />
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="bgColor" className="text-sm font-medium">
                  Background Color (for collapsed)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    id="bgColor"
                    value={customBgColor}
                    onChange={(e) => setCustomBgColor(e.target.value)}
                    className="h-10 w-10"
                  />
                  <input
                    type="text"
                    value={customBgColor}
                    onChange={(e) => setCustomBgColor(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
