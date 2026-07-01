import { sessionPageTitle } from "@/pages/session/lib/session-styles";
import { SettingsPanel } from "./settings-panel";

export function AccountSettingsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <h1 className={sessionPageTitle}>Настройки</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Аккаунт, безопасность и интеграции
        </p>
      </div>
      <SettingsPanel />
    </div>
  );
}
