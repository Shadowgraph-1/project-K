import type { FastifyPluginAsync } from "fastify";
import { aiChatSchema } from "../schemas/ai.schema.js";
import { llm } from "../llm/client.js";
import { buildSystemPrompt } from "../llm/prompt.js";
import { parseBody } from "../utils/parse-body.js";
import { replyApiError } from "../utils/api-errors.js";

const aiRoutes: FastifyPluginAsync = async (app) => {
  app.post("/ai/chat", async (request, reply) => {
    const { message, tasks, history } = parseBody(aiChatSchema, request.body);

    const systemPrompt = buildSystemPrompt(tasks);

    const historyMessages = (history ?? [])
      .filter((m) => m.content?.trim())
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const completion = await llm.client.chat.completions.create({
        model: llm.model,
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
  });
};

export default aiRoutes;
