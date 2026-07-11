import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/shared/ui/field";
import { Spinner } from "@/shared/ui/spinner";
import { FIELD_LIMITS } from "@/shared/constants/field-limits";

import { Plus} from "lucide-react";

export type CreateTaskPayload = {
  title: string;
  creator?: string;
};

type CreateTaskModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCreator?: string;
  onSubmit: (payload: CreateTaskPayload) => void | Promise<void>;
};

export function CreateTaskModal({
  open,
  onOpenChange,
  defaultCreator = "",
  onSubmit,
}: CreateTaskModalProps) {
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const creatorLabel = defaultCreator.trim();

  function reset() {
    setInput("");
    setIsSubmitting(false);
  }

  function handleOpen(next: boolean) {
    if (isSubmitting) return;
    if (!next) reset();
    onOpenChange(next);
  }

  async function handleAdd() {
    const title = input.trim();
    if (!title || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        creator: creatorLabel || undefined,
      });
      reset();
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[520px]" showCloseButton>
        <DialogHeader className="border-b bg-muted/30 px-6 py-4 pr-12">
          <div className="flex items-center gap-3">
            <div className="flex min-w-0 flex-col gap-1">
              <DialogTitle>Новая задача</DialogTitle>
              <DialogDescription>
                Создайте новую задачу и добавьте её в ваш проект.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          className="flex flex-col gap-5 px-6 py-4"
          onSubmit={(event) => {
            event.preventDefault();
            void handleAdd();
          }}
        >
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="task-title">Название</FieldLabel>
              <Input
                id="task-title"
                autoFocus
                placeholder="Например: подготовить план спринта"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isSubmitting}
                maxLength={FIELD_LIMITS.taskTitle}
              />
            </Field>

            {creatorLabel ? (
              <p className="text-xs text-muted-foreground">
                Создатель: {creatorLabel}
              </p>
            ) : null}
          </FieldGroup>
        </form>

        <DialogFooter className="shrink-0 border-t border-border/60 bg-muted/10 px-6 py-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => handleOpen(false)}
            disabled={isSubmitting}
          >
            Отмена
          </Button>
          <Button
            type="button"
            disabled={!input.trim() || isSubmitting}
            onClick={() => void handleAdd()}
          >
            {isSubmitting ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <Plus data-icon="inline-start" />
            )}
            Добавить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}