"use client"

import { RoleAwareComponent } from "@/components/role-aware-component"
import { RoleSwitcherMenu, CompactRoleSwitcher } from "@/components/role-switcher-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function RoleDemoPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Role Management System Demo</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          This page demonstrates the complete role selection and management system for users with multiple roles.
          The system supports automatic role selection, manual role switching, and role-based UI rendering.
        </p>
      </div>

      <Separator />

      {/* Role Switcher Components */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Role Switcher Components</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Full Role Switcher Menu</CardTitle>
              <CardDescription>
                Complete dropdown menu with descriptions and user info
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RoleSwitcherMenu />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compact Role Switcher</CardTitle>
              <CardDescription>
                Minimal version for navigation bars and headers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompactRoleSwitcher />
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Usage Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Usage Examples</h2>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>How to Use in Your Components</CardTitle>
              <CardDescription>
                Code examples showing how to access role information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Basic Role Access:</h4>
                <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
{`import { useRole } from "@/hooks/use-role"

function MyComponent() {
  const { role, user, availableRoles } = useRole()
  
  return (
    <div>
      <p>Current role: {role}</p>
      <p>User: {user?.username}</p>
      <p>Available roles: {availableRoles.join(", ")}</p>
    </div>
  )
}`}
                </pre>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Role-Based Conditional Rendering:</h4>
                <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
{`import { useRole } from "@/hooks/use-role"

function AdminPanel() {
  const { role } = useRole()
  
  if (role === "owner") {
    return <OwnerDashboard />
  } else if (role === "expert") {
    return <ExpertDashboard />
  } else {
    return <ClientDashboard />
  }
}`}
                </pre>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Role Switching:</h4>
                <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
{`import { useRole } from "@/hooks/use-role"

function RoleSwitcher() {
  const { switchRole, availableRoles } = useRole()
  
  return (
    <div>
      {availableRoles.map(role => (
        <button 
          key={role}
          onClick={() => switchRole(role)}
        >
          Switch to {role}
        </button>
      ))}
    </div>
  )
}`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Authentication Integration</CardTitle>
              <CardDescription>
                How to integrate with your auth flow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Process Login Response:</h4>
                <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
{`import { useRole } from "@/hooks/use-role"

function LoginComponent() {
  const { processLoginResponse } = useRole()
  
  const handleLogin = async () => {
    try {
      // Your Strapi login call
      const response = await fetch("/api/auth/local", {
        method: "POST",
        body: JSON.stringify({ identifier, password })
      })
      
      const loginData = await response.json()
      // loginData = { jwt: "...", user: { app_roles: [...] } }
      
      // Process the response
      processLoginResponse(loginData)
      
      // The system will automatically:
      // 1. Store JWT and user data
      // 2. Extract available roles
      // 3. Auto-select if single role
      // 4. Show role selection if multiple roles
      // 5. Redirect to appropriate dashboard
      
    } catch (error) {
      console.error("Login failed:", error)
    }
  }
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Feature Showcase */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Feature Showcase</h2>
        <div className="space-y-2 mb-4">
          <Badge variant="outline">✓ Automatic role detection from Strapi response</Badge>
          <Badge variant="outline">✓ Single role auto-selection</Badge>
          <Badge variant="outline">✓ Multiple role selection UI</Badge>
          <Badge variant="outline">✓ Role switching with validation</Badge>
          <Badge variant="outline">✓ Persistent role storage</Badge>
          <Badge variant="outline">✓ JWT token management</Badge>
          <Badge variant="outline">✓ Role-based UI rendering</Badge>
          <Badge variant="outline">✓ TypeScript support</Badge>
        </div>
        
        {/* Main Demo Component */}
        <RoleAwareComponent />
      </section>
    </div>
  )
} 