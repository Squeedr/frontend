"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRole } from "@/hooks/use-role"
import { useToast } from "@/hooks/use-toast"
import { invoices } from "@/lib/mock-data"
import { InvoiceStatusBadge } from "@/components/invoice-status-badge"
import { CreditCard, DollarSign, FileText, History, Plus, Check } from "lucide-react"

function getBillingData(role: string) {
  switch (role) {
    case "owner":
      return {
        plan: "Enterprise",
        price: "$299",
        billingCycle: "monthly",
        features: [
          "Unlimited experts",
          "Unlimited sessions",
          "Advanced analytics",
          "Priority support",
          "Custom branding",
        ],
        nextBillingDate: "2024-04-01",
        paymentMethods: [
          {
            id: "pm_1",
            type: "card",
            last4: "4242",
            expiry: "12/25",
            isDefault: true,
          },
        ],
      }
    case "expert":
      return {
        plan: "Professional",
        price: "$99",
        billingCycle: "monthly",
        features: [
          "Up to 10 sessions/month",
          "Basic analytics",
          "Email support",
          "Session recordings",
        ],
        nextBillingDate: "2024-04-01",
        paymentMethods: [
          {
            id: "pm_2",
            type: "card",
            last4: "5678",
            expiry: "09/24",
            isDefault: true,
          },
        ],
      }
    default:
      return {
        plan: "Free",
        price: "$0",
        billingCycle: "monthly",
        features: [
          "Up to 3 sessions/month",
          "Basic support",
          "Community access",
        ],
        nextBillingDate: "N/A",
        paymentMethods: [],
      }
  }
}

export default function BillingPage() {
  const { role } = useRole()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const billingData = getBillingData(role)
  const recentInvoices = role !== "client" ? invoices.slice(0, 3) : []

  const handleAddPaymentMethod = () => {
    toast({
      title: "Add Payment Method",
      description: "This would open a payment method form in a real implementation.",
    })
  }
  const handleUpdateBillingSettings = () => {
    toast({
      title: "Update Billing Settings",
      description: "This would open billing settings in a real implementation.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-gray-500">Manage your billing information and payment methods</p>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="history">Billing History</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>Your current subscription plan and billing details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{billingData.plan}</p>
                    <p className="text-gray-500">{billingData.billingCycle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{billingData.price}</p>
                    <p className="text-gray-500">per month</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {billingData.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleUpdateBillingSettings}>Update Plan</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Your saved payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {billingData.paymentMethods.length > 0 ? (
                  billingData.paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <CreditCard className="mr-2 h-5 w-5" />
                        <div>
                          <p className="font-medium">•••• {method.last4}</p>
                          <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                        </div>
                      </div>
                      {method.isDefault && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Default</span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No payment methods added yet.</p>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={handleAddPaymentMethod}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Payment Method
                </Button>
              </CardFooter>
            </Card>
          </div>
          {recentInvoices.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
                <CardDescription>Your most recent invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentInvoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Invoice #{invoice.number}</p>
                        <p className="text-sm text-gray-500">{invoice.date}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="font-medium">${invoice.amount.toFixed(2)}</p>
                        <InvoiceStatusBadge status={invoice.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => setActiveTab("invoices")}>
                  View All Invoices
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="payment-methods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods and billing information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {billingData.paymentMethods.length > 0 ? (
                billingData.paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5" />
                      <div>
                        <p className="font-medium">•••• {method.last4}</p>
                        <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {method.isDefault && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Default</span>
                      )}
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        Remove
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No payment methods added yet.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleAddPaymentMethod}>
                <Plus className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>View and download your invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Invoice #{invoice.number}</p>
                      <p className="text-sm text-gray-500">{invoice.date}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="font-medium">${invoice.amount.toFixed(2)}</p>
                      <InvoiceStatusBadge status={invoice.status} />
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View your billing history and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <History className="mr-2 h-5 w-5" />
                      <div>
                        <p className="font-medium">Invoice #{invoice.number}</p>
                        <p className="text-sm text-gray-500">{invoice.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="font-medium">${invoice.amount.toFixed(2)}</p>
                      <InvoiceStatusBadge status={invoice.status} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
