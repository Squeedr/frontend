"use client"

import { useState, useMemo, useEffect } from "react"
import { Check, Clock, DollarSign, Download, Eye, FileText, PenLine, Search, Send, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useRole } from "@/hooks/use-role"
import { invoices } from "@/lib/mock-data"
import type { Invoice } from "@/lib/mock-data"
import { InvoiceStatusBadge } from "@/components/invoice-status-badge"
import { SignedStatusBadge } from "@/components/signed-status-badge"
import { SendReminderDialog } from "@/components/send-reminder-dialog"
import { useToast } from "@/hooks/use-toast"

type InvoiceStatus = "paid" | "pending" | "overdue" | "draft"
type FilterTab = "all" | InvoiceStatus

export default function InvoicesPage() {
  const { role } = useRole()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<FilterTab>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])
  const [sortField, setSortField] = useState<keyof Invoice>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false)

  // Only owners and experts should see this page
  if (role === "client") {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-gray-500 mt-2">You don't have permission to view this page.</p>
        </div>
      </div>
    )
  }

  // Filter invoices based on active tab and search query
  const filteredInvoices = useMemo(() => {
    let filtered = [...invoices]

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter((invoice) => invoice.status === activeTab)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (invoice) => invoice.number.toLowerCase().includes(query) || invoice.clientName.toLowerCase().includes(query),
      )
    }

    // Sort invoices
    filtered.sort((a, b) => {
      const fieldA = a[sortField]
      const fieldB = b[sortField]

      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortDirection === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA)
      } else if (typeof fieldA === "number" && typeof fieldB === "number") {
        return sortDirection === "asc" ? fieldA - fieldB : fieldB - fieldA
      }

      return 0
    })

    return filtered
  }, [activeTab, searchQuery, sortField, sortDirection])

  // Calculate summary data
  const summaryData = useMemo(() => {
    const total = invoices.reduce((sum, invoice) => sum + invoice.amount, 0)
    const paid = invoices
      .filter((invoice) => invoice.status === "paid")
      .reduce((sum, invoice) => sum + invoice.amount, 0)
    const unpaid = invoices
      .filter((invoice) => invoice.status === "pending")
      .reduce((sum, invoice) => sum + invoice.amount, 0)
    const overdue = invoices
      .filter((invoice) => invoice.status === "overdue")
      .reduce((sum, invoice) => sum + invoice.amount, 0)
    const signedCount = invoices.filter((invoice) => invoice.signed).length

    return {
      total,
      paid,
      unpaid,
      overdue,
      signedCount,
      totalCount: invoices.length,
    }
  }, [])

  // Handle sort
  const handleSort = (field: keyof Invoice) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Handle select all
  const handleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([])
    } else {
      setSelectedInvoices(filteredInvoices.map((invoice) => invoice.id))
    }
  }

  // Handle select invoice
  const handleSelectInvoice = (id: string) => {
    if (selectedInvoices.includes(id)) {
      setSelectedInvoices(selectedInvoices.filter((invoiceId) => invoiceId !== id))
    } else {
      setSelectedInvoices([...selectedInvoices, id])
    }
  }

  // Handle export
  const handleExport = (format: "pdf" | "csv" | "excel") => {
    // In a real app, this would call an API to generate the export
    toast({
      title: `Export ${format.toUpperCase()} successful`,
      description: `${selectedInvoices.length || filteredInvoices.length} invoice(s) exported as ${format.toUpperCase()}.`,
    })
  }

  // Reset selected invoices when filtered invoices change
  useEffect(() => {
    setSelectedInvoices([])
  }, [activeTab, searchQuery])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Invoices</h1>
        <p className="text-gray-500">View and manage your invoices</p>
      </div>

      {/* Filter Tabs */}
      <div className="grid grid-cols-4 gap-2 bg-gray-100 p-1 rounded-lg">
        <button
          className={`py-2 px-4 rounded-lg text-center transition-colors ${
            activeTab === "all" ? "bg-white shadow-sm" : "hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        <button
          className={`py-2 px-4 rounded-lg text-center transition-colors ${
            activeTab === "paid" ? "bg-white shadow-sm" : "hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("paid")}
        >
          Paid
        </button>
        <button
          className={`py-2 px-4 rounded-lg text-center transition-colors ${
            activeTab === "pending" ? "bg-white shadow-sm" : "hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Unpaid
        </button>
        <button
          className={`py-2 px-4 rounded-lg text-center transition-colors ${
            activeTab === "overdue" ? "bg-white shadow-sm" : "hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("overdue")}
        >
          Overdue
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500">Total Amount</span>
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-2xl font-bold">${summaryData.total.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500">Paid</span>
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold">${summaryData.paid.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500">Unpaid</span>
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
            <div className="text-2xl font-bold">${summaryData.unpaid.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500">Overdue</span>
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="text-2xl font-bold">${summaryData.overdue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500">Signed</span>
              <PenLine className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">
              {summaryData.signedCount} / {summaryData.totalCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-semibold">Bulk Actions</h3>
              <p className="text-sm text-gray-500">Select invoices to enable bulk actions</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={selectedInvoices.length === 0}
                onClick={() => setIsReminderDialogOpen(true)}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Reminder
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={selectedInvoices.length === 0}
                onClick={() => handleExport("pdf")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={selectedInvoices.length === 0}
                onClick={() => handleExport("csv")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={selectedInvoices.length === 0}
                onClick={() => handleExport("excel")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice List */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h3 className="font-semibold">Invoice List</h3>
              <p className="text-sm text-gray-500">{filteredInvoices.length} invoices found</p>
            </div>
            <div className="w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search by name..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left">
                    <Checkbox
                      checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all invoices"
                    />
                  </th>
                  <th
                    className="px-4 py-3 text-left cursor-pointer hover:text-black"
                    onClick={() => handleSort("number")}
                  >
                    Invoice ID
                    {sortField === "number" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </th>
                  <th className="px-4 py-3 text-left">Client</th>
                  <th
                    className="px-4 py-3 text-left cursor-pointer hover:text-black"
                    onClick={() => handleSort("amount")}
                  >
                    Amount
                    {sortField === "amount" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </th>
                  <th
                    className="px-4 py-3 text-left cursor-pointer hover:text-black"
                    onClick={() => handleSort("date")}
                  >
                    Date
                    {sortField === "date" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Signed</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={selectedInvoices.includes(invoice.id)}
                          onCheckedChange={() => handleSelectInvoice(invoice.id)}
                          aria-label={`Select invoice ${invoice.number}`}
                        />
                      </td>
                      <td className="px-4 py-3 font-medium">{invoice.number}</td>
                      <td className="px-4 py-3">{invoice.clientName}</td>
                      <td className="px-4 py-3">${invoice.amount.toFixed(2)}</td>
                      <td className="px-4 py-3">{invoice.date.split("-").reverse().join("/")}</td>
                      <td className="px-4 py-3">
                        <InvoiceStatusBadge status={invoice.status} />
                      </td>
                      <td className="px-4 py-3">
                        <SignedStatusBadge signed={invoice.signed} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" title="View Invoice">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Download Invoice">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      No invoices found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Send Reminder Dialog */}
      <SendReminderDialog
        open={isReminderDialogOpen}
        onOpenChange={setIsReminderDialogOpen}
        selectedInvoices={selectedInvoices}
      />
    </div>
  )
}
