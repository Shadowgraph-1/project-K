import type OpenAI from "openai";

import {
  buildToolsSystemAppendix,
  executeKonoAssistantTool,
  filterAssistantTools,
  trackKonoToolMutation,
  type KonoToolDataChanged,
} from "./kono-tools.js";

const MAX_TOOL_ROUNDS = 8;

type AssistantChatParams = {
  client: OpenAI;
  model: string;
  systemPrompt: string;
  history: Array<{ role: "user" | "assistant"; content: string }>;
  message: string;
  userId: number;
  toolsEnabled?: boolean;
  enabledTools?: string[];
};

export type AssistantChatResult = {
  reply: string;
  dataChanged: KonoToolDataChanged;
  toolsFallback?: boolean;
};

function isToolsUnsupportedError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message.toLowerCase();
  return (
    msg.includes("tool") ||
    msg.includes("function") ||
    msg.includes("not supported")
  );
}

const ACTION_MESSAGE_PATTERN =
  /(?:создай|создать|добавь|добавить|удали|удалить|отметь|выполн|разбей|подзадач|комментар|найди|поиск|покажи|список|обнови|измени|перенес|закрой)/i;

const MUTATING_ACTION_MESSAGE_PATTERN =
  /(?:создай|создать|добавь|добавить|удали|удалить|отметь|выполн|разбей|обнови|измени|перенес|закрой)/i;

function shouldRequireToolCall(message: string): boolean {
  return ACTION_MESSAGE_PATTERN.test(message);
}

function shouldRequireMutatingToolCall(message: string): boolean {
  return MUTATING_ACTION_MESSAGE_PATTERN.test(message);
}

function hadMutatingChange(dataChanged: KonoToolDataChanged): boolean {
  return (
    dataChanged.workspaces ||
    dataChanged.tasks ||
    dataChanged.subtasks ||
    dataChanged.activity
  );
}

function looksLikeActionCompleted(reply: string): boolean {
  return /(?:готово|создал|создан|добавил|добавлен|обновил|удалил|выполнил|сделал|всё сделал|уже добавил|задач.*добавлен)/i.test(
    reply,
  );
}

function looksLikeIdRequest(reply: string): boolean {
  return /workspaceId|taskId|subtaskId|UUID|id проекта|название проекта.*id/i.test(
    reply,
  );
}

export async function runAssistantChatWithTools({
  client,
  model,
  systemPrompt,
  history,
  message,
  userId,
  toolsEnabled = true,
  enabledTools,
}: AssistantChatParams): Promise<AssistantChatResult> {
  const dataChanged: KonoToolDataChanged = {
    workspaces: false,
    tasks: false,
    subtasks: false,
    activity: false,
  };

  if (!toolsEnabled) {
    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        ...history.map((entry) => ({
          role: entry.role,
          content: entry.content,
        })),
        { role: "user", content: message },
      ],
    });

    return {
      reply: completion.choices[0]?.message?.content?.trim() ?? "",
      dataChanged,
    };
  }

  const activeTools = filterAssistantTools(enabledTools);
  const toolsSystemPrompt = `${systemPrompt}${buildToolsSystemAppendix(enabledTools)}`;

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: toolsSystemPrompt },
    ...history.map((entry) => ({
      role: entry.role,
      content: entry.content,
    })),
    { role: "user", content: message },
  ];

  let nudgedForTools = false;
  let nudgedForFalseSuccess = false;
  let toolsInvoked = false;

  try {
    for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
      const requireTools = round === 0 && shouldRequireToolCall(message);

      const completion = await client.chat.completions.create({
        model,
        messages,
        tools: activeTools,
        tool_choice: requireTools ? "required" : "auto",
      });

      const assistantMessage = completion.choices[0]?.message;
      if (!assistantMessage) {
        return { reply: "", dataChanged };
      }

      const toolCalls = assistantMessage.tool_calls;
      if (!toolCalls?.length) {
        const reply = assistantMessage.content?.trim() ?? "";

        if (
          !nudgedForTools &&
          shouldRequireToolCall(message) &&
          looksLikeIdRequest(reply)
        ) {
          nudgedForTools = true;
          messages.push(assistantMessage);
          messages.push({
            role: "user",
            content:
              "Не спрашивай UUID у пользователя. Вызови list_projects или search_kono, затем выполни действие через инструменты.",
          });
          continue;
        }

        if (
          !nudgedForFalseSuccess &&
          shouldRequireMutatingToolCall(message) &&
          !hadMutatingChange(dataChanged)
        ) {
          nudgedForFalseSuccess = true;
          messages.push(assistantMessage);
          messages.push({
            role: "user",
            content:
              "Ты не выполнил действие в Kono. Найди проект через list_projects или контекст UI, затем вызови нужные инструменты (create_task — для каждой задачи отдельно). Не утверждай успех без результата инструмента.",
          });
          continue;
        }

        if (
          shouldRequireMutatingToolCall(message) &&
          !hadMutatingChange(dataChanged) &&
          (looksLikeActionCompleted(reply) || toolsInvoked)
        ) {
          return {
            reply: `${reply}\n\nИзменений в Kono не обнаружено — возможно, инструменты не сработали. Уточни проект или повтори запрос.`,
            dataChanged,
          };
        }

        return {
          reply,
          dataChanged,
        };
      }

      messages.push(assistantMessage);

      for (const toolCall of toolCalls) {
        if (toolCall.type !== "function") continue;
        toolsInvoked = true;

        let parsedArgs: Record<string, unknown> = {};
        try {
          parsedArgs = JSON.parse(toolCall.function.arguments || "{}") as Record<
            string,
            unknown
          >;
        } catch {
          parsedArgs = {};
        }

        const toolName = toolCall.function.name;
        const result = await executeKonoAssistantTool(
          userId,
          toolName,
          parsedArgs,
        );

        trackKonoToolMutation(toolName, result, dataChanged);

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: result,
        });
      }
    }

    return {
      reply:
        "Слишком много шагов с инструментами — попробуй переформулировать запрос.",
      dataChanged,
    };
  } catch (error) {
    if (!isToolsUnsupportedError(error)) {
      throw error;
    }

    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        ...history.map((entry) => ({
          role: entry.role,
          content: entry.content,
        })),
        { role: "user", content: message },
      ],
    });

    return {
      reply: completion.choices[0]?.message?.content?.trim() ?? "",
      dataChanged,
      toolsFallback: true,
    };
  }
}