import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import { sessionSurface } from "@/pages/session/lib/session-styles";
import { TASK_ROW_GRID_COLUMNS } from "@/pages/session/ui/tasks/model/sessionWorkspaceTypes";

const skeletonStatusProps = {
  role: "status" as const,
  "aria-busy": true,
  "aria-label": "Загрузка",
};

function SkeletonBlock({ className }: { className?: string }) {
  return <Skeleton className={cn("rounded-md", className)} />;
}

function TaskRowSkeleton() {
  return (
    <div
      className="grid h-11 items-center gap-2 border-b border-border/20 px-2 last:border-0"
      style={{ gridTemplateColumns: TASK_ROW_GRID_COLUMNS }}
    >
      <SkeletonBlock className="size-4 rounded-[4px]" />
      <SkeletonBlock className="size-4 rounded-full" />
      <SkeletonBlock className="h-3 w-14" />
      <SkeletonBlock className="size-4 rounded-full" />
      <SkeletonBlock className="h-3 w-full max-w-[220px]" />
      <SkeletonBlock className="h-3 w-10 justify-self-end" />
      <SkeletonBlock className="size-7 rounded-full justify-self-end" />
    </div>
  );
}

function WorkspaceTasksToolbarSkeleton() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SkeletonBlock className="h-8 w-24 rounded-full" />
      <SkeletonBlock className="h-8 w-20 rounded-full" />
      <SkeletonBlock className="h-8 w-20 rounded-full" />
      <SkeletonBlock className="ml-auto h-8 w-8 rounded-full" />
    </div>
  );
}

