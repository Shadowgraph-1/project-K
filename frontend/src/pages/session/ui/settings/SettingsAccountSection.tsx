import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { UserAvatar } from "@/entities/user/ui/UserAvatar";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { FIELD_LIMITS } from "@/shared/constants/field-limits";

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
  const userName = user?.name ?? "Гость";
  const userEmail = user?.email ?? "";

  return (
    <div className="flex w-full flex-col gap-4">
      <SettingsRow
        action={
          <Button
            type="button"
            variant="outline"
            className="h-8 rounded-[10px] text-xs"
            onClick={onToggleEditing}
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
  );
}
