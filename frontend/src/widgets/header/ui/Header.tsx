import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useModalStore } from "@/shared/model/useModalStore";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { SESSION_PATHS } from "@/pages/session/model/sessionPaths";
import { SECTION_ID } from "@/shared/config/sectionIds";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

type HeaderTheme = "dark" | "light";
type ActiveSection = "hero" | "about" | "features" | "lines" | "footer";

const NAV_ITEMS = [
  { id: "about" as const, label: "О Kono", hash: SECTION_ID.ABOUT },
  { id: "features" as const, label: "Возможности", hash: SECTION_ID.FEATURES },
  { id: "lines" as const, label: "Как работает", hash: SECTION_ID.LINES },
] as const;

function resolveHeaderState(scrollY: number): {
  theme: HeaderTheme;
  active: ActiveSection;
  elevated: boolean;
} {
  const offset = scrollY + 88;
  const about = document.getElementById(SECTION_ID.ABOUT);
  const features = document.getElementById(SECTION_ID.FEATURES);
  const lines = document.getElementById(SECTION_ID.LINES);
  const footer = document.querySelector("footer");

  const aboutTop = about?.offsetTop ?? Number.POSITIVE_INFINITY;
  const featuresTop = features?.offsetTop ?? Number.POSITIVE_INFINITY;
  const linesTop = lines?.offsetTop ?? Number.POSITIVE_INFINITY;
  const footerTop = footer?.offsetTop ?? Number.POSITIVE_INFINITY;

  let active: ActiveSection = "hero";
  let theme: HeaderTheme = "dark";

  if (offset >= footerTop) {
    active = "footer";
    theme = "dark";
  } else if (offset >= linesTop) {
    active = "lines";
    theme = "light";
  } else if (offset >= featuresTop) {
    active = "features";
    theme = "dark";
  } else if (offset >= aboutTop) {
    active = "about";
    theme = "light";
  }

  return { theme, active, elevated: scrollY > 12 };
}

export function Header() {
  const openRegister = useModalStore((state) => state.openRegister);
  const openLogin = useModalStore((state) => state.openLogin);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  const [theme, setTheme] = useState<HeaderTheme>("dark");
  const [activeSection, setActiveSection] = useState<ActiveSection>("hero");
  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    const update = () => {
      const next = resolveHeaderState(window.scrollY);
      setTheme(next.theme);
      setActiveSection(next.active);
      setElevated(next.elevated);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 sm:px-6">
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between gap-3 border px-3 py-2 transition-[background-color,border-color,box-shadow,color] duration-300 sm:gap-4 sm:px-4 sm:py-2.5",
          elevated && "shadow-[0_12px_40px_-20px_rgba(0,0,0,0.45)]",
          isDark
            ? "border-white/10 bg-neutral-950/85 text-white backdrop-blur-xl"
            : "border-neutral-200 bg-white/85 text-neutral-950 backdrop-blur-xl",
        )}
      >
        <Link
          to="/"
          className={cn(
            "shrink-0 text-[15px] font-semibold tracking-tight transition-opacity hover:opacity-70",
            isDark ? "text-white" : "text-neutral-950",
          )}
        >
          Kono
        </Link>

        <nav
          aria-label="Разделы главной страницы"
          className="hidden items-center gap-0.5 md:flex"
        >
          {NAV_ITEMS.map(({ id, label, hash }) => {
            const isActive = activeSection === id;

            return (
              <Button
                key={hash}
                asChild
                variant="ghost"
                size="sm"
                className={cn(
                  "rounded-none px-3 font-normal",
                  isDark
                    ? cn(
                        "text-neutral-300 hover:bg-white/10 hover:text-white",
                        isActive && "bg-white/10 text-white",
                      )
                    : cn(
                        "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950",
                        isActive && "bg-neutral-100 text-neutral-950",
                      ),
                )}
              >
                <Link to={`/#${hash}`}>{label}</Link>
              </Button>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          {isAuthenticated && user ? (
            <>
              <Button
                asChild
                variant="outline"
                size="sm"
                className={cn(
                  "hidden max-w-36 rounded-none sm:inline-flex",
                  isDark
                    ? "border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
                    : "border-neutral-200 bg-transparent text-neutral-900 hover:bg-neutral-50",
                )}
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
                className={cn(
                  "rounded-none",
                  isDark
                    ? "border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
                    : "border-neutral-200 bg-transparent text-neutral-900 hover:bg-neutral-50",
                )}
              >
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={openRegister}
                className={cn(
                  "rounded-none",
                  isDark
                    ? "text-neutral-300 hover:bg-white/10 hover:text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950",
                )}
              >
                Регистрация
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={openLogin}
                className={cn(
                  "rounded-none",
                  isDark
                    ? "bg-white text-neutral-950 hover:bg-neutral-200"
                    : "bg-neutral-950 text-white hover:bg-neutral-800",
                )}
              >
                Войти
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
