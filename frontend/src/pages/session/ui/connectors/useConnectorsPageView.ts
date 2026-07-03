import { useCallback, useEffect, useState } from "react";

export type ConnectorsPageView = "catalog" | "docs";

const STORAGE_KEY = "kono-connectors-page-view";

function readDocsViewFromUrl(): ConnectorsPageView | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  if (params.get("view") !== "docs") return null;
  return "docs";
}

function readStoredView(): ConnectorsPageView {
  if (typeof window === "undefined") return "catalog";
  const fromUrl = readDocsViewFromUrl();
  if (fromUrl) return fromUrl;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "docs" ? "docs" : "catalog";
}

export function useConnectorsPageView() {
  const [view, setViewState] = useState<ConnectorsPageView>(readStoredView);

  useEffect(() => {
    const fromUrl = readDocsViewFromUrl();
    if (!fromUrl) return;

    setViewState(fromUrl);
    window.localStorage.setItem(STORAGE_KEY, fromUrl);

    const url = new URL(window.location.href);
    url.searchParams.delete("view");
    window.history.replaceState(
      {},
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }, []);

  const setView = useCallback((next: ConnectorsPageView) => {
    setViewState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return [view, setView] as const;
}
