import { useAuthStore } from "@/features/auth/model/useAuthStore";
import { useModalStore } from "@/shared/stores/useModalStore";
import { MENU_TOOLS } from "@/const/menuSections";
import { useRef, useState } from "react";
import ProfileSummarySection from "./sections/ProfileSummarySection";
import ProfileCompanionSection from "./sections/ProfileCompanionSection";
import ProfileHistorySection from "./sections/ProfileHistorySection";
import ProfileStatsSection from "./sections/ProfileStatsSection";
import { Header } from "@/shared/ui/Header";
import Footer from "@/shared/ui/Footer";
import Assistant from "@/shared/ui/Assistant";

function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const openLogin = useModalStore((state) => state.openLogin);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [currentMenu, setCurrentMenu] = useState("user");

  const openMenu = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    setIsMenuOpen(true);
  };

  const closeMenuLater = () => {
    closeTimerRef.current = setTimeout(() => {
      setIsMenuOpen(false);
    }, 1000);
  };

  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-0 flex flex-1 flex-col bg-white">
        <Header />
        <div className="flex flex-1 flex-col px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-3xl font-bold">Вы не авторизованы</h1>
            <p className="mt-2 text-lg text-neutral-600">
              Для доступа к профилю необходимо авторизоваться.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={openLogin}
                className="rounded-xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800"
              >
                Войти
              </button>
            </div>
          </div>
        </div>
        <Assistant />
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-0 flex flex-1 flex-col bg-white">
      <Header />
      <div className="flex flex-1 flex-col px-4 py-12 sm:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="text-4xl font-bold">Личный кабинет</h1>

          <div className="mt-8 flex gap-6">
            <aside
              onMouseEnter={openMenu}
              onMouseLeave={closeMenuLater}
              className={`min-h-[420px] self-stretch overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 ${
                isMenuOpen ? "w-56" : "w-16"
              }`}
            >
              <nav className="flex flex-col p-2">
                {MENU_TOOLS.map((tool) => {
                  const Icon = tool.lucide;

                  return (
                    <button
                      onClick={() => setCurrentMenu(tool.key)}
                      key={tool.key}
                      type="button"
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                        currentMenu === tool.key
                          ? "bg-neutral-950 text-white"
                          : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />

                      <span
                        className={`whitespace-nowrap transition-opacity duration-200 ${
                          isMenuOpen ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {tool.section}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            <section className="min-h-[420px] flex-1 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              {currentMenu === "user" && <ProfileSummarySection />}
              {currentMenu === "companions" && <ProfileCompanionSection />}
              {currentMenu === "history" && <ProfileHistorySection />}
              {currentMenu === "stats" && <ProfileStatsSection />}
            </section>
          </div>
        </div>
      </div>
      <Assistant />
      <Footer />
    </main>
  );
}

export default ProfilePage;
