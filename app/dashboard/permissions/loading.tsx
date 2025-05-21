import { DashboardLayout } from "@/components/dashboard-layout"
import { Skeleton } from "@/components/ui/skeleton"

export default function PermissionsLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-4 w-[350px] mt-2" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Skeleton className="h-[500px] w-full rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-[500px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
