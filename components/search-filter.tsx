"use client"

import type React from "react"

import { useState } from "react"
import { Search, Filter, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface SearchFilterProps {
  onSearch: (query: string) => void
  onFilter?: (filters: any) => void
  filterOptions?: {
    workspaces?: string[]
    statuses?: string[]
    dateRanges?: string[]
  }
  exportOptions?: {
    csv?: boolean
    ics?: boolean
  }
}

export function SearchFilter({ onSearch, onFilter, filterOptions, exportOptions }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    workspace: "",
    status: "",
    dateRange: "",
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch(query)
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    if (onFilter) {
      onFilter(newFilters)
    }
  }

  const handleExport = (format: "csv" | "ics") => {
    // Dummy export logic
    console.log(`Exporting as ${format}...`)
    alert(`Data exported as ${format.toUpperCase()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input type="search" placeholder="Search..." className="pl-8" value={searchQuery} onChange={handleSearch} />
      </div>

      {filterOptions && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Filters</h4>
                <p className="text-sm text-gray-500">Narrow down your search results</p>
              </div>

              {filterOptions.workspaces && (
                <div className="grid gap-2">
                  <Label htmlFor="workspace">Workspace</Label>
                  <Select value={filters.workspace} onValueChange={(value) => handleFilterChange("workspace", value)}>
                    <SelectTrigger id="workspace">
                      <SelectValue placeholder="Select workspace" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All workspaces</SelectItem>
                      {filterOptions.workspaces.map((workspace) => (
                        <SelectItem key={workspace} value={workspace}>
                          {workspace}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {filterOptions.statuses && (
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      {filterOptions.statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {filterOptions.dateRanges && (
                <div className="grid gap-2">
                  <Label htmlFor="dateRange">Date Range</Label>
                  <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange("dateRange", value)}>
                    <SelectTrigger id="dateRange">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All time</SelectItem>
                      {filterOptions.dateRanges.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button onClick={() => onFilter && onFilter(filters)}>Apply Filters</Button>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {exportOptions && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Export Options</h4>
                <p className="text-sm text-gray-500">Download your data</p>
              </div>
              <div className="grid gap-2">
                {exportOptions.csv && (
                  <Button variant="outline" className="justify-start" onClick={() => handleExport("csv")}>
                    Export as CSV
                  </Button>
                )}
                {exportOptions.ics && (
                  <Button variant="outline" className="justify-start" onClick={() => handleExport("ics")}>
                    Export as ICS
                  </Button>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
