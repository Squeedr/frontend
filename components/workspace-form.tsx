"use client"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { X, Plus as PlusIcon, Upload, Loader2 } from "lucide-react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

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
  type: z.string().min(1, { message: "Type is required." }),
  hourlyRate: z.coerce.number().min(0, { message: "Hourly rate must be 0 or more." }),
  amenities: z.array(z.string()).optional(),
  image: z.any().optional(),
})

export type WorkspaceFormValues = z.infer<typeof workspaceFormSchema>

interface WorkspaceFormProps {
  defaultValues?: Partial<WorkspaceFormValues>
  onSubmit: (data: WorkspaceFormValues) => void
  onCancel: () => void
  isSubmitting: boolean
  submitLabel: string
}

const AMENITY_OPTIONS = [
  "WiFi",
  "Projector",
  "Whiteboard",
  "TV Screen",
  "Video Conferencing",
  "Coffee Machine",
  "Air Conditioning",
  "Flexible Furniture",
  "Desk",
  "Phone",
  "Printer",
]

export function WorkspaceForm({
  defaultValues = {
    name: "",
    description: "",
    location: "",
    capacity: 1,
    type: "",
    hourlyRate: 0,
    amenities: [],
    image: undefined,
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
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [amenityInput, setAmenityInput] = useState("")
  const amenities = form.watch("amenities") || []
  const imageFile = form.watch("image")

  // Dropzone for image
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      form.setValue("image", acceptedFiles[0])
      setImagePreview(URL.createObjectURL(acceptedFiles[0]))
    }
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })
  const handleRemoveImage = () => {
    form.setValue("image", undefined)
    setImagePreview(null)
  }
  const handleAddAmenity = () => {
    if (amenityInput.trim() && !amenities.includes(amenityInput.trim())) {
      form.setValue("amenities", [...amenities, amenityInput.trim()])
      setAmenityInput("")
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add Workspace</DialogTitle>
        <DialogDescription>
          Enter the details for the new workspace. All fields are required unless marked as optional.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Workspace Name</Label>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input id="name" placeholder="e.g., Main Conference Center" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Conference Room">Conference Room</SelectItem>
                        <SelectItem value="Meeting Room">Meeting Room</SelectItem>
                        <SelectItem value="Office">Office</SelectItem>
                        <SelectItem value="Collaboration Space">Collaboration Space</SelectItem>
                        <SelectItem value="Desk">Desk</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input id="location" placeholder="e.g., Floor 3, Building A or Cloud" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input id="capacity" type="number" min={1} placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input id="hourlyRate" type="number" min={0} step={0.01} placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      id="description"
                      placeholder="Describe the workspace, its features, and purpose..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amenities">Amenities</Label>
            <div className="flex gap-2 items-end">
              <Input
                id="amenities"
                placeholder="e.g., Projector, Whiteboard"
                value={amenityInput}
                onChange={e => setAmenityInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddAmenity() } }}
                aria-label="Add amenity"
              />
              <Button type="button" variant="outline" onClick={handleAddAmenity} className="h-10 px-3" aria-label="Add amenity">
                <PlusIcon className="w-4 h-4" />
              </Button>
            </div>
            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {amenities.map((amenity: string, idx: number) => (
                  <span key={amenity + idx} className="inline-flex items-center px-2 py-1 bg-muted rounded text-sm">
                    {amenity}
                    <button type="button" className="ml-1" onClick={() => form.setValue('amenities', amenities.filter((a: string, i: number) => i !== idx))} aria-label={`Remove amenity ${amenity}`}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Workspace Image (Optional)</Label>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <div
                    {...getRootProps()}
                    aria-label="Workspace image upload"
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? "border-blue-500 bg-blue-50" : "border-muted"} ${isSubmitting ? "opacity-60 pointer-events-none" : ""} hover:border-blue-400 hover:bg-blue-50`}
                  >
                    <input {...getInputProps()} disabled={isSubmitting} />
                    {imagePreview ? (
                      <div className="flex flex-col items-center gap-2">
                        <Image src={imagePreview} alt="Preview" width={200} height={120} className="rounded object-cover" />
                        {imageFile && (
                          <span className="text-xs text-muted-foreground">{imageFile.name} ({(imageFile.size/1024).toFixed(1)} KB)</span>
                        )}
                        <Button type="button" variant="outline" size="sm" onClick={handleRemoveImage}>
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                        <span className="text-muted-foreground">Upload a file or <span className="text-blue-600 underline">drag and drop</span></span>
                        <span className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</span>
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-black text-white hover:bg-gray-900 flex items-center justify-center">
              {isSubmitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              {isSubmitting ? "Submitting..." : submitLabel}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}

