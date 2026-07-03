import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { formatToolError } from "../errors.js";
import type { KonoApiClient } from "../kono-api.js";
import { toolText } from "../result.js";

export function registerActivityTools(server: McpServer, api: KonoApiClient) {
  server.registerTool(
    "add_task_comment",
    {
      title: "Комментарий к задаче",
      description:
        "Добавляет комментарий в ленту activity задачи. Можно ответить в ветку через parentActivityId.",
      inputSchema: {
        taskId: z.string().uuid().describe("UUID задачи"),
        body: z.string().min(1).max(4000).describe("Текст комментария"),
        parentActivityId: z
          .string()
          .uuid()
          .optional()
          .describe("UUID записи, на которую отвечаем (опционально)"),
      },
    },
    async ({ taskId, body, parentActivityId }) => {
      try {
        const activity = await api.addTaskComment(
          taskId,
          body,
          parentActivityId,
        );

        return toolText(
          [
            "Комментарий добавлен!",
            `ID: ${activity.id}`,
            `Задача: ${activity.taskId}`,
            `Текст: ${activity.body}`,
          ].join("\n"),
        );
      } catch (error) {
        return toolText(
          `Ошибка добавления комментария: ${formatToolError(error)}`,
          true,
        );
      }
    },
  );
}