import { LogoThemeDemo } from "@/components/logo-theme-demo"

export default function LogoThemeDemoPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Logo Theme Customization</h1>
      <p className="text-muted-foreground mb-8">
        This page demonstrates how the Squeedr logo can adapt to different themes and color schemes.
      </p>
      <LogoThemeDemo />
    </div>
  )
}
