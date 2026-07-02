import * as React from "react";
import { TriangleAlert } from "lucide-react";

import { deleteAccountOnApi } from "@/api/auth";
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

type DeleteAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
};

export function DeleteAccountDialog({
  open,
  onOpenChange,
  onDeleted,
}: DeleteAccountDialogProps) {
  const [deletePassword, setDeletePassword] = React.useState("");
  const [deletingAccount, setDeletingAccount] = React.useState(false);

  function closeModal() {
    onOpenChange(false);
    setDeletePassword("");
    setDeletingAccount(false);
  }

  async function handleDeleteAccount() {
    const password = deletePassword.trim();
    if (!password || deletingAccount) return;

    setDeletingAccount(true);
    try {
      await deleteAccountOnApi(password);
      closeModal();
      onDeleted();
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, "Не удалось удалить аккаунт. Проверьте пароль."),
      );
    } finally {
      setDeletingAccount(false);
    }
  }

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
          <div className="mb-1 flex size-9 items-center justify-center rounded-full bg-destructive/10">
            <TriangleAlert className="size-4.5 text-destructive" />
          </div>
          <DialogTitle>Удалить аккаунт?</DialogTitle>
          <DialogDescription>
            Безвозвратно удалятся ваши проекты, задачи и доступы. Введите пароль,
            чтобы подтвердить.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-1">
          <Label htmlFor="delete-account-password">Пароль</Label>
          <Input
            id="delete-account-password"
            type="password"
            autoComplete="current-password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            placeholder="Введите пароль"
            disabled={deletingAccount}
            className="rounded-xl"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void handleDeleteAccount();
              }
            }}
          />
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            disabled={deletingAccount}
            onClick={closeModal}
          >
            Отмена
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="rounded-xl"
            disabled={!deletePassword.trim() || deletingAccount}
            onClick={() => void handleDeleteAccount()}
          >
            {deletingAccount ? "Удаление…" : "Удалить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
