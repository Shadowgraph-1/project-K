import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function useLegacyDocsViewRedirect(docsPath: string) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("view") !== "docs") return;
    navigate(docsPath, { replace: true });
  }, [docsPath, navigate, searchParams]);
}