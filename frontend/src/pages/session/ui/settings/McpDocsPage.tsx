import { McpSettingsDocsView } from "./mcp/McpSettingsDocsView";

export function McpDocsPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl min-h-0 flex-1 flex-col px-6 pb-12 pt-4 sm:pt-6">
      <McpSettingsDocsView />
    </div>
  );
}