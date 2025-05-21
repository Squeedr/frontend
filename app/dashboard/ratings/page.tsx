"use client"

import { useState } from "react"
import { Calendar, MoreHorizontal, Star, User } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchFilter } from "@/components/search-filter"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRole } from "@/hooks/use-role"
import { ratings } from "@/lib/mock-data"
import type { Rating } from "@/lib/mock-data"

export default function RatingsPage() {
  const { role } = useRole()
  const [filteredRatings, setFilteredRatings] = useState<Rating[]>(ratings)

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

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredRatings(ratings)
      return
    }

    const filtered = ratings.filter(
      (rating) =>
        rating.expertName.toLowerCase().includes(query.toLowerCase()) ||
        rating.clientName.toLowerCase().includes(query.toLowerCase()) ||
        rating.sessionTitle.toLowerCase().includes(query.toLowerCase()) ||
        rating.comment.toLowerCase().includes(query.toLowerCase()),
    )

    setFilteredRatings(filtered)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchFilter
          onSearch={handleSearch}
          exportOptions={{
            csv: true,
          }}
        />
      </div>

      <div className="grid gap-4">
        {filteredRatings.length > 0 ? (
          filteredRatings.map((rating) => (
            <Card key={rating.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{rating.sessionTitle}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Session</DropdownMenuItem>
                      {role === "owner" && <DropdownMenuItem className="text-red-600">Remove Rating</DropdownMenuItem>}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < rating.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-medium">{rating.rating}/5</span>
                </div>

                <p className="text-sm text-gray-700 mb-4">"{rating.comment}"</p>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Expert</p>
                      <p className="text-sm text-gray-500">{rating.expertName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Client</p>
                      <p className="text-sm text-gray-500">{rating.clientName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Date</p>
                      <p className="text-sm text-gray-500">{rating.date}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No ratings found</p>
          </div>
        )}
      </div>
    </div>
  )
}
