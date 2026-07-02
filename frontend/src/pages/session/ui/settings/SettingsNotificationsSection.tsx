import { useNotifys } from "@/entities/notification/model/useNotifys";
import { useNotificationPrefsStore } from "@/shared/model/useNotificationPrefsStore";
import { Switch } from "@/shared/ui/switch";

import { SettingsDivider, SettingsRow } from "./settings-panel-shared";

export function SettingsNotificationsSection() {
  const taskHistoryEnabled = useNotificationPrefsStore(
    (s) => s.taskHistoryEnabled,
  );
  const teamInvitesEnabled = useNotificationPrefsStore(
    (s) => s.teamInvitesEnabled,
  );
  const setTaskHistoryEnabled = useNotificationPrefsStore(
    (s) => s.setTaskHistoryEnabled,
  );
  const setTeamInvitesEnabled = useNotificationPrefsStore(
    (s) => s.setTeamInvitesEnabled,
  );
  const clearNotifys = useNotifys((s) => s.clearNotifys);

  return (
    <div className="flex w-full flex-col gap-4">
      <SettingsRow
        action={
          <Switch
            checked={taskHistoryEnabled}
            onCheckedChange={(checked) => {
              setTaskHistoryEnabled(checked);
              if (!checked) clearNotifys();
            }}
            aria-label="Сохранять уведомления о задачах в колокольчике"
          />
        }
      >
        <div>
          <div className="text-sm font-medium">Задачи и дедлайны</div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Сохранять историю в колокольчике. Toast остаются.
          </p>
        </div>
      </SettingsRow>
      <SettingsDivider />
      <SettingsRow
        action={
          <Switch
            checked={teamInvitesEnabled}
            onCheckedChange={setTeamInvitesEnabled}
            aria-label="Показывать приглашения в колокольчике"
          />
        }
      >
        <div>
          <div className="text-sm font-medium">Команда и приглашения</div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Показывать входящие приглашения в проект.
          </p>
        </div>
      </SettingsRow>
    </div>
  );
}
