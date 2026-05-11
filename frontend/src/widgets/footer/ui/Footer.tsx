import { Link } from "react-router-dom";
import { SECTION_ID } from "@/shared/config/sectionIds";

function Footer() {
  return (
    <footer className="border-t border-neutral-100 bg-white px-4 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold tracking-tight text-neutral-950">
            Kono
          </span>
          <span className="text-xs text-neutral-400">© 2026</span>
        </div>

        <div className="flex items-center gap-5">
          <Link
            to={`/#${SECTION_ID.FEATURES}`}
            className="text-xs text-neutral-400 transition hover:text-neutral-950"
          >
            Возможности
          </Link>
          <Link
            to={`/#${SECTION_ID.LINES}`}
            className="text-xs text-neutral-400 transition hover:text-neutral-950"
          >
            Войти
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;