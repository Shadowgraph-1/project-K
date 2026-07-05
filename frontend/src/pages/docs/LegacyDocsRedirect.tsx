import { Navigate, useLocation } from "react-router-dom";

import { LEGACY_DOCS_REDIRECTS } from "@/shared/config/docs-paths";

export function LegacyDocsRedirect() {
  const { pathname } = useLocation();
  const target = LEGACY_DOCS_REDIRECTS.find((item) => item.from === pathname);

  if (!target) {
    return <Navigate to="/" replace />;
  }

  return <Navigate to={target.to} replace />;
}