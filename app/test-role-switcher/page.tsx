"use client"

import { TestRoleSwitcher } from "@/components/test-role-switcher"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TestRoleSwitcherPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Test Role Switcher</h1>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <div className="grid gap-6">
        <TestRoleSwitcher />

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h2 className="text-lg font-medium text-yellow-800 mb-2">Troubleshooting Tips</h2>
          <ul className="list-disc pl-5 space-y-2 text-yellow-700">
            <li>
              If role switching doesn't work, check the browser console for errors (F12 or right-click &gt; Inspect &gt;
              Console)
            </li>
            <li>Try refreshing the page after switching roles to see if the change persists</li>
            <li>
              If localStorage shows the correct value but the role doesn't change, there might be an issue with the role
              context
            </li>
            <li>Try using a different browser to rule out browser-specific issues</li>
          </ul>
        </div>

        <div className="flex justify-between">
          <Button onClick={() => window.location.reload()} variant="outline">
            Refresh Page
          </Button>
          <div className="space-x-2">
            <Button
              onClick={() => {
                try {
                  localStorage.clear()
                  alert("localStorage cleared successfully")
                } catch (e) {
                  alert("Error clearing localStorage: " + e)
                }
              }}
              variant="destructive"
            >
              Clear localStorage
            </Button>
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
