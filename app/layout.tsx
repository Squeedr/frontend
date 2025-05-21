import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Montserrat } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { RoleProvider } from "@/hooks/use-role"
import { PermissionsProvider } from "@/hooks/permissions-provider"
import { Toaster } from "@/components/ui/toaster"
import { NotificationsProvider } from "@/hooks/use-notifications"
import { PageLoader } from "@/components/ui/loading-states"

const inter = Inter({ subsets: ["latin"] })

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  title: "Squeedr Dashboard",
  description: "Manage your sessions, experts, and clients with Squeedr",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${montserrat.variable}`} suppressHydrationWarning>
      <body className={inter.className}>
        <RoleProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <PermissionsProvider>
              <NotificationsProvider>
                <Suspense fallback={<PageLoader />}>
                  {children}
                </Suspense>
                <Toaster />
              </NotificationsProvider>
            </PermissionsProvider>
          </ThemeProvider>
        </RoleProvider>
      </body>
    </html>
  )
}
