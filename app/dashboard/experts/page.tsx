"use client"

import { useState } from "react"
import { Calendar, DollarSign, MoreHorizontal, Star, User } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchFilter } from "@/components/search-filter"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRole } from "@/hooks/use-role"
import { experts, filterOptions } from "@/lib/mock-data"
import type { Expert } from "@/lib/mock-data"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { CreateExpertModal } from "@/components/create-expert-modal"

export default function ExpertsPage() {
  const { role } = useRole()
  const router = useRouter()
  const { toast } = useToast()
  const [filteredExperts, setFilteredExperts] = useState<Expert[]>(experts)
  const [isLoading, setIsLoading] = useState(false)

  // Only owners should see this page
  if (role !== "owner") {
    // Redirect to dashboard after showing a toast
    toast({
      title: "Access Denied",
      description: "You don't have permission to view the Experts page.",
      variant: "destructive",
    })
    router.push("/dashboard")
    return null
  }

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredExperts(experts)
      return
    }

    const filtered = experts.filter(
      (expert) =>
        expert.name.toLowerCase().includes(query.toLowerCase()) ||
        expert.email.toLowerCase().includes(query.toLowerCase()) ||
        expert.specialty.toLowerCase().includes(query.toLowerCase()),
    )

    setFilteredExperts(filtered)
  }

  const handleFilter = (filters: any) => {
    setIsLoading(true)

    try {
      let filtered = [...experts]

      if (filters.workspace) {
        filtered = filtered.filter((expert) => expert.workspaces.includes(filters.workspace))
      }

      if (filters.status) {
        filtered = filtered.filter((expert) => expert.status === filters.status)
      }

      setFilteredExperts(filtered)
    } catch (error) {
      console.error("Error filtering experts:", error)
      toast({
        title: "Error",
        description: "There was a problem filtering the experts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExpertAction = (action: string, expert: Expert) => {
    toast({
      title: `${action} - ${expert.name}`,
      description: `You would ${action.toLowerCase()} ${expert.name} in a real application.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchFilter
          onSearch={handleSearch}
          onFilter={handleFilter}
          filterOptions={{
            workspaces: filterOptions.workspaces,
            statuses: ["active", "inactive"],
          }}
          exportOptions={{
            csv: true,
          }}
        />

        <CreateExpertModal
          onExpertCreated={(expert) => {
            setFilteredExperts((prev) => [expert, ...prev])
            toast({
              title: "Expert Created",
              description: `${expert.name} has been added as an expert.`,
            })
          }}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredExperts.length > 0 ? (
            filteredExperts.map((expert) => (
              <Card key={expert.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{expert.name}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleExpertAction("View Profile", expert)}>
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExpertAction("Edit", expert)}>
                          Edit Expert
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExpertAction("Message", expert)}>
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleExpertAction("Deactivate", expert)}
                        >
                          Deactivate Expert
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-gray-500">{expert.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Rating</p>
                        <p className="text-sm text-gray-500">{expert.rating}/5.0</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Sessions</p>
                        <p className="text-sm text-gray-500">{expert.sessions} total</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Revenue</p>
                        <p className="text-sm text-gray-500">${expert.revenue}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Specialty</p>
                      <p className="text-sm text-gray-500">{expert.specialty}</p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        expert.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {expert.status.charAt(0).toUpperCase() + expert.status.slice(1)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow">
              <p className="text-gray-500">No experts found</p>
              <Button variant="outline" className="mt-4" onClick={() => setFilteredExperts(experts)}>
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
