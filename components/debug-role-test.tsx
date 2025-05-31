"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRole } from "@/hooks/use-role"

export function DebugRoleTest() {
  const { role, user, availableRoles, selectRole, switchRole, needsRoleSelection, isLoading } = useRole()
  const [testResults, setTestResults] = useState<string[]>([])

  const addLog = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
    console.log(message)
  }

  const testRoleSelection = (testRole: "owner" | "expert" | "client") => {
    addLog(`🧪 Testing role selection: ${testRole}`)
    addLog(`📊 Current role before: ${role || "null"}`)
    addLog(`📊 Available roles: ${JSON.stringify(availableRoles)}`)
    addLog(`📊 Needs role selection: ${needsRoleSelection}`)
    
    selectRole(testRole)
    
    // Check after a short delay
    setTimeout(() => {
      const currentRole = localStorage.getItem("squeedr-user-role")
      addLog(`📊 Role in localStorage after selection: ${currentRole}`)
      addLog(`📊 Current role state after: ${role || "null"}`)
    }, 200)
  }

  const testRegistration = async (testRole: "owner" | "expert" | "client") => {
    addLog(`🧪 Testing registration with role: ${testRole}`)
    
    try {
      const testUser = {
        username: `test_${testRole}_${Date.now()}`,
        email: `test_${testRole}_${Date.now()}@example.com`,
        password: "testpassword123",
        role: testRole
      }
      
      addLog(`📤 Sending registration request: ${JSON.stringify(testUser)}`)
      
      // Import the registerUser function
      const { registerUser } = await import("@/lib/api/auth")
      const response = await registerUser(testUser)
      
      addLog(`📥 Registration response: ${JSON.stringify(response)}`)
      addLog(`👤 User app_roles: ${JSON.stringify(response.user?.app_roles)}`)
      addLog(`🎯 First role: ${response.user?.app_roles?.[0]?.name || "none"}`)
      
    } catch (error: any) {
      addLog(`❌ Registration failed: ${error.message}`)
      addLog(`📋 Error details: ${JSON.stringify(error.response?.data)}`)
    }
  }

  const clearLogs = () => {
    setTestResults([])
  }

  const clearRoleData = () => {
    localStorage.removeItem("squeedr-user-role")
    localStorage.removeItem("squeedr-user-selected-roles")
    localStorage.removeItem("squeedr-available-roles")
    addLog("🧹 Cleared all role data from localStorage")
    addLog("🔄 Please refresh the page to test first-time role selection")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🔍 Role Selection Debug Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current State */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Current Role</p>
              <Badge variant="outline" className="mt-1">
                {role || "Loading..."}
              </Badge>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">User</p>
              <Badge variant="outline" className="mt-1">
                {user?.username || "Not logged in"}
              </Badge>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Available Roles</p>
              <Badge variant="outline" className="mt-1">
                {availableRoles.length}
              </Badge>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Needs Selection</p>
              <Badge variant={needsRoleSelection ? "destructive" : "default"} className="mt-1">
                {needsRoleSelection ? "Yes" : "No"}
              </Badge>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => testRoleSelection("owner")}
              variant="outline"
              className="bg-blue-50 hover:bg-blue-100"
            >
              Test Owner Role
            </Button>
            <Button 
              onClick={() => testRoleSelection("expert")}
              variant="outline"
              className="bg-green-50 hover:bg-green-100"
            >
              Test Expert Role
            </Button>
            <Button 
              onClick={() => testRoleSelection("client")}
              variant="outline"
              className="bg-purple-50 hover:bg-purple-100"
            >
              Test Client Role
            </Button>
            <Button onClick={clearLogs} variant="outline">
              Clear Logs
            </Button>
            <Button onClick={clearRoleData} variant="destructive">
              Reset Role Data
            </Button>
          </div>

          {/* Test Registration Buttons */}
          <div className="space-y-2">
            <h4 className="font-semibold">Test New Registration Endpoint:</h4>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => testRegistration("owner")}
                variant="outline"
                className="bg-blue-50 hover:bg-blue-100"
                size="sm"
              >
                🧪 Test Owner Registration
              </Button>
              <Button 
                onClick={() => testRegistration("expert")}
                variant="outline"
                className="bg-green-50 hover:bg-green-100"
                size="sm"
              >
                🧪 Test Expert Registration
              </Button>
              <Button 
                onClick={() => testRegistration("client")}
                variant="outline"
                className="bg-purple-50 hover:bg-purple-100"
                size="sm"
              >
                🧪 Test Client Registration
              </Button>
            </div>
          </div>

          {/* LocalStorage Debug */}
          <div className="space-y-2">
            <h4 className="font-semibold">LocalStorage Debug:</h4>
            <div className="text-sm space-y-1 font-mono bg-gray-50 p-3 rounded">
              <div>squeedr-user-role: {localStorage.getItem("squeedr-user-role") || "null"}</div>
              <div>squeedr-user-selected-roles: {localStorage.getItem("squeedr-user-selected-roles") || "null"}</div>
              <div>squeedr-available-roles: {localStorage.getItem("squeedr-available-roles") || "null"}</div>
              <div>squeedr-user: {localStorage.getItem("squeedr-user") ? "exists" : "null"}</div>
              <div>squeedr-token: {localStorage.getItem("squeedr-token") ? "exists" : "null"}</div>
            </div>
            
            {/* Owner Role Specific Test */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <h5 className="font-semibold text-blue-900 mb-2">🔍 Owner Role Issue Debug</h5>
              <div className="text-sm space-y-1">
                <div>Current Role State: <span className="font-mono">{role || "null"}</span></div>
                <div>Is Loading: <span className="font-mono">{isLoading ? "true" : "false"}</span></div>
                <div>Available Roles: <span className="font-mono">[{availableRoles.join(", ")}]</span></div>
                <div>Needs Selection: <span className="font-mono">{needsRoleSelection ? "true" : "false"}</span></div>
                <div>User App Roles: <span className="font-mono">
                  {user?.app_roles ? JSON.stringify(user.app_roles) : "null"}
                </span></div>
                <div>First App Role: <span className="font-mono">
                  {user?.app_roles?.[0]?.name || "null"}
                </span></div>
              </div>
              <Button 
                onClick={() => {
                  addLog("🔍 OWNER ROLE TEST - Setting role to owner")
                  addLog(`Before: role=${role}, localStorage=${localStorage.getItem("squeedr-user-role")}`)
                  addLog(`User app_roles: ${user?.app_roles ? JSON.stringify(user.app_roles) : "null"}`)
                  selectRole("owner")
                  setTimeout(() => {
                    addLog(`After: role=${role}, localStorage=${localStorage.getItem("squeedr-user-role")}`)
                  }, 300)
                }}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                🧪 Test Owner Role Fix
              </Button>
            </div>
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">Test Results:</h4>
              <div className="max-h-60 overflow-y-auto bg-gray-50 p-3 rounded text-sm font-mono space-y-1">
                {testResults.map((result, index) => (
                  <div key={index}>{result}</div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 