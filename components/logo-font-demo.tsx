"use client"

import { useState } from "react"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRole } from "@/hooks/use-role"

export function LogoFontDemo() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { role, setRole } = useRole()

  return (
    <div className="container mx-auto py-10 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Logo Font Demo</CardTitle>
          <CardDescription>See how the custom Montserrat font enhances the Squeedr logo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-8 items-center">
            <div className="flex items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm w-full">
              <Logo size="xl" collapsed={isCollapsed} useRoleColors={true} />
            </div>

            <div className="flex gap-4">
              <Button onClick={() => setIsCollapsed(!isCollapsed)} variant="outline">
                {isCollapsed ? "Expand Logo" : "Collapse Logo"}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="owner">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="owner" onClick={() => setRole("owner")}>
                Owner
              </TabsTrigger>
              <TabsTrigger value="expert" onClick={() => setRole("expert")}>
                Expert
              </TabsTrigger>
              <TabsTrigger value="client" onClick={() => setRole("client")}>
                Client
              </TabsTrigger>
            </TabsList>

            <TabsContent value="owner" className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-medium">Owner Theme</h3>
                  <p className="text-sm text-muted-foreground">Blue theme with custom Montserrat font</p>
                </div>
                <div className="flex gap-4">
                  <Logo size="md" collapsed={false} useRoleColors={true} />
                  <Logo size="md" collapsed={true} useRoleColors={true} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="expert" className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-medium">Expert Theme</h3>
                  <p className="text-sm text-muted-foreground">Green theme with custom Montserrat font</p>
                </div>
                <div className="flex gap-4">
                  <Logo size="md" collapsed={false} useRoleColors={true} />
                  <Logo size="md" collapsed={true} useRoleColors={true} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="client" className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-medium">Client Theme</h3>
                  <p className="text-sm text-muted-foreground">Purple theme with custom Montserrat font</p>
                </div>
                <div className="flex gap-4">
                  <Logo size="md" collapsed={false} useRoleColors={true} />
                  <Logo size="md" collapsed={true} useRoleColors={true} />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Small</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Logo size="sm" collapsed={isCollapsed} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Medium</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Logo size="md" collapsed={isCollapsed} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Large</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Logo size="lg" collapsed={isCollapsed} />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
