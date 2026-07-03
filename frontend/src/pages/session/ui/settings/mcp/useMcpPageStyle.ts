import { useCallback, useEffect, useState } from "react";

export type McpPageStyle = "landing" | "docs";

const STORAGE_KEY = "kono-mcp-page-style";

function readDocsViewFromUrl(): McpPageStyle | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  if (params.get("view") !== "docs") return null;
  return "docs";
}

function readStoredStyle(): McpPageStyle {
  if (typeof window === "undefined") return "landing";
  const fromUrl = readDocsViewFromUrl();
  if (fromUrl) return fromUrl;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "docs" ? "docs" : "landing";
}

export function useMcpPageStyle() {
  const [style, setStyleState] = useState<McpPageStyle>(readStoredStyle);

  useEffect(() => {
    const fromUrl = readDocsViewFromUrl();
    if (!fromUrl) return;

    setStyleState(fromUrl);
    window.localStorage.setItem(STORAGE_KEY, fromUrl);

    const url = new URL(window.location.href);
    url.searchParams.delete("view");
    window.history.replaceState(
      {},
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }, []);

  const setStyle = useCallback((next: McpPageStyle) => {
    setStyleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return [style, setStyle] as const;
}