export function WorkspaceTasksSkeleton({ className }: { className?: string }) {
  return (
    <div
      {...skeletonStatusProps}
      className={cn("flex w-full min-w-0 flex-col gap-3", className)}
    >
      <WorkspaceTasksToolbarSkeleton />
      <div className={cn(sessionSurface, "overflow-hidden p-1")}>
        {Array.from({ length: 7 }).map((_, index) => (
          <TaskRowSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

function WorkspaceHubCardSkeleton() {
  return (
    <div className="flex h-[52px] items-center justify-between gap-3 rounded-2xl bg-muted/40 px-4 ring-1 ring-border/30">
      <div className="flex min-w-0 items-center gap-2.5">
        <SkeletonBlock className="size-4 shrink-0 rounded-md" />
        <SkeletonBlock className="h-3.5 w-32 max-w-[40vw]" />
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <SkeletonBlock className="h-3 w-4" />
        <SkeletonBlock className="size-4 rounded-md" />
      </div>
    </div>
  );
}

function WorkspaceHubGroupSkeleton({
  titleWidth = "w-28",
  rows = 3,
}: {
  titleWidth?: string;
  rows?: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <SkeletonBlock className={cn("h-3", titleWidth)} />
      <div className="flex flex-col gap-2">
        {Array.from({ length: rows }).map((_, index) => (
          <WorkspaceHubCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function WorkspaceHubListSkeleton({ className }: { className?: string }) {
  return (
    <div
      {...skeletonStatusProps}
      className={cn("flex flex-col gap-5", className)}
    >
      <SkeletonBlock className="h-3 w-24" />
      <WorkspaceHubGroupSkeleton titleWidth="w-24" rows={3} />
      <WorkspaceHubGroupSkeleton titleWidth="w-36" rows={2} />
    </div>
  );
}

function WorkspaceGridRowSkeleton() {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5">
      <SkeletonBlock className="size-7 shrink-0 rounded-md" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <SkeletonBlock className="h-3.5 w-40 max-w-[50vw]" />
        <SkeletonBlock className="h-3 w-24" />
      </div>
      <SkeletonBlock className="hidden h-3 w-8 sm:block" />
      <SkeletonBlock className="hidden h-3 w-10 sm:block" />
    </div>
  );
}

export function WorkspaceGridSkeleton({ className }: { className?: string }) {
  return (
    <div
      {...skeletonStatusProps}
      className={cn("mx-auto flex w-full max-w-3xl flex-col gap-3", className)}
    >
      <div className="space-y-1 px-1">
        <SkeletonBlock className="h-7 w-36" />
        <SkeletonBlock className="h-3 w-52" />
      </div>
      <div className="overflow-hidden rounded-xl border border-border/60">
        <div className="border-b border-primary/10 px-4 py-2.5">
          <SkeletonBlock className="h-3 w-20" />
        </div>
        <div className="divide-y divide-border/40">
          {Array.from({ length: 4 }).map((_, index) => (
            <WorkspaceGridRowSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MemberRowSkeleton() {
  return (
    <div className="flex items-center gap-2.5 rounded-lg px-1 py-2">
      <SkeletonBlock className="size-8 shrink-0 rounded-full" />
      <SkeletonBlock className="h-3.5 w-32 max-w-[40vw]" />
      <SkeletonBlock className="ml-auto h-7 w-[7.5rem] rounded-full" />
    </div>
  );
}

export function WorkspaceMembersPageSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      {...skeletonStatusProps}
      className={cn("mx-auto flex w-full max-w-3xl flex-col gap-3", className)}
    >
      <div className="space-y-3">
        <SkeletonBlock className="h-7 w-36" />
        <div className="max-w-sm space-y-1.5">
          <SkeletonBlock className="h-3 w-14" />
          <SkeletonBlock className="h-9 w-full rounded-xl" />
        </div>
      </div>
      <div className={cn(sessionSurface, "overflow-hidden p-4")}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="space-y-1.5">
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-3 w-28" />
          </div>
          <SkeletonBlock className="h-8 w-36 rounded-full" />
        </div>
        <div className="flex flex-col gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <MemberRowSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function MemberListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div {...skeletonStatusProps} className="flex flex-col gap-1 py-1">
      {Array.from({ length: rows }).map((_, index) => (
        <MemberRowSkeleton key={index} />
      ))}
    </div>
  );
}

export function SubtaskListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <ul {...skeletonStatusProps} className="flex flex-col gap-2 pl-5 py-1">
      {Array.from({ length: rows }).map((_, index) => (
        <li key={index} className="flex items-center gap-2">
          <SkeletonBlock className="size-6 shrink-0 rounded-md" />
          <SkeletonBlock className="h-3.5 w-full max-w-[240px]" />
        </li>
      ))}
    </ul>
  );
}

export function ActivityTimelineSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div {...skeletonStatusProps} className="mt-4 space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex gap-3">
          <SkeletonBlock className="size-7 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2 pt-0.5">
            <SkeletonBlock className="h-3.5 w-28" />
            <SkeletonBlock className="h-3 w-full max-w-sm" />
            <SkeletonBlock className="h-2.5 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function InviteUserListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <ul {...skeletonStatusProps} className="flex max-h-64 flex-col gap-1">
      {Array.from({ length: rows }).map((_, index) => (
        <li
          key={index}
          className="flex items-center justify-between gap-2 rounded-xl bg-muted/30 px-2.5 py-2 ring-1 ring-border/20"
        >
          <SkeletonBlock className="h-3.5 w-28" />
          <SkeletonBlock className="h-7 w-24 rounded-full" />
        </li>
      ))}
    </ul>
  );
}

export function SidebarTreeSkeleton() {
  return (
    <div {...skeletonStatusProps} className="flex flex-col gap-1 py-0.5 pl-1">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-1">
          <SkeletonBlock className="h-8 w-full rounded-[10px]" />
          {index === 0 ? (
            <div className="ml-3 flex flex-col gap-1 border-l border-border/30 pl-2">
              <SkeletonBlock className="h-7 w-full rounded-[8px]" />
              <SkeletonBlock className="h-7 w-[85%] rounded-[8px]" />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function AdminAccessSkeleton({ className }: { className?: string }) {
  return (
    <div
      {...skeletonStatusProps}
      className={cn(
        "mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 py-8",
        className,
      )}
    >
      <SkeletonBlock className="h-8 w-64" />
      <SkeletonBlock className="h-14 w-full rounded-2xl" />
      <div className="grid gap-2 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-20 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export function AdminHealthSkeleton() {
  return (
    <div
      {...skeletonStatusProps}
      className="flex items-center gap-3 overflow-hidden rounded-xl border border-border/60 px-4 py-3.5"
    >
      <SkeletonBlock className="size-8 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <SkeletonBlock className="h-3.5 w-40" />
        <SkeletonBlock className="h-3 w-28" />
      </div>
    </div>
  );
}

export function AdminMetricsSkeleton() {
  const cellBorder = [
    "border-b border-border/40 sm:border-r",
    "border-b border-border/40",
    "border-b border-border/40 sm:border-b-0 sm:border-r",
    "",
  ] as const;

  return (
    <div {...skeletonStatusProps} className="grid sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className={cn("min-h-[4.75rem] space-y-1.5 px-4 py-3", cellBorder[index])}
        >
          <SkeletonBlock className="h-3 w-16" />
          <SkeletonBlock className="h-6 w-12" />
        </div>
      ))}
    </div>
  );
}

export function AdminFlagsSkeleton() {
  return (
    <div {...skeletonStatusProps} className="divide-y divide-border/40">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-start gap-3 px-4 py-3">
          <div className="min-w-0 flex-1 space-y-1.5">
            <SkeletonBlock className="h-3.5 w-28" />
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="h-3 w-full max-w-sm" />
          </div>
          <SkeletonBlock className="h-7 w-12 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function AdminUsersTableSkeleton() {
  return (
    <div {...skeletonStatusProps} className="divide-y divide-border/40">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,2fr)_repeat(3,minmax(0,1fr))] gap-3 px-4 py-2.5"
        >
          <SkeletonBlock className="h-3 w-8" />
          <SkeletonBlock className="h-3.5 w-24" />
          <SkeletonBlock className="h-3.5 w-36" />
          <SkeletonBlock className="h-3 w-6" />
          <SkeletonBlock className="h-3 w-6" />
          <SkeletonBlock className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

export function AdminErrorLogsSkeleton() {
  return (
    <div {...skeletonStatusProps} className="divide-y divide-border/40">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="space-y-1.5 px-4 py-3">
          <SkeletonBlock className="h-3 w-40" />
          <SkeletonBlock className="h-3 w-full max-w-md" />
          <SkeletonBlock className="h-3.5 w-[70%]" />
        </div>
      ))}
    </div>
  );
}

export function LlmKeysTableSkeleton() {
  return (
    <div {...skeletonStatusProps} className={cn(sessionSurface, "overflow-hidden p-1")}>
      <div className="divide-y divide-border">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex h-12 items-center gap-6 px-3"
          >
            <SkeletonBlock className="h-3 w-28" />
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="h-3 w-32" />
            <SkeletonBlock className="ml-auto h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function RequireAdminSkeleton() {
  return (
    <div
      {...skeletonStatusProps}
      className="flex min-h-[min(420px,52dvh)] flex-1 items-center justify-center px-6 py-12"
    >
      <div className="w-full max-w-md space-y-4">
        <SkeletonBlock className="mx-auto h-7 w-48" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="mx-auto h-4 w-3/4" />
      </div>
    </div>
  );
}

export function SystemStatusTableSkeleton({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const rows = (
    <div className="divide-y divide-border/40">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 px-4 py-3">
          <SkeletonBlock className="size-2 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <SkeletonBlock className="h-3.5 w-28 max-w-[40%]" />
            <SkeletonBlock className="h-3 w-40 max-w-[55%]" />
          </div>
        </div>
      ))}
    </div>
  );

  if (embedded) {
    return (
      <div {...skeletonStatusProps} className="w-full">
        {rows}
      </div>
    );
  }

  return (
    <div
      {...skeletonStatusProps}
      className="overflow-hidden rounded-xl border border-border/60"
    >
      {rows}
    </div>
  );
}
