import { useCollaborationModalStore } from "@/shared/model/useCollaborationModalStore";
import { useWorkspaceQuery } from "@/entities/workspace/model/use-workspace-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { WorkspaceMembersPanel } from "./WorkspaceMembersPanel";

export function WorkspaceCollaborationDialog() {
  const open = useCollaborationModalStore((s) => s.open);
  const workspaceId = useCollaborationModalStore((s) => s.workspaceId);
  const workspaceTitle = useCollaborationModalStore((s) => s.workspaceTitle);

  const { data: workspaces = [] } = useWorkspaceQuery();

  const resolvedWorkspace = workspaceId
    ? workspaces.find((w) => w.id === workspaceId)
    : undefined;
  const effectiveTitle = workspaceTitle ?? resolvedWorkspace?.title ?? "Проект";

  function handleDialogOpenChange(next: boolean) {
    if (!next) {
      useCollaborationModalStore.getState().closeCollaboration();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="flex max-h-[min(32rem,85vh)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 border-b border-border px-6 py-4 text-left">
          <DialogTitle>Участники</DialogTitle>
          <DialogDescription>
            {workspaceId
              ? `Проект «${effectiveTitle}» — приглашения, роли и доступ`
              : "Откройте проект"}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          {!workspaceId ? (
            <p className="text-sm text-muted-foreground">
              Откройте проект из списка задач.
            </p>
          ) : (
            <WorkspaceMembersPanel
              workspaceId={workspaceId}
              workspaceTitle={effectiveTitle}
              onLeaveSuccess={() => handleDialogOpenChange(false)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
