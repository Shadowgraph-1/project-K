"use client";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { cn } from "@/shared/lib/utils";
import { SettingsPanel } from "@/pages/session/ui/settings/settings-panel";

type SettingsDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
};

export function SettingsDialog({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
}: SettingsDialogProps = {}) {
  const isControlled = controlledOpen !== undefined;

  if (!isControlled && !defaultOpen) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm">Настройки</Button>
        </DialogTrigger>
        <DialogContent
          showCloseButton
          className={cn(
            "flex max-h-[calc(100dvh-4rem)] flex-col gap-0 overflow-hidden rounded-3xl p-0",
            "md:h-[min(640px,75vh)] md:max-h-[640px] md:w-[min(768px,calc(100%-2rem))] md:max-w-3xl",
          )}
        >
          <DialogTitle className="sr-only">Настройки</DialogTitle>
          <DialogDescription className="sr-only">
            Личный кабинет и настройки аккаунта Kono.
          </DialogDescription>
          <div className="overflow-y-auto p-5">
            <SettingsPanel showIntegrations={false} />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={controlledOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className={cn(
          "flex max-h-[calc(100dvh-4rem)] flex-col gap-0 overflow-hidden rounded-3xl p-0",
          "md:h-[min(640px,75vh)] md:max-h-[640px] md:w-[min(768px,calc(100%-2rem))] md:max-w-3xl",
        )}
      >
        <DialogTitle className="sr-only">Настройки</DialogTitle>
        <DialogDescription className="sr-only">
          Личный кабинет и настройки аккаунта Kono.
        </DialogDescription>
        <div className="overflow-y-auto p-5">
          <SettingsPanel showIntegrations={false} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
