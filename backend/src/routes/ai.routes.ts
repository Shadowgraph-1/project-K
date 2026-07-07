import type { FastifyPluginAsync } from "fastify";
import { aiChatSchema } from "../schemas/ai.schema.js";
import { routeSchema } from "../openapi/route-schema.js";
import { aiChatResponse, errorResponse } from "../openapi/responses.js";
import * as aiService from "../services/ai.service.js"
import { parseBody } from "../utils/parse-body.js";
import { ApiHttpError, replyApiError } from "../utils/api-errors.js";

const aiRoutes: FastifyPluginAsync = async (app) => {
  app.post(
    "/ai/chat",
    {
      schema: routeSchema({
        tags: ["AI-компаньон"],
        summary: "Чат с компаньоном",
        description:
          "Отправляет сообщение AI с контекстом задач и подзадач проекта.\n\n" +
          "Поддерживает tool calling (те же действия, что MCP): проекты, задачи, подзадачи, комментарии.\n\n" +
          "Использует активный LLM-ключ пользователя или системный LM из env (`LM_BASE_URL`).\n\n" +
          "Лимит: 20 запросов в минуту. Feature flag `assistant_enabled` → **403** если выключен.\n\n" +
          "**503** — LLM недоступен.",
        security: true,
        body: aiChatSchema,
        response: {
          200: aiChatResponse,
          403: errorResponse,
          503: errorResponse,
        },
      }),
      config: { rateLimit: { max: 20, timeWindow: "1 minute" } },
    },
    async (request, reply) => {
      const body = parseBody(aiChatSchema, request.body);

      try {
        return await aiService.chat(request.user.id, body);
      } catch (err) {
        if (err instanceof ApiHttpError) {
          return replyApiError(reply, err.code);
        }
        request.log.error(err);
        return replyApiError(reply, "ai_unavailable");
      }
    },
  );
};

export default aiRoutes;
