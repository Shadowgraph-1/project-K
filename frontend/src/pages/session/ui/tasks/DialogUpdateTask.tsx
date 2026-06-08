import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { useState, type ReactNode } from "react";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { avatarColorClass } from "@/shared/lib/avatar-colors";
import { cn } from "@/shared/lib/utils";

function getUserLabel(user: { name?: string; email?: string } | null) {
  return user?.name?.trim() || user?.email || "Вы";
}

type DialogUpdateTaskProps = {
  trigger: ReactNode;
  onSubmit: (title: string) => void | Promise<void>;
};

function DialogUpdateTask({ trigger, onSubmit }: DialogUpdateTaskProps) {
  const user = useAuthStore((state) => state.user);
  const label = getUserLabel(user);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    if (isSubmitting) return;
    setOpen(nextOpen);
    if (!nextOpen) setTitle("");
  }

  async function handleSubmit() {
    const text = title.trim();
    if (!text || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(text);
      setTitle("");
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-medium">Новая подзадача</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Avatar className="size-[18px]">
              <AvatarFallback className={cn("text-[9px] font-semibold", avatarColorClass(label))}>
                {label.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
          <Input
            placeholder="Название..."
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleSubmit();
            }}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" size="sm" disabled={isSubmitting} onClick={() => handleOpenChange(false)}>
            Отмена
          </Button>
          <Button type="button" variant="ghost" size="sm" disabled={!title.trim() || isSubmitting} onClick={() => void handleSubmit()}>
            {isSubmitting ? "..." : "Создать"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DialogUpdateTask;
