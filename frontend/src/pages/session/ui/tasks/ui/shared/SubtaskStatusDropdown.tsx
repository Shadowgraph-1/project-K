import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { buttonVariants } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { SUBTASK_STATUS_LABELS, SUBTASK_STATUSES, type SubtaskStatus } from "@/shared/constants/subtask-statuses";
import { SubtaskStatusIcon } from "./task-status-icons";

type SubtaskStatusDropdownProps = {
  status: SubtaskStatus;
  onChange: (status: SubtaskStatus) => void;
  className?: string;
  iconOnly?: boolean;
};

export function SubtaskStatusDropdown({
  status,
  onChange,
  className,
  iconOnly = false,
}: SubtaskStatusDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: iconOnly ? "icon-sm" : "xs" }),
          iconOnly ? "size-4 shrink-0 rounded-sm p-0" : "h-auto shrink-0",
          className,
        )}
        aria-label={iconOnly ? "Статус подзадачи" : undefined}
      >
        {iconOnly ? (
          <SubtaskStatusIcon status={status} className="size-3.5" />
        ) : (
          <>
            <span className="max-w-28 truncate">{SUBTASK_STATUS_LABELS[status]}</span>
            <ChevronDown className="size-3 opacity-50" aria-hidden />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {SUBTASK_STATUSES.map((option) => (
          <DropdownMenuItem
            key={option}
            className="cursor-pointer text-xs"
            onSelect={() => onChange(option)}
          >
            {SUBTASK_STATUS_LABELS[option]}
            {status === option ? (
              <Check className="ml-auto size-3.5 shrink-0 text-muted-foreground" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
