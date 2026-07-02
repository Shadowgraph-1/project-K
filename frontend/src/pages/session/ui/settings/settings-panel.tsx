import * as React from "react";
import { ChevronRight, KeyRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { SESSION_PATHS } from "@/pages/session/model/sessionPaths";
import {
  sessionRowHover,
  sessionSurface,
} from "@/pages/session/lib/session-styles";
import { cn } from "@/shared/lib/utils";

import { DeleteAccountDialog } from "./DeleteAccountDialog";
import { SettingsAccountSection } from "./SettingsAccountSection";
import { SettingsNotificationsSection } from "./SettingsNotificationsSection";
import { SettingsSecuritySection } from "./SettingsSecuritySection";
import {
  NavButton,
  settingsNav,
  type SettingsSection,
} from "./settings-panel-shared";

type SettingsPanelProps = {
  className?: string;
  showIntegrations?: boolean;
};

export function SettingsPanel({
  className,
  showIntegrations = true,
}: SettingsPanelProps) {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const [activeSection, setActiveSection] =
    React.useState<SettingsSection>("account");
  const [profileEditing, setProfileEditing] = React.useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = React.useState(false);

  function handleLogout() {
    logout();
    navigate(SESSION_PATHS.root, { replace: true });
  }

  function handleAccountDeleted() {
    logout();
    navigate("/", { replace: true });
  }

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
              <SettingsAccountSection
                profileEditing={profileEditing}
                onToggleEditing={() => setProfileEditing((v) => !v)}
              />
            ) : null}

            {activeSection === "notifications" ? (
              <SettingsNotificationsSection />
            ) : null}

            {activeSection === "security" ? (
              <SettingsSecuritySection
                onLogout={handleLogout}
                onDeleteAccount={() => setDeleteAccountOpen(true)}
              />
            ) : null}
          </div>
        </div>
      </div>

      <DeleteAccountDialog
        open={deleteAccountOpen}
        onOpenChange={setDeleteAccountOpen}
        onDeleted={handleAccountDeleted}
      />
    </>
  );
}
