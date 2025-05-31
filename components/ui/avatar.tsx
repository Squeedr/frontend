"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"
import { OptimizedImage } from "@/components/ui/optimized-image"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, src, alt, ...props }, ref) => {
  // If src is provided and is a string, use OptimizedImage
  if (src && typeof src === 'string') {
    return (
      <div className={cn("h-full w-full", className)}>
        <OptimizedImage
          src={src}
          alt={alt || "Avatar"}
          width={40}
          height={40}
          objectFit="cover"
          className="h-full w-full rounded-full"
        />
      </div>
    )
  }
  
  // Otherwise, use the original AvatarPrimitive.Image
  return (
    <AvatarPrimitive.Image 
      ref={ref} 
      className={cn("aspect-square h-full w-full", className)} 
      src={src} 
      alt={alt} 
      {...props} 
    />
  )
})
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
