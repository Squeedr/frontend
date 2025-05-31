import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { WorkspaceDetailsContent } from "./workspace-details-content"
import type { Workspace } from "@/lib/types"

interface WorkspaceDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspace: Workspace | null
  onEdit: (workspace: Workspace) => void
}

export function WorkspaceDetailsModal({ open, onOpenChange, workspace, onEdit }: WorkspaceDetailsModalProps) {
  if (!workspace) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl p-4 md:p-8">
        <DialogHeader>
          <DialogTitle>Workspace Details</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <WorkspaceDetailsContent workspace={workspace} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onEdit(workspace)}>
            Edit
          </Button>
          <Button variant="default" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 