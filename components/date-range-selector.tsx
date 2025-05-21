"use client"

import { useState } from "react"
import { addDays, format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface DateRangeSelectorProps {
  onChange?: (range: { from: Date; to: Date }) => void
  className?: string
}

export function DateRangeSelector({ onChange, className }: DateRangeSelectorProps) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfDay(new Date()),
    to: endOfDay(new Date()),
  })

  const handleRangeChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const from = startOfDay(range.from)
      const to = endOfDay(range.to)

      setDate({ from, to })

      if (onChange) {
        onChange({ from, to })
      }
    }
  }

  const handlePresetChange = (preset: string) => {
    const today = new Date()
    let from: Date
    let to: Date

    switch (preset) {
      case "today":
        from = startOfDay(today)
        to = endOfDay(today)
        break
      case "yesterday":
        from = startOfDay(addDays(today, -1))
        to = endOfDay(addDays(today, -1))
        break
      case "last7days":
        from = startOfDay(addDays(today, -6))
        to = endOfDay(today)
        break
      case "last30days":
        from = startOfDay(addDays(today, -29))
        to = endOfDay(today)
        break
      case "thisWeek":
        from = startOfWeek(today, { weekStartsOn: 1 })
        to = endOfWeek(today, { weekStartsOn: 1 })
        break
      case "lastWeek":
        const lastWeekStart = addDays(startOfWeek(today, { weekStartsOn: 1 }), -7)
        from = startOfDay(lastWeekStart)
        to = endOfDay(addDays(lastWeekStart, 6))
        break
      case "thisMonth":
        from = startOfMonth(today)
        to = endOfMonth(today)
        break
      case "lastMonth":
        const lastMonthStart = addDays(startOfMonth(today), -1)
        from = startOfMonth(lastMonthStart)
        to = endOfMonth(lastMonthStart)
        break
      default:
        from = startOfDay(today)
        to = endOfDay(today)
    }

    handleRangeChange({ from, to })
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Select onValueChange={handlePresetChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <SelectItem value="last7days">Last 7 days</SelectItem>
          <SelectItem value="last30days">Last 30 days</SelectItem>
          <SelectItem value="thisWeek">This week</SelectItem>
          <SelectItem value="lastWeek">Last week</SelectItem>
          <SelectItem value="thisMonth">This month</SelectItem>
          <SelectItem value="lastMonth">Last month</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleRangeChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
