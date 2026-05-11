import { Flame, ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import Live2DCanvas from "@/shared/live2d/Live2DCanvas";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { SESSION_CHARACTERS } from "../model/sessionConstants";
import TeamSession from "./TeamSession";

type SessionWorkspaceSidebarProps = {
  modelIndex: number;
  character: string;
  onCharacterChange: (id: string) => void;
};

export function SessionWorkspaceSidebar({
  modelIndex,
  character,
  onCharacterChange,
}: SessionWorkspaceSidebarProps) {
  const selected = SESSION_CHARACTERS.find((c) => c.id === character);

  return (
    <div className="flex w-full min-h-0 shrink-0 flex-col gap-3 lg:sticky lg:top-4 lg:w-[min(380px,36vw)] lg:max-w-[420px]">
      <aside aria-label="Компаньон" className="w-full min-h-0">
        <div className="flex min-h-0 w-full flex-col gap-3 rounded-xl border border-border/70 bg-card/40 p-3 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-muted-foreground">
              Персонаж
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-10 shrink-0 gap-1.5 rounded-full border border-border/80 bg-background/80 px-1.5 pr-2 hover:bg-muted/80"
                  aria-label="Выбрать модель"
                >
                  <Avatar className="size-8 border border-border">
                    <AvatarImage
                      src={selected?.avatar}
                      alt={selected?.name ?? ""}
                    />
                    <AvatarFallback>{selected?.name?.[0] ?? "?"}</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="size-4 opacity-60" aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Модель
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={character}
                  onValueChange={onCharacterChange}
                >
                  {SESSION_CHARACTERS.map((c) => (
                    <DropdownMenuRadioItem
                      key={c.id}
                      value={c.id}
                      className="gap-2 text-xs"
                    >
                      <Avatar className="size-7 border border-border">
                        <AvatarImage src={c.avatar} alt="" />
                        <AvatarFallback>{c.name[0]}</AvatarFallback>
                      </Avatar>
                      {c.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="relative mx-auto flex w-full max-w-[240px] justify-center">
            <div
              className={cn(
                "relative aspect-3/4 w-full overflow-hidden rounded-lg",
                "min-h-[220px] max-h-[min(360px,48vh)] bg-transparent",
              )}
            >
              <Live2DCanvas
                lookAtPointer="off"
                modelIndex={modelIndex}
                className="pointer-events-auto h-full w-full bg-transparent"
                showModel
              />
            </div>
          </div>
        </div>
      </aside>

      <aside
        aria-label="Команда"
        className="flex min-h-0 w-full flex-col gap-3 rounded-xl border border-border/50 bg-muted/15 p-4"
      >
        <TeamSession />
      </aside>
      <aside
        aria-label="Стрик"
        className="flex min-h-0 w-full flex-col gap-3 rounded-xl border border-border/50 bg-muted/15 p-4"
      >
        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-2">
            Посещения
            <Flame size={15} />
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-2.5 w-2.5 rounded-sm",
                  (i * 7 + 3) % 11 < 6
                    ? "bg-foreground"
                    : "bg-zinc-200 dark:bg-zinc-600",
                )}
              />
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
