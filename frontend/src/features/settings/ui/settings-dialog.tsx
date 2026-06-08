"use client";

import * as React from "react";
import { BellIcon, LockIcon, UserRoundIcon } from "lucide-react";

import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { UserAvatar } from "@/entities/user/ui/UserAvatar";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { cn } from "@/shared/lib/utils";
import { deleteAccountOnApi } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/shared/lib/api-error-message";

type SettingsDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
};

type SettingsSection = "account" | "notifications" | "security";

const settingsNav: {
  id: SettingsSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "account", label: "Аккаунт", icon: UserRoundIcon },
  { id: "notifications", label: "Уведомления", icon: BellIcon },
  { id: "security", label: "Безопасность", icon: LockIcon },
];

function SettingsDivider() {
  return <div className="mx-3 h-px bg-border" />;
}

function SettingsRow({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-row items-center justify-between gap-4 px-3">
      <div className="min-w-0 max-w-sm flex-1">{children}</div>
      {action ? (
        <div className="flex min-w-24 shrink-0 items-center justify-end">
          {action}
        </div>
      ) : null}
    </div>
  );
}

function NavButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className={cn(
        "inline-flex h-10 min-w-40 items-center justify-start gap-3 rounded-xl px-4 py-2 text-sm font-medium",
        active
          ? "bg-muted text-foreground [&_svg]:text-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground [&_svg]:text-muted-foreground hover:[&_svg]:text-foreground",
      )}
    >
      <Icon className="size-[18px] shrink-0" />
      {label}
    </Button>
  );
}

export function SettingsDialog({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
}: SettingsDialogProps = {}) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [activeSection, setActiveSection] =
    React.useState<SettingsSection>("account");
  const [profileEditing, setProfileEditing] = React.useState(false);
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const [deleteAccountOpen, setDeleteAccountOpen] = React.useState(false);
  const [deletePassword, setDeletePassword] = React.useState("");
  const [deletingAccount, setDeletingAccount] = React.useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const navigate = useNavigate();

  function handleOpenChange(next: boolean) {
    if (!isControlled) setUncontrolledOpen(next);
    if (!next) setProfileEditing(false);
    onOpenChange?.(next);
  }

  function closeDeleteAccountModal() {
    setDeleteAccountOpen(false);
    setDeletePassword("");
    setDeletingAccount(false);
  }

  async function handleDeleteAccount() {
    const password = deletePassword.trim();
    if (!password || deletingAccount) return;

    setDeletingAccount(true);
    try {
      await deleteAccountOnApi(password);
      closeDeleteAccountModal();
      logout();
      handleOpenChange(false);
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, "Не удалось удалить аккаунт. Проверьте пароль."),
      );
    } finally {
      setDeletingAccount(false);
    }
  }

  const showDefaultTrigger = !isControlled && !defaultOpen;
  const userName = user?.name ?? "Гость";
  const userEmail = user?.email ?? "";
  return (
    <>
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {showDefaultTrigger ? (
        <DialogTrigger asChild>
          <Button size="sm">Настройки</Button>
        </DialogTrigger>
      ) : null}

      <DialogContent
        showCloseButton
        className={cn(
          "flex max-h-[calc(100dvh-4rem)] flex-col gap-0 overflow-hidden rounded-3xl p-0",
          "md:h-[min(560px,70vh)] md:max-h-[560px] md:min-h-[420px] md:w-[min(768px,calc(100%-2rem))] md:max-w-3xl",
        )}
      >
        <DialogTitle className="sr-only">Настройки</DialogTitle>
        <DialogDescription className="sr-only">
          Личный кабинет и настройки аккаунта Kono.
        </DialogDescription>

        <div className="relative z-5 flex shrink-0 flex-row items-center gap-2 px-6 pb-2 pt-5">
          <h2 className="text-left text-xl font-semibold tracking-tight">
            Настройки
          </h2>
        </div>

        <div className="flex h-0 min-h-0 grow flex-col sm:flex-row">
          <nav className="flex shrink-0 flex-col gap-1.5 pb-3 pl-3 pr-2 sm:pr-0">
            {settingsNav.map((item) => (
              <NavButton
                key={item.id}
                active={activeSection === item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setProfileEditing(false);
                }}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </nav>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 focus:outline-none sm:pl-2">
            {activeSection === "account" ? (
              <div className="flex h-full w-full flex-col gap-4">
                <SettingsRow
                  action={
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => setProfileEditing((v) => !v)}
                    >
                      {profileEditing ? "Готово" : "Настроить"}
                    </Button>
                  }
                >
                  <div className="flex flex-row items-center gap-2">
                    <UserAvatar
                      name={user?.name}
                      email={user?.email}
                      className="size-12 border border-border"
                      fallbackClassName="text-sm"
                    />
                    <div className="min-w-0 p-1 text-sm">
                      <div className="truncate font-medium">{userName}</div>
                      <div className="truncate text-muted-foreground">
                        {userEmail || "Почта не указана"}
                      </div>
                    </div>
                  </div>
                </SettingsRow>

                {profileEditing ? (
                  <>
                    <SettingsDivider />
                    <div className="flex flex-col gap-3 px-3">
                      <div className="grid gap-1.5">
                        <Label htmlFor="settings-name">Имя</Label>
                        <Input
                          id="settings-name"
                          defaultValue={userName}
                          placeholder="Ваше имя"
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="settings-email">Почта</Label>
                        <Input
                          id="settings-email"
                          defaultValue={userEmail}
                          placeholder="email@example.com"
                          type="email"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Сохранение профиля на сервере будет добавлено позже.
                      </p>
                    </div>
                  </>
                ) : null}
              </div>
            ) : null}

            {activeSection === "notifications" ? (
              <div className="flex h-full w-full flex-col gap-4">
                <SettingsRow
                  action={
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl"
                      disabled
                    >
                      Настроить
                    </Button>
                  }
                >
                  <div className="text-sm font-medium">Задачи и дедлайны</div>
                </SettingsRow>
                <SettingsDivider />
                <SettingsRow
                  action={
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl"
                      disabled
                    >
                      Настроить
                    </Button>
                  }
                >
                  <div className="text-sm font-medium">Команда</div>
                </SettingsRow>
                <p className="px-3 text-xs text-muted-foreground">
                  Уведомления появятся в следующих версиях.
                </p>
              </div>
            ) : null}

            {activeSection === "security" ? (
              <div className="flex h-full w-full flex-col gap-4">
                <SettingsRow
                  action={
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl"
                      disabled
                    >
                      Изменить
                    </Button>
                  }
                >
                  <div className="text-sm font-medium">Пароль</div>
                </SettingsRow>
                <SettingsDivider />
                <SettingsRow
                  action={
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl text-destructive hover:text-destructive"
                      onClick={() => {
                        logout();
                        handleOpenChange(false);
                      }}
                    >
                      Выйти
                    </Button>
                  }
                >
                  <div className="text-sm font-medium">Сессия</div>
                </SettingsRow>
                <SettingsDivider />
                <SettingsRow
                  action={
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl text-destructive hover:text-destructive"
                      onClick={() => setDeleteAccountOpen(true)}
                    >
                      Удалить
                    </Button>
                  }
                >
                  <div className="text-sm font-medium">Удалить аккаунт</div>
                </SettingsRow>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <Dialog
      open={deleteAccountOpen}
      onOpenChange={(next) => {
        if (!next) closeDeleteAccountModal();
        else setDeleteAccountOpen(true);
      }}
    >
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
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
            onClick={closeDeleteAccountModal}
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
    </>
  );
}
