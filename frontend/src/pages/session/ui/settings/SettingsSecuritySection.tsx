import { Button } from "@/shared/ui/button";

import { SettingsDivider, SettingsRow } from "./settings-panel-shared";

type SettingsSecuritySectionProps = {
  onChangePassword: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
};

export function SettingsSecuritySection({
  onChangePassword,
  onLogout,
  onDeleteAccount,
}: SettingsSecuritySectionProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      <SettingsRow
        action={
          <Button
            type="button"
            variant="outline"
            className="h-8 rounded-[10px] text-xs"
            onClick={onChangePassword}
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
            className="h-8 rounded-[10px] text-xs"
            onClick={onLogout}
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
              onClick={onDeleteAccount}
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
  );
}