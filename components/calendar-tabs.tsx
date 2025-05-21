"use client"

import type React from "react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CalendarTabsProps {
  defaultValue?: string
  children: React.ReactNode
  onValueChange?: (value: string) => void
}

export default function CalendarTabs({ defaultValue = "calendar", children, onValueChange }: CalendarTabsProps) {
  return (
    <Tabs defaultValue={defaultValue} onValueChange={onValueChange}>
      <TabsList>
        <TabsTrigger value="calendar">Calendar</TabsTrigger>
        <TabsTrigger value="integration">Integration</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  )
}
