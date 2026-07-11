import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

export type SessionPageFrameVariant =
  | "hub"
  | "flush"
  | "projects"
  | "workspace-new"
  | "tasks"
  | "tasks-detail";

const VARIANT_CLASS: Record<SessionPageFrameVariant, string> = {
  hub: "overflow-auto px-3 pb-4 pt-3 [scrollbar-gutter:stable] sm:px-6 sm:pb-6 sm:pt-6",
  flush: "overflow-auto p-3 [scrollbar-gutter:stable] sm:p-6",
  projects: "min-w-0 overflow-x-hidden overflow-y-auto px-3 pb-4 pt-3 [scrollbar-gutter:stable] sm:px-6 sm:pb-6 sm:pt-4",
  "workspace-new": "overflow-y-auto p-3 [scrollbar-gutter:stable] sm:p-6",
  tasks: "min-w-0 overflow-auto p-3 [scrollbar-gutter:stable] sm:p-6",
  "tasks-detail": "min-w-0 overflow-hidden p-0 [scrollbar-gutter:stable]",
};

type SessionPageFrameProps = {
  children: ReactNode;
  variant?: SessionPageFrameVariant;
};

export function SessionPageFrame({
  children,
  variant = "hub",
}: SessionPageFrameProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-0 flex-1 flex-col [scrollbar-gutter:stable]",
        VARIANT_CLASS[variant],
      )}
    >
      {children}
    </div>
  );
}