"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

interface Tab {
  label: string
  value: string
  href?: string
}

interface TabsProps {
  tabs: Tab[]
  defaultValue?: string
  onChange?: (value: string) => void
}

export function Tabs({ tabs, defaultValue, onChange }: TabsProps) {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0].value)

  const handleTabChange = (tab: Tab) => {
    if (!tab.href) {
      setActiveTab(tab.value)
      if (onChange) {
        onChange(tab.value)
      }
    }
  }

  return (
    <div className="border-b">
      <div className="flex space-x-6">
        {tabs.map((tab) => {
          const isActive = tab.href ? pathname === tab.href : activeTab === tab.value

          const TabComponent = tab.href ? Link : "button"

          return (
            <TabComponent
              key={tab.value}
              href={tab.href || "#"}
              type={tab.href ? undefined : "button"}
              onClick={() => !tab.href && handleTabChange(tab)}
              className={cn(
                "py-3 text-sm font-medium relative",
                isActive ? "text-black" : "text-gray-500 hover:text-gray-700",
              )}
            >
              {tab.label}
              {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
            </TabComponent>
          )
        })}
      </div>
    </div>
  )
}
