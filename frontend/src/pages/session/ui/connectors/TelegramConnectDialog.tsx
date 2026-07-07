import { useEffect, useState } from "react";

import { isValidTelegramChatId } from "@/shared/config/telegram-connector";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

const STEPS = [
  "Откройте бота уведомлений Kono в Telegram и нажмите «Старт».",
  "Откройте @userinfobot, нажмите «Старт» и скопируйте число Id.",
  "Вставьте Id в поле ниже и нажмите «Подключить».",
] as const;

type TelegramConnectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialChatId?: string | null;
  busy?: boolean;
  onSubmit: (chatId: string) => void;
};

export function TelegramConnectDialog({
  open,
  onOpenChange,
  initialChatId = null,
  busy = false,
  onSubmit,
}: TelegramConnectDialogProps) {
  const [chatId, setChatId] = useState("");

  useEffect(() => {
    if (open) {
      setChatId(initialChatId ?? "");
    }
  }, [open, initialChatId]);

  const valid = isValidTelegramChatId(chatId);
  const isEdit = Boolean(initialChatId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Изменить Telegram ID" : "Подключить Telegram"}
          </DialogTitle>
          <DialogDescription>
            Вставьте свой ID — на него будут приходить уведомления о задачах.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="rounded-xl border border-border/50 bg-muted/20 px-3 py-2.5">
            <p className="mb-2 text-xs font-medium text-foreground">
              Как получить ID
            </p>
            <ol className="space-y-1.5">
              {STEPS.map((step, index) => (
                <li
                  key={step}
                  className="flex gap-2 text-xs leading-relaxed text-muted-foreground"
                >
                  <span className="shrink-0 font-medium text-foreground">
                    {index + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-2">
            <Label htmlFor="telegram-chat-id">Ваш Telegram ID</Label>
            <Input
              id="telegram-chat-id"
              value={chatId}
              onChange={(event) => setChatId(event.target.value)}
              placeholder="Например 123456789"
              autoComplete="off"
              inputMode="numeric"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => onOpenChange(false)}
          >
            Отмена
          </Button>
          <Button
            type="button"
            disabled={busy || !valid}
            onClick={() => onSubmit(chatId.trim())}
          >
            {isEdit ? "Сохранить" : "Подключить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}