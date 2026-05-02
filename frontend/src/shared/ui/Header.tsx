import { useModalStore } from "@/shared/stores/useModalStore";
import { useAuthStore } from "@/features/auth/model/useAuthStore";
import { Link } from "react-router-dom";

export function Header() {
  const openRegister = useModalStore((state) => state.openRegister);
  const openLogin = useModalStore((state) => state.openLogin);

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 flex shrink-0 items-center justify-between bg-white px-5 py-3.5 text-neutral-900">
      <Link
        to="/"
        className="rounded-lg border border-neutral-200 px-2 font-semibold text-neutral-900 transition hover:bg-neutral-50"
      >
        {/* <img src={focus} alt="focus-with-me" className="w-6 h-6" /> */}
        Focus With Me
      </Link>

      <nav className="flex items-center gap-1 rounded-lg border border-neutral-200">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium text-neutral-800 hover:bg-neutral-100"
        >
          Главная
        </Link>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium text-neutral-800 hover:bg-neutral-100"
        >
          Чат
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium text-neutral-800 hover:bg-neutral-100"
        >
          О проекте
        </button>
      </nav>

      <div className="flex items-center gap-1">
        {isAuthenticated && user ? (
          <>
            <span className="rounded-lg border border-neutral-200 px-3 py-1 text-sm font-medium text-neutral-800 hover:bg-neutral-100">
              <Link to="/profile">
              {user.name}
              </Link>
            </span>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1 text-sm font-medium text-neutral-800 hover:bg-neutral-100"
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={openRegister}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1 text-sm font-medium text-neutral-800 hover:bg-neutral-100"
            >
              Регистрация
            </button>
            <button
              type="button"
              onClick={openLogin}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1 text-sm font-medium text-neutral-800 hover:bg-neutral-100"
            >
              Войти
            </button>
          </>
        )}
      </div>
    </header>
  );
}
