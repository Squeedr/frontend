"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { createSession } from "@/lib/api/sessions"
import { useRole } from "@/hooks/use-role"

export function DebugSessionTest() {
  const { toast } = useToast()
  const { user } = useRole()
  const [isTestRunning, setIsTestRunning] = useState(false)
  const [testResults, setTestResults] = useState<string[]>([])

  const addLog = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
    console.log(message)
  }

  const runSessionTest = async () => {
    setIsTestRunning(true)
    setTestResults([])
    
    addLog("🧪 Starting session creation test...")

    // Check JWT token and decode it for more info
    const jwt = localStorage.getItem("squeedr-token") || localStorage.getItem("token")
    if (!jwt) {
      addLog("❌ No JWT token found in localStorage")
      addLog(`Available localStorage keys: ${JSON.stringify(Object.keys(localStorage))}`)
      setIsTestRunning(false)
      return
    }
    addLog("✅ JWT token found")
    
    // Try to decode JWT token (just the payload, not verifying signature)
    try {
      const tokenParts = jwt.split('.')
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]))
        addLog(`🔐 Token payload: ${JSON.stringify(payload, null, 2)}`)
        addLog(`👤 User ID: ${payload.id || 'Not found'}`)
        addLog(`⏰ Token expires: ${payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'Not specified'}`)
      }
    } catch (error) {
      addLog("⚠️ Could not decode JWT token payload")
    }

    // Check API URL
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api"
    addLog(`🔗 API URL: ${API_URL}`)

    // Test session data
    const testSessionData = {
      title: "Test Session",
      workspace: "Main Room",
      expertName: "Test Expert",
      expertId: "e-test123",
      clientName: "Test Client", 
      clientId: "c-test123",
      date: "2024-12-20",
      startTime: "14:00",
      endTime: "15:00",
      price: 100,
      status: "upcoming",
      notes: "This is a test session",
      recordingUrl: ""
    }

    addLog(`📋 Test data: ${JSON.stringify(testSessionData, null, 2)}`)

    try {
      addLog("🚀 Making API call...")
      const response = await createSession(testSessionData, jwt)
      addLog("✅ Session created successfully!")
      addLog(`📄 Response: ${JSON.stringify(response, null, 2)}`)
      
      toast({
        title: "Test Successful",
        description: "Session creation test passed!",
      })
    } catch (error: any) {
      addLog("❌ Session creation failed!")
      addLog(`Error: ${error.message}`)
      
      if (error.response) {
        addLog(`Status: ${error.response.status}`)
        addLog(`Response data: ${JSON.stringify(error.response.data, null, 2)}`)
        
        if (error.response.status === 403) {
          addLog("")
          addLog("🚫 403 FORBIDDEN ERROR - PERMISSION ISSUE")
          addLog("This means you're authenticated but don't have permission to create sessions.")
          addLog("")
          addLog("📋 TO FIX IN STRAPI BACKEND:")
          addLog("1. Go to Strapi Admin Panel → Settings → Users & Permissions Plugin → Roles")
          addLog("2. Select your user's role (probably 'Authenticated')")
          addLog("3. Find 'Session' in the permissions list")
          addLog("4. Check the 'create' permission for Session")
          addLog("5. Save the role")
          addLog("")
          addLog("🔍 ALTERNATIVE CHECKS:")
          addLog("- Verify the 'sessions' collection exists in Strapi")
          addLog("- Check if your user has the right role assigned")
          addLog("- Ensure the Strapi backend is properly configured")
        }
      }
      
      if (error.request) {
        addLog("Request was made but no response received")
        addLog(`Request: ${JSON.stringify(error.request, null, 2)}`)
      }
      
      toast({
        title: "Test Failed",
        description: error.response?.status === 403 ? "Permission denied - check Strapi permissions" : (error.message || "Session creation test failed"),
        variant: "destructive",
      })
    } finally {
      setIsTestRunning(false)
    }
  }

  const clearLogs = () => {
    setTestResults([])
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>🧪 Session Creation Debug Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={runSessionTest} 
            disabled={isTestRunning}
          >
            {isTestRunning ? "Running Test..." : "Run Session Test"}
          </Button>
          <Button 
            variant="outline" 
            onClick={clearLogs}
          >
            Clear Logs
          </Button>
        </div>
        
        {user && (
          <div className="text-sm text-muted-foreground">
            Current user: {user.username} (ID: {user.id})
          </div>
        )}
        
        {testResults.length > 0 && (
          <div className="bg-muted p-4 rounded-lg max-h-64 overflow-y-auto">
            <div className="text-sm font-mono space-y-1">
              {testResults.map((result, index) => (
                <div key={index}>{result}</div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 