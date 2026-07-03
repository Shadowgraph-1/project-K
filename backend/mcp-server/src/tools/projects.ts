import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { formatToolError } from "../errors.js";
import type { KonoApiClient } from "../kono-api.js";
import { toolText } from "../result.js";

export function registerProjectTools(server: McpServer, api: KonoApiClient) {
  server.registerTool(
    "create_project",
    {
      title: "Создать проект",
      description:
        "Создаёт новый проект (workspace). Используй, когда пользователь просит создать проект, workspace или доску.",
      inputSchema: {
        name: z.string().min(1).max(100).describe("Название проекта"),
      },
    },
    async ({ name }) => {
      try {
        const workspace = await api.createWorkspace(name);

        return toolText(
          [
            "Проект создан!",
            `ID: ${workspace.id}`,
            `Название: ${workspace.name}`,
            `PublicKey: ${workspace.publicKey}`,
          ].join("\n"),
        );
      } catch (error) {
        return toolText(
          `Ошибка создания проекта: ${formatToolError(error)}`,
          true,
        );
      }
    },
  );

  server.registerTool(
    "list_projects",
    {
      title: "Список проектов",
      description:
        "Показывает список проектов пользователя (свои и shared, куда пригласили).",
      inputSchema: {},
    },
    async () => {
      try {
        const workspaces = await api.listWorkspaces();

        if (workspaces.length === 0) {
          return toolText("У пользователя нет проектов.");
        }

        const list = workspaces
          .map((workspace) => {
            const meta = [workspace.kind, workspace.myRole]
              .filter(Boolean)
              .join(", ");

            return `- ${workspace.name}${meta ? ` (${meta})` : ""} — ID: ${workspace.id}, key: ${workspace.publicKey}`;
          })
          .join("\n");

        return toolText(`Проекты:\n${list}`);
      } catch (error) {
        return toolText(
          `Ошибка списка проектов: ${formatToolError(error)}`,
          true,
        );
      }
    },
  );
}
