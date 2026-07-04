import * as React from "react";
import { LockIcon } from "lucide-react";

import { changePasswordOnApi } from "@/api/auth";
import { getApiErrorMessage } from "@/shared/lib/api-error-message";
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
import { toast } from "sonner";

type ChangePasswordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ChangePasswordDialog({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  function closeModal() {
    onOpenChange(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSaving(false);
  }

  async function handleSubmit() {
    const current = currentPassword.trim();
    const next = newPassword.trim();
    const confirm = confirmPassword.trim();

    if (!current || !next || !confirm || saving) return;

    if (next.length < 6) {
      toast.error("Новый пароль — минимум 6 символов");
      return;
    }

    if (next !== confirm) {
      toast.error("Пароли не совпадают");
      return;
    }

    setSaving(true);
    try {
      await changePasswordOnApi({
        currentPassword: current,
        newPassword: next,
        confirmPassword: confirm,
      });
      closeModal();
      toast.success("Пароль изменён");
    } catch (err) {
      toast.error(
        getApiErrorMessage(
          err,
          "Не удалось сменить пароль. Проверьте текущий пароль.",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  const canSubmit =
    currentPassword.trim().length > 0 &&
    newPassword.trim().length >= 6 &&
    confirmPassword.trim().length > 0 &&
    !saving;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) closeModal();
        else onOpenChange(true);
      }}
    >
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <div className="mb-1 flex size-9 items-center justify-center rounded-full bg-muted">
            <LockIcon className="size-4.5 text-muted-foreground" />
          </div>
          <DialogTitle>Сменить пароль</DialogTitle>
          <DialogDescription>
            Введите текущий пароль и задайте новый.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-1">
          <div className="grid gap-2">
            <Label htmlFor="change-password-current">Текущий пароль</Label>
            <Input
              id="change-password-current"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={saving}
              className="rounded-xl"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="change-password-new">Новый пароль</Label>
            <Input
              id="change-password-new"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={saving}
              className="rounded-xl"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="change-password-confirm">Повторите пароль</Label>
            <Input
              id="change-password-confirm"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={saving}
              className="rounded-xl"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void handleSubmit();
                }
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            disabled={saving}
            onClick={closeModal}
          >
            Отмена
          </Button>
          <Button
            type="button"
            className="rounded-xl"
            disabled={!canSubmit}
            onClick={() => void handleSubmit()}
          >
            {saving ? "Сохранение…" : "Сохранить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}