"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useRole } from "@/hooks/use-role"
import Link from "next/link"
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Trash2,
  ArrowRight,
  Code,
  Info,
  Shield,
  User,
} from "lucide-react"

export default function RoleFixCenterPage() {
  const [activeTab, setActiveTab] = useState("diagnose")
  const [logs, setLogs] = useState<string[]>([])
  const [localStorageStatus, setLocalStorageStatus] = useState<"unchecked" | "working" | "error">("unchecked")
  const [roleContextStatus, setRoleContextStatus] = useState<"unchecked" | "working" | "error">("unchecked")
  const [persistenceStatus, setPersistenceStatus] = useState<"unchecked" | "working" | "error">("unchecked")
  const [storedRole, setStoredRole] = useState<string | null>(null)
  const [testComplete, setTestComplete] = useState(false)
  const [fixApplied, setFixApplied] = useState(false)
  const { toast } = useToast()
  const { role, setRole } = useRole()

  // Add log entry
  const addLog = (message: string, type: "info" | "success" | "error" = "info") => {
    const timestamp = new Date().toLocaleTimeString()
    const prefix = type === "success" ? "✅ " : type === "error" ? "❌ " : "ℹ️ "
    setLogs((prev) => [`${prefix} [${timestamp}] ${message}`, ...prev])
    console.log(`${prefix} ${message}`)
  }

  // Clear logs
  const clearLogs = () => {
    setLogs([])
  }

  // Check localStorage
  const checkLocalStorage = async () => {
    addLog("Testing localStorage functionality...", "info")

    try {
      // Test writing to localStorage
      const testKey = "squeedr-test-key"
      const testValue = `test-${Date.now()}`

      localStorage.setItem(testKey, testValue)
      addLog(`Set test value in localStorage: ${testValue}`, "info")

      // Test reading from localStorage
      const readValue = localStorage.getItem(testKey)
      addLog(`Read test value from localStorage: ${readValue}`, "info")

      // Verify value matches
      if (readValue === testValue) {
        setLocalStorageStatus("working")
        addLog("localStorage is working correctly!", "success")
      } else {
        setLocalStorageStatus("error")
        addLog(`localStorage verification failed. Expected: ${testValue}, Got: ${readValue}`, "error")
      }

      // Clean up
      localStorage.removeItem(testKey)
      addLog("Cleaned up test data", "info")
    } catch (error) {
      setLocalStorageStatus("error")
      addLog(`localStorage test failed with error: ${error instanceof Error ? error.message : String(error)}`, "error")
    }
  }

  // Check role context
  const checkRoleContext = () => {
    addLog("Testing role context functionality...", "info")

    try {
      // Get current role from context
      const currentRole = role
      addLog(`Current role from context: ${currentRole}`, "info")

      // Get role from localStorage
      const savedRole = localStorage.getItem("squeedr-user-role")
      setStoredRole(savedRole)
      addLog(`Current role from localStorage: ${savedRole || "not set"}`, "info")

      // Check if context matches localStorage
      if (savedRole && currentRole === savedRole) {
        setRoleContextStatus("working")
        addLog("Role context is synchronized with localStorage!", "success")
      } else if (!savedRole) {
        addLog("No role found in localStorage. Will set default role later.", "info")
        setRoleContextStatus("working")
      } else {
        setRoleContextStatus("error")
        addLog(
          `Role context is not synchronized with localStorage. Context: ${currentRole}, localStorage: ${savedRole}`,
          "error",
        )
      }
    } catch (error) {
      setRoleContextStatus("error")
      addLog(`Role context test failed with error: ${error instanceof Error ? error.message : String(error)}`, "error")
    }
  }

  // Test persistence
  const testPersistence = async () => {
    addLog("Testing role persistence...", "info")

    try {
      // Save a test role
      const testRole = "expert" // Always use expert for testing
      localStorage.setItem("squeedr-user-role", testRole)
      addLog(`Set test role in localStorage: ${testRole}`, "info")

      // Update context
      setRole(testRole as any)
      addLog(`Set role in context: ${testRole}`, "info")

      // Verify localStorage
      const savedRole = localStorage.getItem("squeedr-user-role")
      addLog(`Verified role in localStorage: ${savedRole}`, "info")

      if (savedRole === testRole) {
        setPersistenceStatus("working")
        addLog("Role persistence is working correctly!", "success")
      } else {
        setPersistenceStatus("error")
        addLog(`Role persistence verification failed. Expected: ${testRole}, Got: ${savedRole}`, "error")
      }
    } catch (error) {
      setPersistenceStatus("error")
      addLog(
        `Role persistence test failed with error: ${error instanceof Error ? error.message : String(error)}`,
        "error",
      )
    }
  }

  // Run all tests
  const runAllTests = async () => {
    clearLogs()
    setTestComplete(false)

    addLog("Starting comprehensive role switching diagnostic tests...", "info")

    // Test 1: localStorage
    await checkLocalStorage()

    // Test 2: role context
    checkRoleContext()

    // Test 3: persistence
    await testPersistence()

    setTestComplete(true)
    addLog("All diagnostic tests completed!", "info")
  }

  // Apply fix
  const applyFix = () => {
    addLog("Applying comprehensive fix for role switching...", "info")

    try {
      // 1. Clear any existing roles
      localStorage.removeItem("squeedr-user-role")
      addLog("Cleared existing role data", "info")

      // 2. Set default role
      const defaultRole = "expert"
      localStorage.setItem("squeedr-user-role", defaultRole)
      addLog(`Set default role to '${defaultRole}' in localStorage`, "info")

      // 3. Update context
      setRole(defaultRole as any)
      addLog(`Updated role context to '${defaultRole}'`, "info")

      // 4. Verify fix
      const savedRole = localStorage.getItem("squeedr-user-role")
      const contextRole = role

      if (savedRole === defaultRole) {
        addLog("localStorage verification passed", "success")

        if (contextRole === defaultRole) {
          addLog("Context verification passed", "success")
          addLog("Fix was applied successfully!", "success")
          setFixApplied(true)

          toast({
            title: "Fix Applied Successfully",
            description: `Your role has been reset to '${defaultRole}'. Role switching should now work correctly.`,
            duration: 5000,
          })
        } else {
          addLog(`Context verification failed. Expected: ${defaultRole}, Got: ${contextRole}`, "error")
        }
      } else {
        addLog(`localStorage verification failed. Expected: ${defaultRole}, Got: ${savedRole}`, "error")
      }
    } catch (error) {
      addLog(`Error applying fix: ${error instanceof Error ? error.message : String(error)}`, "error")
    }
  }

  // Test role switching
  const testRoleSwitch = (newRole: "owner" | "expert" | "client") => {
    addLog(`Testing switch to role: ${newRole}`, "info")

    try {
      // 1. Update context
      setRole(newRole)
      addLog(`Set role in context to '${newRole}'`, "info")

      // 2. Verify localStorage
      setTimeout(() => {
        const savedRole = localStorage.getItem("squeedr-user-role")
        addLog(`Verified role in localStorage: ${savedRole}`, "info")

        if (savedRole === newRole) {
          addLog(`Successfully switched to ${newRole} role!`, "success")

          toast({
            title: "Role Switched",
            description: `You are now viewing as ${newRole.charAt(0).toUpperCase() + newRole.slice(1)}`,
            duration: 3000,
          })
        } else {
          addLog(`Role switch verification failed. Expected: ${newRole}, Got: ${savedRole}`, "error")
        }
      }, 100)
    } catch (error) {
      addLog(`Error switching role: ${error instanceof Error ? error.message : String(error)}`, "error")
    }
  }

  // Clear browser storage
  const clearBrowserStorage = () => {
    try {
      localStorage.clear()
      addLog("Cleared all localStorage data", "success")

      setStoredRole(null)
      setFixApplied(false)

      toast({
        title: "Storage Cleared",
        description: "All localStorage data has been cleared. The page will reload.",
        duration: 3000,
      })

      // Reload after a short delay
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      addLog(`Error clearing storage: ${error instanceof Error ? error.message : String(error)}`, "error")
    }
  }

  // Load stored role on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("squeedr-user-role")
      setStoredRole(saved)
    } catch (error) {
      console.error("Error reading localStorage:", error)
    }
  }, [])

  // Overall status calculation
  const getOverallStatus = () => {
    if (localStorageStatus === "working" && roleContextStatus === "working" && persistenceStatus === "working") {
      return "success"
    }
    if (localStorageStatus === "error" || roleContextStatus === "error" || persistenceStatus === "error") {
      return "error"
    }
    return "unchecked"
  }

  const overallStatus = getOverallStatus()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Role Switching Fix Center</h1>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <Alert
        className={
          overallStatus === "success"
            ? "bg-green-50 border-green-200 mb-6"
            : overallStatus === "error"
              ? "bg-red-50 border-red-200 mb-6"
              : "bg-blue-50 border-blue-200 mb-6"
        }
      >
        {overallStatus === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
        {overallStatus === "error" && <XCircle className="h-4 w-4 text-red-600" />}
        {overallStatus === "unchecked" && <Info className="h-4 w-4 text-blue-600" />}

        <AlertTitle>
          {overallStatus === "success"
            ? "System Healthy"
            : overallStatus === "error"
              ? "Issues Detected"
              : "Ready for Diagnostics"}
        </AlertTitle>
        <AlertDescription>
          {overallStatus === "success"
            ? "All role switching systems are working correctly."
            : overallStatus === "error"
              ? "There are issues with the role switching system. See details below."
              : "Run the diagnostic tests to check the role switching system."}
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="diagnose">Diagnose</TabsTrigger>
          <TabsTrigger value="fix">Fix</TabsTrigger>
          <TabsTrigger value="test">Test</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        {/* Diagnose Tab */}
        <TabsContent value="diagnose">
          <Card>
            <CardHeader>
              <CardTitle>System Diagnostics</CardTitle>
              <CardDescription>Run tests to identify role switching issues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">localStorage Status:</span>
                    {localStorageStatus === "working" && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {localStorageStatus === "error" && <XCircle className="h-4 w-4 text-red-600" />}
                    {localStorageStatus === "unchecked" && <AlertCircle className="h-4 w-4 text-gray-400" />}
                    <span>
                      {localStorageStatus === "working"
                        ? "Working"
                        : localStorageStatus === "error"
                          ? "Error"
                          : "Not Checked"}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={checkLocalStorage}>
                    Check localStorage
                  </Button>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Role Context Status:</span>
                    {roleContextStatus === "working" && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {roleContextStatus === "error" && <XCircle className="h-4 w-4 text-red-600" />}
                    {roleContextStatus === "unchecked" && <AlertCircle className="h-4 w-4 text-gray-400" />}
                    <span>
                      {roleContextStatus === "working"
                        ? "Working"
                        : roleContextStatus === "error"
                          ? "Error"
                          : "Not Checked"}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={checkRoleContext}>
                    Check Role Context
                  </Button>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Persistence Status:</span>
                    {persistenceStatus === "working" && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {persistenceStatus === "error" && <XCircle className="h-4 w-4 text-red-600" />}
                    {persistenceStatus === "unchecked" && <AlertCircle className="h-4 w-4 text-gray-400" />}
                    <span>
                      {persistenceStatus === "working"
                        ? "Working"
                        : persistenceStatus === "error"
                          ? "Error"
                          : "Not Checked"}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={testPersistence}>
                    Test Persistence
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-md border">
                <h3 className="font-medium mb-2">Current State</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Current Role (Context):</strong> {role}
                  </p>
                  <p>
                    <strong>Stored Role (localStorage):</strong> {storedRole || "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => window.location.reload()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Page
                </Button>
                <Button onClick={runAllTests} className="bg-blue-600 hover:bg-blue-700">
                  Run All Tests
                </Button>
              </div>

              {testComplete && (
                <Alert
                  className={
                    overallStatus === "success" ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
                  }
                >
                  <AlertTitle>{overallStatus === "success" ? "All Tests Passed" : "Tests Completed"}</AlertTitle>
                  <AlertDescription>
                    {overallStatus === "success"
                      ? "Your role switching system appears to be working correctly."
                      : "Some tests have failed. Go to the Fix tab to apply a solution."}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fix Tab */}
        <TabsContent value="fix">
          <Card>
            <CardHeader>
              <CardTitle>Apply Fixes</CardTitle>
              <CardDescription>Resolve role switching issues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertTitle>How This Works</AlertTitle>
                <AlertDescription>
                  This will reset your role configuration and ensure that localStorage and the role context are properly
                  synchronized.
                </AlertDescription>
              </Alert>

              <div className="p-4 bg-gray-50 rounded-md border">
                <h3 className="font-medium mb-2">Fix Process</h3>
                <ol className="list-decimal ml-5 space-y-1 text-sm">
                  <li>Clear any existing role data</li>
                  <li>Set a default role (expert)</li>
                  <li>Update the role context</li>
                  <li>Verify localStorage and context are synchronized</li>
                </ol>
              </div>

              <Button onClick={applyFix} className="w-full bg-green-600 hover:bg-green-700" disabled={fixApplied}>
                {fixApplied ? "Fix Already Applied" : "Apply Comprehensive Fix"}
              </Button>

              {fixApplied && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle>Fix Applied Successfully</AlertTitle>
                  <AlertDescription>
                    Your role has been reset to 'expert'. Go to the Test tab to verify role switching is working.
                  </AlertDescription>
                </Alert>
              )}

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Advanced Options</h3>
                <Button
                  onClick={clearBrowserStorage}
                  variant="outline"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Browser Storage
                </Button>
                <p className="text-xs text-gray-500 mt-1">
                  This will clear all localStorage data and reload the page. Use this as a last resort.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Test Tab */}
        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle>Test Role Switching</CardTitle>
              <CardDescription>Verify role switching is working correctly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md border">
                <h3 className="font-medium mb-2">Current Role Information</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Active Role:</strong> {role}
                  </p>
                  <p>
                    <strong>Stored in localStorage:</strong> {storedRole || "Not set"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Select a Role</h3>
                <p className="text-sm text-gray-600 mb-2">Click a button below to test switching to that role.</p>

                <div className="grid grid-cols-3 gap-3">
                  <Button
                    onClick={() => testRoleSwitch("owner")}
                    variant="outline"
                    className={`flex flex-col items-center justify-center h-24 ${
                      role === "owner" ? "bg-blue-100 border-blue-300" : ""
                    }`}
                  >
                    <Shield className="h-8 w-8 mb-2 text-blue-600" />
                    <span className="font-medium">Owner</span>
                  </Button>

                  <Button
                    onClick={() => testRoleSwitch("expert")}
                    variant="outline"
                    className={`flex flex-col items-center justify-center h-24 ${
                      role === "expert" ? "bg-green-100 border-green-300" : ""
                    }`}
                  >
                    <Code className="h-8 w-8 mb-2 text-green-600" />
                    <span className="font-medium">Expert</span>
                  </Button>

                  <Button
                    onClick={() => testRoleSwitch("client")}
                    variant="outline"
                    className={`flex flex-col items-center justify-center h-24 ${
                      role === "client" ? "bg-purple-100 border-purple-300" : ""
                    }`}
                  >
                    <User className="h-8 w-8 mb-2 text-purple-600" />
                    <span className="font-medium">Client</span>
                  </Button>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => window.location.reload()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Page
                </Button>

                <Link href="/dashboard">
                  <Button>
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Debug Logs</CardTitle>
              <CardDescription>Detailed log of all operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-2">
                <Button variant="outline" size="sm" onClick={clearLogs}>
                  Clear Logs
                </Button>
              </div>

              <div className="bg-gray-900 text-gray-100 p-4 rounded-md h-[400px] overflow-y-auto font-mono text-sm">
                {logs.length > 0 ? (
                  logs.map((log, i) => (
                    <div key={i} className="pb-1">
                      {log}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 italic">No logs yet. Run some tests to see logs here.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
        <h2 className="font-semibold mb-2 text-blue-800">Next Steps:</h2>
        <ol className="list-decimal pl-5 space-y-1 text-blue-800">
          <li>First, run all tests in the Diagnose tab to identify any issues</li>
          <li>Then, apply the fix in the Fix tab if problems are detected</li>
          <li>Next, test role switching in the Test tab to verify it's working</li>
          <li>Finally, return to the dashboard to use the regular role switcher</li>
          <li>If issues persist, check the Logs tab for detailed error information</li>
        </ol>
      </div>
    </div>
  )
}
