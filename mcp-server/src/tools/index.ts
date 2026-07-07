import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import type { KonoApiClient } from "../kono-api.js";
import { registerActivityTools } from "./activity.js";
import { registerProjectTools } from "./projects.js";
import { registerSubtaskTools } from "./subtasks.js";
import { registerTaskTools } from "./tasks.js";

export function registerKonoTools(server: McpServer, api: KonoApiClient) {
  registerProjectTools(server, api);
  registerTaskTools(server, api);
  registerSubtaskTools(server, api);
  registerActivityTools(server, api);
}
