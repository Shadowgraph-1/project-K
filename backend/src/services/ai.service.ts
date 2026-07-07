import { runAssistantChatWithTools } from "../ai/assistant-chat.js";
import { createLlmClient, createLlmSettings, llm } from "../llm/client.js";
import { buildSystemPrompt } from "../llm/prompt.js";
import type { AiChatInput } from "../schemas/ai.schema.js";
import { ApiHttpError } from "../utils/api-errors.js";
import { isFeatureEnabled } from "./feature-flags.service.js";
import { resolveUserApiKey } from "./llm-settings.service.js";

export async function chat(
    userId: number,
    input: AiChatInput
) {
    if (!isFeatureEnabled("assistant_enabled")) {
        throw new ApiHttpError("forbidden");
      }

      const userKey = await resolveUserApiKey(userId);
      const activeLlm = userKey
        ? createLlmClient({ ...createLlmSettings(), apiKey: userKey })
        : llm;

      const systemPrompt = buildSystemPrompt(
        input.tasks,
        input.subtasks,
        input.context,
        input.workspaces,
      );

      const historyMessages = (input.history ?? [])
        .filter((m) => m.content?.trim())
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        const { reply, dataChanged, toolsFallback } = await runAssistantChatWithTools({
            client: activeLlm.client,
            model: activeLlm.model,
            systemPrompt,
            history: historyMessages,
            message: input.message,
            userId,
            toolsEnabled: input.toolsEnabled,
            enabledTools: input.enabledTools,  
        })

        const hasDataChanged =
          dataChanged.workspaces ||
          dataChanged.tasks ||
          dataChanged.subtasks ||
          dataChanged.activity;

        return {
          reply,
          dataChanged: hasDataChanged ? dataChanged : undefined,
          toolsFallback: toolsFallback || undefined,
        };
      } catch {
        throw new ApiHttpError("ai_unavailable");
      }
}