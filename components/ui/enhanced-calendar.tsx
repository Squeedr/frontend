"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  setMonth,
  setYear,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"

import type { Locale } from "date-fns"

export type CalendarProps = {
  mode?: "single" | "range" | "multiple"
  selected?: Date | Date[] | null
  onSelect?: (date: Date | null) => void
  month?: Date
  onMonthChange?: (date: Date) => void
  className?: string
  showOutsideDays?: boolean
  disabled?: (date: Date) => boolean
  locale?: Locale
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  fixedWeeks?: boolean
  numberOfMonths?: number
  today?: Date
  min?: Date
  max?: Date
  initialFocus?: boolean
  disableNavigation?: boolean
  showWeekNumber?: boolean
  weekNumberFormat?: (weekNumber: number) => React.ReactNode
  calendarLabel?: string
  hideYearNavigation?: boolean
  hideMonthNavigation?: boolean
  showYearDropdown?: boolean
  showMonthDropdown?: boolean
  highlightToday?: boolean
  disabledDays?: Date[]
  markedDays?: { date: Date; color?: string; className?: string }[]
}

export function EnhancedCalendar({
  mode = "single",
  selected,
  onSelect,
  month: monthProp,
  onMonthChange,
  className,
  showOutsideDays = true,
  disabled,
  locale,
  weekStartsOn = 0,
  fixedWeeks = false,
  numberOfMonths = 1,
  today: todayProp,
  min,
  max,
  initialFocus = false,
  disableNavigation = false,
  showWeekNumber = false,
  weekNumberFormat,
  calendarLabel = "Calendar",
  hideYearNavigation = false,
  hideMonthNavigation = false,
  showYearDropdown = false,
  showMonthDropdown = false,
  highlightToday = true,
  disabledDays = [],
  markedDays = [],
}: CalendarProps) {
  const [month, setMonthState] = React.useState(() => monthProp || new Date())
  const [yearSelectOpen, setYearSelectOpen] = React.useState(false)
  const [monthSelectOpen, setMonthSelectOpen] = React.useState(false)
  const [animationDirection, setAnimationDirection] = React.useState<"left" | "right" | null>(null)

  // Update month state when monthProp changes
  React.useEffect(() => {
    if (monthProp) {
      setMonthState(monthProp)
    }
  }, [monthProp])

  // Handle month change
  const handleMonthChange = React.useCallback(
    (date: Date, direction: "left" | "right" | null = null) => {
      setAnimationDirection(direction)
      setMonthState(date)
      onMonthChange?.(date)
    },
    [onMonthChange],
  )

  // Navigate to previous month
  const handlePreviousMonth = () => {
    handleMonthChange(subMonths(month, 1), "left")
  }

  // Navigate to next month
  const handleNextMonth = () => {
    handleMonthChange(addMonths(month, 1), "right")
  }

  // Navigate to previous year
  const handlePreviousYear = () => {
    const newDate = new Date(month)
    newDate.setFullYear(newDate.getFullYear() - 1)
    handleMonthChange(newDate, "left")
  }

  // Navigate to next year
  const handleNextYear = () => {
    const newDate = new Date(month)
    newDate.setFullYear(newDate.getFullYear() + 1)
    handleMonthChange(newDate, "right")
  }

  // Handle month dropdown change
  const handleMonthSelect = (monthIndex: number) => {
    const newDate = setMonth(month, monthIndex)
    handleMonthChange(newDate)
    setMonthSelectOpen(false)
  }

  // Handle year dropdown change
  const handleYearSelect = (year: number) => {
    const newDate = setYear(month, year)
    handleMonthChange(newDate)
    setYearSelectOpen(false)
  }

  // Handle day selection
  const handleDaySelect = (day: { date: Date; isDisabled: boolean }) => {
    if (day.isDisabled) return

    if (mode === "range" && selected && Array.isArray(selected)) {
      if (selected.length === 1) {
        // If we have one date selected, complete the range
        const [start] = selected
        const end = day.date

        // Ensure start date is before end date
        const range = [start < end ? start : end, start < end ? end : start] as Date[]

        onSelect?.(range as any)
      } else {
        // Start a new range
        onSelect?.([day.date] as any)
      }
    } else {
      onSelect?.(day.date)
    }
  }

  // Generate days for the calendar
  const days = React.useMemo(() => {
    const today = todayProp || new Date()
    const firstDayOfMonth = startOfMonth(month)
    const start = startOfWeek(firstDayOfMonth, { weekStartsOn })
    const daysToDisplay = []

    let day = start
    for (let i = 0; i < 42; i++) {
      const date = new Date(day)
      const isOutsideMonth = !isSameMonth(date, month)
      const isDisabled =
        disabled?.(date) ||
        (min && differenceInCalendarDays(date, min) < 0) ||
        (max && differenceInCalendarDays(date, max) > 0) ||
        disabledDays.some((disabledDate) => isSameDay(disabledDate, date))

      // Handle different selection modes
      let isSelected = false
      let isRangeStart = false
      let isRangeEnd = false
      let isWithinRange = false

      if (Array.isArray(selected)) {
        if (mode === "multiple") {
          isSelected = selected.some((selectedDate) => selectedDate && isSameDay(selectedDate, date))
        } else if (mode === "range" && selected.length > 0) {
          // For range selection
          if (selected.length === 1) {
            isSelected = isSameDay(selected[0], date)
            isRangeStart = isSelected
            isRangeEnd = isSelected
          } else if (selected.length === 2) {
            const [start, end] = selected
            isRangeStart = isSameDay(start, date)
            isRangeEnd = isSameDay(end, date)
            isSelected = isRangeStart || isRangeEnd
            isWithinRange =
              !isSelected && differenceInCalendarDays(date, start) > 0 && differenceInCalendarDays(end, date) > 0
          }
        }
      } else {
        isSelected = selected && isSameDay(selected, date)
      }

      const isCurrentToday = isToday(date)
      const marked = markedDays.find((markedDay) => isSameDay(markedDay.date, date))

      daysToDisplay.push({
        date,
        isOutsideMonth,
        isDisabled,
        isSelected,
        isToday: isCurrentToday,
        marked,
        isRangeStart,
        isRangeEnd,
        isWithinRange,
      })

      day = addDays(day, 1)
    }

    return daysToDisplay
  }, [month, selected, disabled, min, max, weekStartsOn, todayProp, disabledDays, markedDays, mode])

  // Generate years for dropdown
  const years = React.useMemo(() => {
    const currentYear = new Date().getFullYear()
    return Array.from({ length: 21 }, (_, i) => currentYear - 10 + i)
  }, [])

  // Generate months for dropdown
  const months = React.useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      return { index: i, name: format(new Date(2021, i, 1), "MMMM") }
    })
  }, [])

  // Animation variants for month transition
  const variants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "right" ? 20 : -20,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: "left" | "right") => ({
      x: direction === "right" ? -20 : 20,
      opacity: 0,
    }),
  }

  return (
    <div className={cn("w-full p-3 space-y-4", className)}>
      <div className="flex items-center justify-between">
        {/* Header with month/year and navigation */}
        <div className="flex items-center space-x-2">
          {!hideYearNavigation && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100"
              onClick={handlePreviousYear}
              disabled={disableNavigation}
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">Previous Year</span>
            </Button>
          )}

          {!hideMonthNavigation && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100"
              onClick={handlePreviousMonth}
              disabled={disableNavigation}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous Month</span>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-1">
          {showMonthDropdown ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-medium"
                onClick={() => setMonthSelectOpen(!monthSelectOpen)}
              >
                {format(month, "MMMM")}
              </Button>
              {monthSelectOpen && (
                <div className="absolute top-full left-0 z-50 mt-1 w-40 rounded-md border bg-popover p-1 shadow-md">
                  <div className="max-h-60 overflow-y-auto">
                    {months.map((m) => (
                      <button
                        key={m.index}
                        className={cn(
                          "w-full rounded-sm px-2 py-1 text-left text-sm",
                          month.getMonth() === m.index ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                        )}
                        onClick={() => handleMonthSelect(m.index)}
                      >
                        {m.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <span className="text-sm font-medium">{format(month, "MMMM")}</span>
          )}

          {showYearDropdown ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-medium"
                onClick={() => setYearSelectOpen(!yearSelectOpen)}
              >
                {format(month, "yyyy")}
              </Button>
              {yearSelectOpen && (
                <div className="absolute top-full left-0 z-50 mt-1 w-20 rounded-md border bg-popover p-1 shadow-md">
                  <div className="max-h-60 overflow-y-auto">
                    {years.map((year) => (
                      <button
                        key={year}
                        className={cn(
                          "w-full rounded-sm px-2 py-1 text-left text-sm",
                          month.getFullYear() === year ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                        )}
                        onClick={() => handleYearSelect(year)}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <span className="text-sm font-medium">{format(month, "yyyy")}</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {!hideMonthNavigation && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100"
              onClick={handleNextMonth}
              disabled={disableNavigation}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next Month</span>
            </Button>
          )}

          {!hideYearNavigation && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100"
              onClick={handleNextYear}
              disabled={disableNavigation}
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Next Year</span>
            </Button>
          )}
        </div>
      </div>

      {/* Day names header */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {Array.from({ length: 7 }).map((_, i) => {
          const dayIndex = (i + weekStartsOn) % 7
          const dayName = format(new Date(2021, 0, dayIndex + 3), "EEE")
          return (
            <div key={dayIndex} className="text-xs font-medium text-muted-foreground">
              {dayName.charAt(0)}
            </div>
          )
        })}
      </div>

      {/* Calendar grid with animation */}
      <AnimatePresence mode="wait" custom={animationDirection}>
        <motion.div
          key={format(month, "yyyy-MM")}
          custom={animationDirection}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className="grid grid-cols-7 gap-1"
        >
          {days.map((day, index) => {
            if (!showOutsideDays && day.isOutsideMonth) {
              return <div key={index} className="h-9 w-9" />
            }

            return (
              <div key={index} className="relative flex h-9 w-9 items-center justify-center">
                <button
                  type="button"
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors",
                    day.isOutsideMonth && "text-muted-foreground/50",
                    day.isDisabled && "text-muted-foreground opacity-50 cursor-not-allowed",
                    !day.isDisabled && "hover:bg-accent",
                    day.isSelected &&
                      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                    day.isWithinRange && "bg-primary/20 rounded-none",
                    day.isRangeStart && "rounded-l-full",
                    day.isRangeEnd && "rounded-r-full",
                    highlightToday && day.isToday && !day.isSelected && "border border-primary text-primary",
                    day.marked &&
                      !day.isSelected &&
                      !day.isWithinRange &&
                      `ring-1 ring-inset ${day.marked.color || "ring-primary"}`,
                    day.marked?.className,
                  )}
                  onClick={() => handleDaySelect(day)}
                  disabled={day.isDisabled}
                  tabIndex={day.isOutsideMonth ? -1 : 0}
                  aria-label={format(day.date, "PPP")}
                  aria-selected={day.isSelected || day.isWithinRange}
                >
                  {format(day.date, "d")}
                  {day.marked && !day.isSelected && !day.isWithinRange && (
                    <span
                      className={cn(
                        "absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full",
                        day.marked.color || "bg-primary",
                      )}
                    />
                  )}
                </button>
              </div>
            )
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
