import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { buttonVariants } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { SUBTASK_STATUSES, type SubtaskStatus } from "@/shared/constants/subtask-statuses";

type SubtaskStatusDropdownProps = {
  status: SubtaskStatus;
  onChange: (status: SubtaskStatus) => void;
  className?: string;
};

export function SubtaskStatusDropdown({
  status,
  onChange,
  className,
}: SubtaskStatusDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "xs" }),
          "h-auto shrink-0",
          className,
        )}
      >
        <span className="max-w-28 truncate">{status}</span>
        <ChevronDown className="size-3 opacity-50" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {SUBTASK_STATUSES.map((option) => (
          <DropdownMenuItem
            key={option}
            className="cursor-pointer text-xs"
            onSelect={() => onChange(option)}
          >
            {option}
            {status === option ? (
              <Check className="ml-auto size-3.5 shrink-0 text-muted-foreground" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
