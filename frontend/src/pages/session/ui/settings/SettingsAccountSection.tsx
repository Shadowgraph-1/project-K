import * as React from "react";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { UserAvatar } from "@/entities/user/ui/UserAvatar";
import { updateProfileOnApi } from "@/api/auth";
import { setAuthToken } from "@/shared/lib/auth-token";
import { getApiErrorMessage } from "@/shared/lib/api-error-message";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { FIELD_LIMITS } from "@/shared/constants/field-limits";
import { toast } from "sonner";

import { SettingsDivider, SettingsRow } from "./settings-panel-shared";

type SettingsAccountSectionProps = {
  profileEditing: boolean;
  onToggleEditing: () => void;
};

export function SettingsAccountSection({
  profileEditing,
  onToggleEditing,
}: SettingsAccountSectionProps) {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const userName = user?.name ?? "Гость";
  const userEmail = user?.email ?? "";

  const [draftName, setDraftName] = React.useState(userName);
  const [draftEmail, setDraftEmail] = React.useState(userEmail);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!profileEditing) {
      setDraftName(userName);
      setDraftEmail(userEmail);
    }
  }, [profileEditing, userName, userEmail]);

  async function handleSave() {
    const name = draftName.trim();
    const email = draftEmail.trim();

    if (!name || !email || saving) return;

    if (name === userName && email === userEmail) {
      onToggleEditing();
      return;
    }

    setSaving(true);
    try {
      const result = await updateProfileOnApi({ name, email });
      updateUser(result.user);
      if (result.token) setAuthToken(result.token);
      toast.success("Профиль обновлён");
      onToggleEditing();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Не удалось сохранить профиль"));
    } finally {
      setSaving(false);
    }
  }

  function handleToggle() {
    if (profileEditing) {
      void handleSave();
      return;
    }
    setDraftName(userName);
    setDraftEmail(userEmail);
    onToggleEditing();
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <SettingsRow
        action={
          <Button
            type="button"
            variant="outline"
            className="h-8 rounded-[10px] text-xs"
            onClick={() => void handleToggle()}
            disabled={saving}
          >
            {saving ? "Сохранение…" : profileEditing ? "Готово" : "Изменить"}
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
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="Ваше имя"
                  maxLength={FIELD_LIMITS.userName}
                  disabled={saving}
                  className="h-9 rounded-xl"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="settings-email">Почта</Label>
                <Input
                  id="settings-email"
                  value={draftEmail}
                  onChange={(e) => setDraftEmail(e.target.value)}
                  placeholder="email@example.com"
                  type="email"
                  disabled={saving}
                  className="h-9 rounded-xl"
                />
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}