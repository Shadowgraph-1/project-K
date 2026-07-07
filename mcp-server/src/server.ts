import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { loadConfig } from "./config.js";
import { formatToolError } from "./errors.js";
import { KonoApiClient } from "./kono-api.js";
import { registerKonoTools } from "./tools/index.js";

export async function startMcpServer() {
  const config = loadConfig();
  const api = new KonoApiClient(config.KONO_API_URL, config.KONO_API_KEY);

  const server = new McpServer({
    name: "kono-mcp-server",
    version: "1.1.0",
  });

  registerKonoTools(server, api);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error(
    `[MCP] Kono MCP Server → ${config.KONO_API_URL} (stdio, Bearer token)`,
  );
}

export async function runMcpServer() {
  try {
    await startMcpServer();
  } catch (error) {
    console.error(formatToolError(error));
    process.exit(1);
  }
}
