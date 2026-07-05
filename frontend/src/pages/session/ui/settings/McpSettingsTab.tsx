import { DOCS_PATHS } from "@/shared/config/docs-paths";
import { useLegacyDocsViewRedirect } from "@/pages/session/lib/use-legacy-docs-view-redirect";
import { SectionDocsLink } from "@/pages/session/ui/layout/SectionDocsLink";

import { McpSettingsLandingView } from "./mcp/McpSettingsLandingView";

export function McpSettingsTab() {
  useLegacyDocsViewRedirect(DOCS_PATHS.mcp);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex justify-end pb-3">
        <SectionDocsLink to={DOCS_PATHS.mcp} />
      </div>
      <McpSettingsLandingView />
    </div>
  );
}