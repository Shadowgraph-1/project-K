import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export function toolText(text: string, isError = false): CallToolResult {
  return {
    isError,
    content: [{ type: "text", text }],
  };
}

export function toolJson(data: unknown, isError = false): CallToolResult {
  return toolText(
    typeof data === "string" ? data : JSON.stringify(data, null, 2),
    isError,
  );
}
