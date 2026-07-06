import { Link } from "react-router-dom";

import { SESSION_PATHS } from "@/pages/session/model/sessionPaths";

import notFoundImage from "@/assets/404page/404.jpg";
import "./not-found.css";

function NotFoundPage() {
  return (
    <main className="nf-page" aria-labelledby="not-found-title">


      <div className="nf-layout">
        <figure className="nf-figure">
          <img
            src={notFoundImage}
            alt="Девочки ищут страницу с лупами в цветущем поле"
            className="nf-image"
            width={960}
            height={640}
            loading="eager"
            decoding="async"
          />
        </figure>

        <div className="nf-content">
          <p className="nf-code" aria-hidden>
            404
          </p>

          <h1 id="not-found-title" className="nf-title">
            Страница ушла в путешествие
          </h1>

          <p className="nf-text">
            Кагуя и Лилли уже на её следе — пока нашли только луга и цветы.
            Может, она спряталась в другом проекте?
          </p>

          <div className="nf-actions">
            <Link to={SESSION_PATHS.root} className="nf-btn nf-btn--primary">
              Вернуться домой
            </Link>
            <Link to={SESSION_PATHS.sessionRoot} className="nf-btn nf-btn--ghost">
              К проектам
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default NotFoundPage;
