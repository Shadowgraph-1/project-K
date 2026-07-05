export const DOCS_PATHS = {
  mcp: "/docs/mcp",
  connectors: "/docs/connectors",
  apiKeys: "/docs/api-keys",
} as const;

export function isDocsPath(pathname: string) {
  return (
    pathname === DOCS_PATHS.mcp ||
    pathname === DOCS_PATHS.connectors ||
    pathname === DOCS_PATHS.apiKeys
  );
}

export const LEGACY_DOCS_REDIRECTS = [
  { from: "/projects/mcp/docs", to: DOCS_PATHS.mcp },
  { from: "/projects/connectors/docs", to: DOCS_PATHS.connectors },
  { from: "/projects/api-keys/docs", to: DOCS_PATHS.apiKeys },
] as const;