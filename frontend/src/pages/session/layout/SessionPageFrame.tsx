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
  hub: "overflow-auto px-6 pb-6 pt-4 [scrollbar-gutter:stable] sm:pt-6",
  flush: "overflow-auto p-6 [scrollbar-gutter:stable]",
  projects: "overflow-hidden px-6 pb-6 pt-4 [scrollbar-gutter:stable]",
  "workspace-new": "overflow-y-auto p-6 [scrollbar-gutter:stable]",
  tasks: "overflow-auto p-6 [scrollbar-gutter:stable]",
  "tasks-detail": "overflow-hidden p-0 [scrollbar-gutter:stable]",
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