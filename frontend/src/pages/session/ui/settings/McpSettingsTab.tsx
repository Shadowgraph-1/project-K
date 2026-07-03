import { useMemo } from "react";

import { useSessionPageSectionRegistry } from "@/pages/session/model/SessionPageSectionContext";

import { McpSettingsDocsView } from "./mcp/McpSettingsDocsView";
import { McpSettingsLandingView } from "./mcp/McpSettingsLandingView";
import { MCP_SECTION_OPTIONS } from "./page-section-options";
import { useMcpPageStyle, type McpPageStyle } from "./mcp/useMcpPageStyle";

export function McpSettingsTab() {
  const [style, setStyle] = useMcpPageStyle();

  const sectionConfig = useMemo(
    () => ({
      ariaLabel: "Раздел MCP",
      options: MCP_SECTION_OPTIONS,
      value: style,
      onChange: (id: string) => setStyle(id as McpPageStyle),
    }),
    [style, setStyle],
  );

  useSessionPageSectionRegistry(sectionConfig);

  return style === "landing" ? (
    <McpSettingsLandingView />
  ) : (
    <McpSettingsDocsView />
  );
}
