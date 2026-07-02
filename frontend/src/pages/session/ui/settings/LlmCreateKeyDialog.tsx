import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  sessionField,
  sessionPillOutline,
} from "@/pages/session/lib/session-styles";
import { FIELD_LIMITS } from "@/shared/constants/field-limits";

type LlmCreateKeyDialogProps = {
  open: boolean;
  busy: boolean;
  isCreating: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (payload: { label: string; apiKey: string }) => void;
  initialLabel?: string;
};

export function LlmCreateKeyDialog({
  open,
  busy,
  isCreating,
  onOpenChange,
  onCreate,
  initialLabel = "",
}: LlmCreateKeyDialogProps) {
  const [label, setLabel] = useState(initialLabel);
  const [apiKey, setApiKey] = useState("");

  function resetForm() {
    setLabel("");
    setApiKey("");
  }

  function handleOpenChange(next: boolean) {
    if (!next) resetForm();
    onOpenChange(next);
  }

  function handleCreate() {
    const trimmedKey = apiKey.trim();
    if (trimmedKey.length < 8) return;
    onCreate({ label: label.trim(), apiKey: trimmedKey });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-5 rounded-2xl border-0 bg-background p-6 shadow-xl ring-1 ring-border/40 sm:max-w-md">
        <DialogHeader className="gap-1.5 text-left">
          <DialogTitle className="text-xl font-medium">
            Создать API ключ
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            Ключ сохранится в аккаунте. После создания виден только маской.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="llm-create-label"
              className="text-xs text-muted-foreground"
            >
              Название
            </Label>
            <Input
              id="llm-create-label"
              placeholder="OpenRouter, OpenAI…"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              disabled={busy}
              maxLength={FIELD_LIMITS.llmKeyLabel}
              className={sessionField}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="llm-create-key"
              className="text-xs text-muted-foreground"
            >
              API ключ
            </Label>
            <Input
              id="llm-create-key"
              type="password"
              autoComplete="off"
              placeholder="apiKey-…"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={busy}
              showCharCount={false}
              className={sessionField}
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className={sessionPillOutline}
            onClick={() => handleOpenChange(false)}
            disabled={busy}
          >
            Отмена
          </Button>
          <Button
            type="button"
            className="rounded-full px-5"
            onClick={handleCreate}
            disabled={busy || apiKey.trim().length < 8}
          >
            {isCreating ? "Создание…" : "Создать"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
