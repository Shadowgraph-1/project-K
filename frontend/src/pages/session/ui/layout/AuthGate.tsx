import { Link, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

import without_login from "@/assets/wo_login.jpg";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { AUTH_PATHS, authPathWithRedirect } from "@/pages/auth/auth-paths";
import { Button } from "@/shared/ui/button";

type AuthGateProps = {
  children: ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { pathname } = useLocation();

  if (!isAuthenticated || !user) {
    return (
      <div className="session-panel-scroll flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-10">
        <div className="session-empty-state flex w-full max-w-md flex-col items-center gap-8 bg-card p-8 text-center dark:bg-transparent">
          <div className="space-y-3">
            <p className="text-[15px] font-semibold tracking-tight text-foreground">
              Войдите, чтобы продолжить
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Создайте учётную запись или войдите в существующую — так
              сохранятся проекты и задачи.
            </p>
          </div>
          <img
            src={without_login}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full max-w-[280px] rounded-2xl bg-card object-cover shadow-sm ring-1 ring-border/30 dark:bg-transparent dark:shadow-none dark:ring-0"
          />
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild className="min-w-[140px] rounded-full">
              <Link to={authPathWithRedirect(AUTH_PATHS.login, pathname)}>
                Войти
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="min-w-[140px] rounded-full"
            >
              <Link to={authPathWithRedirect(AUTH_PATHS.register, pathname)}>
                Регистрация
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
