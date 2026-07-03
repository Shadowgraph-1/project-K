import { useCallback, useEffect, useState } from "react";

export type LlmKeysPageView = "keys" | "docs";

const STORAGE_KEY = "kono-llm-keys-page-view";

function readDocsViewFromUrl(): LlmKeysPageView | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  if (params.get("view") !== "docs") return null;
  return "docs";
}

function readStoredView(): LlmKeysPageView | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "keys" || stored === "docs") return stored;
  return null;
}

export function useLlmKeysPageView(hasKeys: boolean) {
  const defaultView: LlmKeysPageView = hasKeys ? "keys" : "docs";

  const [view, setViewState] = useState<LlmKeysPageView>(() => {
    return readDocsViewFromUrl() ?? readStoredView() ?? defaultView;
  });

  useEffect(() => {
    const fromUrl = readDocsViewFromUrl();
    if (fromUrl) {
      setViewState(fromUrl);
      window.localStorage.setItem(STORAGE_KEY, fromUrl);

      const url = new URL(window.location.href);
      url.searchParams.delete("view");
      window.history.replaceState(
        {},
        "",
        `${url.pathname}${url.search}${url.hash}`,
      );
      return;
    }

    if (readStoredView() !== null) return;
    setViewState(defaultView);
  }, [defaultView]);

  const setView = useCallback((next: LlmKeysPageView) => {
    setViewState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return [view, setView] as const;
}