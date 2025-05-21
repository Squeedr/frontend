"use client"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Form schema validation
const workspaceFormSchema = z.object({
  name: z.string().min(3, {
    message: "Workspace name must be at least 3 characters.",
  }),
  description: z.string().optional(),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters.",
  }),
  capacity: z.coerce.number().min(1, {
    message: "Capacity must be at least 1.",
  }),
})

export type WorkspaceFormValues = z.infer<typeof workspaceFormSchema>

interface WorkspaceFormProps {
  defaultValues?: Partial<WorkspaceFormValues>
  onSubmit: (data: WorkspaceFormValues) => void
  onCancel: () => void
  isSubmitting: boolean
  submitLabel: string
}

export function WorkspaceForm({
  defaultValues = {
    name: "",
    description: "",
    location: "",
    capacity: 1,
  },
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
}: WorkspaceFormProps) {
  const form = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceFormSchema),
    defaultValues,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Workspace Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter workspace name" {...field} />
              </FormControl>
              <FormDescription>A descriptive name for the workspace.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter a description of the workspace"
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>Optional: Provide details about the workspace features and purpose.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Location <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter workspace location" {...field} />
                </FormControl>
                <FormDescription>The physical location of the workspace.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Capacity <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="number" min={1} placeholder="Enter maximum capacity" {...field} />
                </FormControl>
                <FormDescription>Maximum number of people the workspace can accommodate.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}
