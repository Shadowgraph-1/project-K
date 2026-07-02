import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { AUTH_PATHS } from "@/pages/auth/auth-paths";
import { SESSION_PATHS } from "@/pages/session/model/sessionPaths";
import { SECTION_ID } from "@/shared/config/sectionIds";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { KonoLogo } from "@/shared/ui/kono-logo";

const NAV_ITEMS = [
  { label: "О Kono", hash: SECTION_ID.ABOUT },
  { label: "Возможности", hash: SECTION_ID.FEATURES },
  { label: "Начать", hash: SECTION_ID.START },
] as const;

export function Header() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const location = useLocation();

  const [elevated, setElevated] = useState(
    () => typeof window !== "undefined" && window.scrollY > 12,
  );
  const activeHash = location.hash.replace("#", "");

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 12);

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="group fixed inset-x-0 top-0 z-50 text-white duration-200">
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 bg-black/85 backdrop-blur-xl transition-opacity duration-300",
          elevated ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent transition-opacity duration-300",
          elevated ? "opacity-100" : "opacity-0",
        )}
      />
      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:h-16 lg:px-6">
        <KonoLogo
          as="link"
          to="/"
          size="sm"
          inverted
          wordmarkClassName="text-white"
          className="shrink-0"
        />

        <nav
          aria-label="Разделы главной страницы"
          className="ml-4 hidden grow items-center gap-1 lg:flex"
        >
          {NAV_ITEMS.map(({ label, hash }) => {
            const isActive = activeHash === hash;
            return (
              <Link
                key={hash}
                to={`/#${hash}`}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive ? "text-white" : "text-white/50 hover:text-white",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {isAuthenticated && user ? (
            <>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hidden max-w-36 rounded-full border-white/15 bg-transparent text-white/80 hover:bg-white/5 hover:text-white sm:inline-flex"
              >
                <Link to={SESSION_PATHS.sessionRoot} className="truncate">
                  {user.name}
                </Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={logout}
                className="rounded-full border-white/15 bg-transparent text-white/80 hover:bg-white/5 hover:text-white"
              >
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="rounded-full text-white/50 hover:bg-white/8 hover:text-white"
              >
                <Link to={AUTH_PATHS.register}>Регистрация</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="rounded-full bg-white text-neutral-950 hover:bg-neutral-200"
              >
                <Link to={AUTH_PATHS.login}>Войти</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}