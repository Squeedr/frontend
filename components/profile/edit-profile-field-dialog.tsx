"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { profileFields } from "@/lib/profile-completion"
import type { UserRole } from "@/lib/types"

interface EditProfileFieldDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  field: string
  role: UserRole
  currentValue: any
  onSave: (field: string, value: any) => void
}

export function EditProfileFieldDialog({
  open,
  onOpenChange,
  field,
  role,
  currentValue,
  onSave,
}: EditProfileFieldDialogProps) {
  const [value, setValue] = useState<any>(currentValue || "")

  // Get field label
  const getFieldLabel = () => {
    const baseFields = profileFields.base
    const roleFields = profileFields.roleSpecific[role]

    if (baseFields[field]) {
      return baseFields[field].label
    }

    if (roleFields && roleFields[field]) {
      return roleFields[field].label
    }

    return field.charAt(0).toUpperCase() + field.slice(1)
  }

  const handleSave = () => {
    onSave(field, value)
    onOpenChange(false)
  }

  // Render appropriate input based on field type
  const renderFieldInput = () => {
    // Handle array values (skills, education, etc.)
    if (Array.isArray(currentValue)) {
      return (
        <Textarea
          value={Array.isArray(value) ? value.join(", ") : value}
          onChange={(e) => setValue(e.target.value.split(",").map((item) => item.trim()))}
          placeholder={`Enter ${getFieldLabel().toLowerCase()} (comma separated)`}
          className="min-h-[100px]"
        />
      )
    }

    // Handle boolean values
    if (typeof currentValue === "boolean" || field === "paymentInfo" || field === "availability") {
      return (
        <div className="flex items-center space-x-2">
          <Button variant={value ? "default" : "outline"} onClick={() => setValue(true)}>
            Yes
          </Button>
          <Button variant={!value ? "default" : "outline"} onClick={() => setValue(false)}>
            No
          </Button>
        </div>
      )
    }

    // Handle long text
    if (field === "bio") {
      return (
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Enter your ${getFieldLabel().toLowerCase()}`}
          className="min-h-[150px]"
        />
      )
    }

    // Default to text input
    return (
      <Input
        type={field === "hourlyRate" ? "number" : "text"}
        value={value}
        onChange={(e) => setValue(field === "hourlyRate" ? Number(e.target.value) : e.target.value)}
        placeholder={`Enter your ${getFieldLabel().toLowerCase()}`}
      />
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {getFieldLabel()}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor={field}>{getFieldLabel()}</Label>
            {renderFieldInput()}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
