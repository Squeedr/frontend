"use client"

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"

interface ExportDataButtonProps {
  onExport?: (format: string) => Promise<void>
  exportFormats?: Array<{
    id: string
    label: string
    description?: string
  }>
  className?: string
}

export function ExportDataButton({
  onExport,
  exportFormats = [
    { id: "csv", label: "CSV", description: "Export as CSV file" },
    { id: "excel", label: "Excel", description: "Export as Excel spreadsheet" },
    { id: "pdf", label: "PDF", description: "Export as PDF document" },
  ],
  className,
}: ExportDataButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<string | null>(null)

  const handleExport = async (format: string) => {
    try {
      setIsExporting(true)
      setExportFormat(format)

      if (onExport) {
        await onExport(format)
      } else {
        // Default export behavior if no handler provided
        await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate export delay

        toast({
          title: "Export successful",
          description: `Your data has been exported as ${format.toUpperCase()}`,
        })
      }
    } catch (error) {
      console.error("Export failed:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
      setExportFormat(null)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className}>
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting {exportFormat?.toUpperCase()}...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {exportFormats.map((format) => (
          <DropdownMenuItem key={format.id} onClick={() => handleExport(format.id)} disabled={isExporting}>
            <div className="flex flex-col">
              <span>{format.label}</span>
              {format.description && <span className="text-xs text-muted-foreground">{format.description}</span>}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
