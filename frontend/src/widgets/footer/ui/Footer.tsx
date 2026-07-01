import { KonoLogo } from "@/shared/ui/kono-logo";

function Footer() {
  return (
    <footer className="home-footer">
      <div className="home-footer__line" aria-hidden />

      <div className="home-footer__inner">
        <div className="home-footer__brand">
          <KonoLogo
            as="link"
            to="/"
            size="sm"
            inverted
            wordmarkClassName="text-white"
            className="w-fit gap-2.5"
          />
          <p className="home-footer__tagline">
            Задачи и AI. В одном месте.
          </p>
        </div>

        <div className="home-footer__meta">
          <span className="home-footer__copy">© 2026 Kono</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;