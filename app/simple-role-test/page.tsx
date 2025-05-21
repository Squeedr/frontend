"use client"

import { SimpleRoleProvider } from "@/hooks/use-simple-role"
import { SimpleRoleSwitcher } from "@/components/simple-role-switcher"

export default function SimpleRoleTestPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Simple Role Switching Test</h1>
      <p className="mb-6 text-gray-600">
        This page uses a simplified role switching implementation to help diagnose issues.
      </p>

      <SimpleRoleProvider>
        <SimpleRoleSwitcher />
      </SimpleRoleProvider>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h2 className="text-lg font-medium text-yellow-800 mb-2">Important Notes</h2>
        <ul className="list-disc pl-5 space-y-2 text-yellow-700">
          <li>
            This page uses a separate role provider from the main application. Changes here won't affect the main
            application's role.
          </li>
          <li>This is only for testing if the basic role switching mechanism works.</li>
          <li>
            If role switching works here but not in the main app, the issue is likely with the integration of the role
            provider in the application layout.
          </li>
        </ul>
      </div>
    </div>
  )
}
