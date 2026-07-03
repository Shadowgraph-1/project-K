import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";

import { useAgentMode } from "@/pages/session/model/AgentModeContext";

import { useSessionPageSectionConfig } from "../../model/SessionPageSectionContext";

type SessionHeaderSectionSelectProps = {
  className?: string;
};

export function SessionHeaderSectionSelect({
  className,
}: SessionHeaderSectionSelectProps) {
  const config = useSessionPageSectionConfig();
  const { setOpen: setAgentModeOpen } = useAgentMode();
  if (!config) return null;

  const current =
    config.options.find((option) => option.id === config.value) ??
    config.options[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={config.ariaLabel}
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 text-sm font-medium outline-none transition-colors",
            "text-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary",
            "data-[state=open]:text-primary",
            className,
          )}
        >
          <span>{current?.label}</span>
          <ChevronDown className="size-3 shrink-0" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="min-w-40 rounded-xl">
        <DropdownMenuRadioGroup
          value={config.value}
          onValueChange={(id) => {
            setAgentModeOpen(false);
            config.onChange(id);
          }}
        >
          {config.options.map((option) => (
            <DropdownMenuRadioItem key={option.id} value={option.id}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
