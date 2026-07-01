import type { FastifyPluginAsync } from "fastify";
import { aiChatSchema } from "../schemas/ai.schema.js";
import { createLlmClient, createLlmSettings, llm } from "../llm/client.js";
import { buildSystemPrompt } from "../llm/prompt.js";
import { parseBody } from "../utils/parse-body.js";
import { replyApiError } from "../utils/api-errors.js";
import { resolveUserApiKey } from "../services/llm-settings.service.js";
import { isFeatureEnabled } from "../services/feature-flags.service.js";
import { routeSchema } from "../openapi/route-schema.js";
import { aiChatResponse, errorResponse } from "../openapi/responses.js";

const aiRoutes: FastifyPluginAsync = async (app) => {
  app.post(
    "/ai/chat",
    {
      schema: routeSchema({
        tags: ["AI-компаньон"],
        summary: "Чат с компаньоном",
        description:
          "Отправляет сообщение AI с контекстом задач и подзадач проекта.\n\n" +
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
      if (!isFeatureEnabled("assistant_enabled")) {
        return replyApiError(reply, "forbidden");
      }

      const userKey = await resolveUserApiKey(request.user.id);
      const activeLlm = userKey
        ? createLlmClient({ ...createLlmSettings(), apiKey: userKey })
        : llm;

      const { message, tasks, subtasks, history } = parseBody(
        aiChatSchema,
        request.body,
      );

      const systemPrompt = buildSystemPrompt(tasks, subtasks);

      const historyMessages = (history ?? [])
        .filter((m) => m.content?.trim())
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        const completion = await activeLlm.client.chat.completions.create({
          model: activeLlm.model,
          messages: [
            { role: "system", content: systemPrompt },
            ...historyMessages,
            { role: "user", content: message },
          ],
        });

        return {
          reply: completion.choices[0]?.message?.content ?? "",
        };
      } catch (err) {
        request.log.error(err);
        return replyApiError(reply, "ai_unavailable");
      }
    },
  );
};

export default aiRoutes;
