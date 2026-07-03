import { useCallback, useEffect, useState } from "react";

import {
  MCP_TOOL_NAMES,
  type McpToolDefinition,
} from "@/shared/config/mcp-tools";

const STORAGE_KEY = "kono-assistant-mcp-tools";

function loadEnabledTools(): Set<string> {
  if (typeof window === "undefined") {
    return new Set(MCP_TOOL_NAMES);
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return new Set(MCP_TOOL_NAMES);
  }

  try {
    const parsed = JSON.parse(stored) as string[];
    const valid = parsed.filter((name) =>
      MCP_TOOL_NAMES.includes(name as (typeof MCP_TOOL_NAMES)[number]),
    );
    return valid.length > 0 ? new Set(valid) : new Set(MCP_TOOL_NAMES);
  } catch {
    return new Set(MCP_TOOL_NAMES);
  }
}

function persistEnabledTools(enabled: Set<string>) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...enabled]));
}

export function useMcpToolPreferences() {
  const [enabledTools, setEnabledTools] = useState<Set<string>>(loadEnabledTools);

  useEffect(() => {
    persistEnabledTools(enabledTools);
  }, [enabledTools]);

  const isToolEnabled = useCallback(
    (toolName: McpToolDefinition["name"]) => enabledTools.has(toolName),
    [enabledTools],
  );

  const toggleTool = useCallback((toolName: McpToolDefinition["name"]) => {
    setEnabledTools((current) => {
      const next = new Set(current);
      if (next.has(toolName)) {
        next.delete(toolName);
      } else {
        next.add(toolName);
      }
      return next;
    });
  }, []);

  const setAllTools = useCallback((enabled: boolean) => {
    setEnabledTools(enabled ? new Set(MCP_TOOL_NAMES) : new Set());
  }, []);

  const enabledToolNames = [...enabledTools];
  const enabledCount = enabledTools.size;
  const totalCount = MCP_TOOL_NAMES.length;

  return {
    enabledTools,
    enabledToolNames,
    enabledCount,
    totalCount,
    isToolEnabled,
    toggleTool,
    setAllTools,
  };
}