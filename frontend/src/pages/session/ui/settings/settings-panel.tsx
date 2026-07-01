import * as React from "react";
import {
  BellIcon,
  ChevronRight,
  KeyRound,
  LockIcon,
  TriangleAlert,
  UserRoundIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { deleteAccountOnApi } from "@/api/auth";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { UserAvatar } from "@/entities/user/ui/UserAvatar";
import { SESSION_PATHS } from "@/pages/session/model/sessionPaths";
import {
  sessionRowHover,
  sessionSurface,
} from "@/pages/session/lib/session-styles";
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
import { cn } from "@/shared/lib/utils";
import { FIELD_LIMITS } from "@/shared/constants/field-limits";
import { getApiErrorMessage } from "@/shared/lib/api-error-message";
import { toast } from "sonner";

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
  return <div className="mx-3 h-px bg-border/60" />;
}

function SettingsRow({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-row items-center justify-between gap-4 px-3 py-1.5">
      <div className="min-w-0 max-w-sm flex-1">{children}</div>
      {action ? (
        <div className="flex min-w-24 shrink-0 items-center justify-end">
          {action}
        </div>
      ) : null}
    </div>
  );
}

function ComingSoonBadge() {
  return (
    <span className="inline-flex h-6 items-center rounded-full bg-muted px-2.5 text-[11px] font-medium text-muted-foreground">
      Скоро
    </span>
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
        "inline-flex h-9 w-full items-center justify-start gap-2.5 rounded-[10px] px-2.5 text-[13px] font-medium sm:min-w-40",
        active
          ? "bg-primary/10 text-foreground ring-1 ring-primary/25 [&_svg]:text-primary"
          : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground [&_svg]:text-muted-foreground hover:[&_svg]:text-foreground",
      )}
    >
      <Icon className="size-4 shrink-0" />
      {label}
    </Button>
  );
}

type SettingsPanelProps = {
  className?: string;
  showIntegrations?: boolean;
};

export function SettingsPanel({
  className,
  showIntegrations = true,
}: SettingsPanelProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const [activeSection, setActiveSection] =
    React.useState<SettingsSection>("account");
  const [profileEditing, setProfileEditing] = React.useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = React.useState(false);
  const [deletePassword, setDeletePassword] = React.useState("");
  const [deletingAccount, setDeletingAccount] = React.useState(false);

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
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, "Не удалось удалить аккаунт. Проверьте пароль."),
      );
    } finally {
      setDeletingAccount(false);
    }
  }

  function handleLogout() {
    logout();
    navigate(SESSION_PATHS.root, { replace: true });
  }

  const userName = user?.name ?? "Гость";
  const userEmail = user?.email ?? "";

  return (
    <>
      <div className={cn("flex flex-col gap-6", className)}>
        {showIntegrations ? (
          <section className={cn(sessionSurface, "overflow-hidden p-1")}>
            <Link
              to={SESSION_PATHS.llmKeys}
              className={cn(
                sessionRowHover,
                "group flex h-14 items-center gap-3 rounded-xl px-3 text-foreground",
              )}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                <KeyRound className="size-4 text-muted-foreground" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-medium">API ключи</span>
                <span className="block text-xs text-muted-foreground">
                  Подключите свой LLM-провайдер
                </span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          </section>
        ) : null}

        <div className={cn(sessionSurface, "flex flex-col gap-4 p-4 sm:flex-row sm:p-5")}>
          <nav className="flex shrink-0 flex-col gap-0.5 sm:w-44">
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

          <div className="min-h-0 flex-1 sm:border-l sm:border-border/40 sm:pl-5">
            {activeSection === "account" ? (
              <div className="flex w-full flex-col gap-4">
                <SettingsRow
                  action={
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 rounded-[10px] text-xs"
                      onClick={() => setProfileEditing((v) => !v)}
                    >
                      {profileEditing ? "Готово" : "Изменить"}
                    </Button>
                  }
                >
                  <div className="flex flex-row items-center gap-3">
                    <UserAvatar
                      name={user?.name}
                      email={user?.email}
                      className="size-11"
                      fallbackClassName="text-sm"
                    />
                    <div className="min-w-0 text-sm">
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
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="grid gap-1.5">
                          <Label htmlFor="settings-name">Имя</Label>
                          <Input
                            id="settings-name"
                            defaultValue={userName}
                            placeholder="Ваше имя"
                            maxLength={FIELD_LIMITS.userName}
                            className="h-9 rounded-xl"
                          />
                        </div>
                        <div className="grid gap-1.5">
                          <Label htmlFor="settings-email">Почта</Label>
                          <Input
                            id="settings-email"
                            defaultValue={userEmail}
                            placeholder="email@example.com"
                            type="email"
                            className="h-9 rounded-xl"
                          />
                        </div>
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
              <div className="flex w-full flex-col gap-4">
                <SettingsRow action={<ComingSoonBadge />}>
                  <div className="text-sm font-medium">Задачи и дедлайны</div>
                </SettingsRow>
                <SettingsDivider />
                <SettingsRow action={<ComingSoonBadge />}>
                  <div className="text-sm font-medium">Команда и приглашения</div>
                </SettingsRow>
                <p className="px-3 text-xs text-muted-foreground">
                  Уведомления появятся в следующих версиях.
                </p>
              </div>
            ) : null}

            {activeSection === "security" ? (
              <div className="flex w-full flex-col gap-4">
                <SettingsRow action={<ComingSoonBadge />}>
                  <div className="text-sm font-medium">Пароль</div>
                </SettingsRow>
                <SettingsDivider />
                <SettingsRow
                  action={
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 rounded-[10px] text-xs"
                      onClick={handleLogout}
                    >
                      Выйти
                    </Button>
                  }
                >
                  <div className="text-sm font-medium">Сессия</div>
                </SettingsRow>

                <div className="mt-1 rounded-xl border border-destructive/20 bg-destructive/5 p-1">
                  <SettingsRow
                    action={
                      <Button
                        type="button"
                        variant="outline"
                        className="h-8 rounded-[10px] border-destructive/30 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setDeleteAccountOpen(true)}
                      >
                        Удалить
                      </Button>
                    }
                  >
                    <div className="text-sm font-medium text-destructive">
                      Удалить аккаунт
                    </div>
                  </SettingsRow>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <Dialog
        open={deleteAccountOpen}
        onOpenChange={(next) => {
          if (!next) closeDeleteAccountModal();
          else setDeleteAccountOpen(true);
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