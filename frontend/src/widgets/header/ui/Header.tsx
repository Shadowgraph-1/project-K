import { useModalStore } from "@/shared/model/useModalStore";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/shared/lib/utils";

export function Header() {
  const location = useLocation();
  const isSession = location.pathname.startsWith("/session");
  const openRegister = useModalStore((state) => state.openRegister);
  const openLogin = useModalStore((state) => state.openLogin);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-3 border-b border-neutral-100 bg-white/90 px-4 py-2.5 backdrop-blur-md sm:px-6 sm:py-3">
      <Link
        to="/"
        className="text-[15px] font-semibold tracking-tight text-neutral-950 transition hover:text-neutral-600"
      >
        Kono
      </Link>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          to="/session"
          className={cn(
            "rounded-full border border-neutral-200 bg-neutral-50 px-4 py-1.5 text-xs font-medium text-neutral-900 transition hover:bg-white",
            isSession && "border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800",
          )}
        >
          Сессия
        </Link>

        {isAuthenticated && user ? (
          <>
            <Link
              to="/profile"
              className="hidden max-w-40 truncate rounded-full border border-neutral-100 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-white sm:inline-block"
            >
              {user.name}
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-neutral-100 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-white"
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={openRegister}
              className="rounded-full px-3 py-1.5 text-[11px] font-medium text-neutral-500 transition hover:text-neutral-950 sm:text-xs"
            >
              Регистрация
            </button>
            <button
              type="button"
              onClick={openLogin}
              className="rounded-full bg-neutral-950 px-3 py-1.5 text-[11px] font-medium text-white transition hover:bg-neutral-800 sm:text-xs"
            >
              Войти
            </button>
          </>
        )}
      </div>
    </header>
  );
}
