import { useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Bot } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/ui/tooltip";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import WorkspaceBreadrumb from "./WorkspaceBreadrumb";
import {
  SESSION_CHARACTERS,
  type SessionCharacter,
} from "../model/sessionConstants";
import { useSessionCompanionChatStore } from "@/shared/model/useSessionCompanionChatStore";

type SessionPageHeaderProps = {
  inWorkspaceFlow: boolean;
  onSessionHomeClick: () => void;
  isAuthenticated: boolean;
  hasUser: boolean;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  character: string;
  onCharacterChange: (id: string) => void;
  selectedCharacter: SessionCharacter | undefined;
};

export function SessionPageHeader({
  inWorkspaceFlow,
  onSessionHomeClick,
  isAuthenticated,
  hasUser,
  onOpenLogin,
  onOpenRegister,
  character,
  onCharacterChange,
  selectedCharacter,
}: SessionPageHeaderProps) {
  const { pathname } = useLocation();
  const showChat = useSessionCompanionChatStore((s) => s.showChat);
  const toggleChat = useSessionCompanionChatStore((s) => s.toggleChat);

  const showCharacterInHeader =
    !inWorkspaceFlow && isAuthenticated && hasUser;
  const showChatInHeader =
    isAuthenticated &&
    hasUser &&
    pathname.startsWith("/session");

  return (
    <header className="relative flex h-14 w-full items-center justify-between gap-4 bg-background px-5">
      <div className="min-w-0 flex-1">
        {inWorkspaceFlow ? (
          <WorkspaceBreadrumb onSessionHomeClick={onSessionHomeClick} />
        ) : null}
      </div>

      <div className="flex min-w-0 shrink-0 items-center justify-end gap-2">
        {!isAuthenticated || !hasUser ? (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="border border-neutral-200 bg-muted"
              onClick={onOpenLogin}
            >
              Вход
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="border border-neutral-200 bg-muted"
              onClick={onOpenRegister}
            >
              Регистрация
            </Button>
          </div>
        ) : (
          <div className="mr-1 flex min-w-0 shrink-0 flex-nowrap items-center justify-end gap-3">
            {showCharacterInHeader ? (
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-lg"
                        className="h-9 gap-1.5 rounded-full px-1.5 pr-2 hover:bg-muted"
                      >
                        <Avatar className="size-8">
                          <AvatarImage
                            src={selectedCharacter?.avatar}
                            alt={selectedCharacter?.name ?? "Персонаж"}
                          />
                          <AvatarFallback>
                            {selectedCharacter?.name?.[0] ?? "?"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={6}>
                    Персонаж
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Персонаж
                  </DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={character}
                    onValueChange={onCharacterChange}
                  >
                    {SESSION_CHARACTERS.map((c) => (
                      <DropdownMenuRadioItem
                        key={c.id}
                        value={c.id}
                        className="text-xs"
                      >
                        {c.name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
            <div className="flex shrink-0 items-center gap-0.5">
              {showChatInHeader ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size="icon"
                      variant={showChat ? "secondary" : "ghost"}
                      className="rounded-lg"
                      aria-pressed={showChat}
                      onClick={() => toggleChat()}
                    >
                      <Bot />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={6}>
                    Компаньон
                  </TooltipContent>
                </Tooltip>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
