import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

import { api } from "@/api/client";
import { queryKeys } from "@/shared/api/query-keys";
import { normalizeAssistantText } from "@/shared/lib/normalize-assistant-text";

import type { AssistantChatContextPayload } from "./use-assistant-context";
import { useMcpToolPreferences } from "./use-mcp-tool-preferences";

export type AssistantPendingStatus = "thinking" | "acting";

export type AssistantPendingTurn = {
  user: string;
  status: AssistantPendingStatus;
};

type AssistantChatOptions = {
  apiUrl?: string;
  getContext?: () => AssistantChatContextPayload;
};

type Chat = {
  role: "user" | "assistant";
  content: string;
};

type ChatApiResponse = {
  reply: string;
  dataChanged?: {
    workspaces?: boolean;
    tasks?: boolean;
    subtasks?: boolean;
    activity?: boolean;
  };
  toolsFallback?: boolean;
};

const MUTATING_ACTION_MESSAGE_PATTERN =
  /(?:создай|создать|добавь|добавить|удали|удалить|отметь|выполн|разбей|обнови|измени|перенес|закрой)/i;

function shouldExpectDataChange(message: string): boolean {
  return MUTATING_ACTION_MESSAGE_PATTERN.test(message);
}

async function postChat(
  apiUrl: string,
  body: {
    message: string;
    history: Chat[];
    toolsEnabled: boolean;
    enabledTools: string[];
    contextPayload: AssistantChatContextPayload;
  },
) {
  const payload = {
    message: body.message,
    context: body.contextPayload.context,
    workspaces: body.contextPayload.workspaces,
    tasks: body.contextPayload.tasks,
    subtasks: body.contextPayload.subtasks,
    history: body.history,
    toolsEnabled: body.toolsEnabled,
    enabledTools: body.enabledTools,
  };

  if (apiUrl.startsWith("http")) {
    const { data } = await axios.post<ChatApiResponse>(apiUrl, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  }

  const path = apiUrl.startsWith("/") ? apiUrl : `/${apiUrl}`;
  const { data } = await api.post<ChatApiResponse>(path, payload);
  return data;
}

export function useAssistantChat(options: AssistantChatOptions = {}) {
  const { apiUrl = "/ai/chat", getContext } = options;
  const queryClient = useQueryClient();

  const [history, setHistory] = useState<Chat[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [withMcp, setWithMcp] = useState(true);
  const {
    enabledToolNames,
    enabledCount,
    totalCount,
    isToolEnabled,
    toggleTool,
    setAllTools,
  } = useMcpToolPreferences();
  const [pendingTurn, setPendingTurn] = useState<AssistantPendingTurn | null>(
    null,
  );

  const actingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (actingTimerRef.current) {
        clearTimeout(actingTimerRef.current);
      }
    };
  }, []);

  const reset = useCallback(() => {
    setHistory([]);
    setQuestion("");
    setAnswer("");
    setError("");
    setPendingTurn(null);
  }, []);

  const toggleWithMcp = useCallback(() => {
    setWithMcp((value) => !value);
  }, []);

  const askAssistant = useCallback(
    async (messageOverride?: string) => {
      const q = (messageOverride ?? question).trim();
      if (!q || loading) return;

      const historyForApi = history.slice(-40);

      setLoading(true);
      setError("");
      setAnswer("");
      setQuestion("");
      setPendingTurn({ user: q, status: "thinking" });

      actingTimerRef.current = setTimeout(() => {
        setPendingTurn((current) =>
          current?.user === q && current.status === "thinking"
            ? { ...current, status: "acting" }
            : current,
        );
      }, 1800);

      try {
        const toolsActive = withMcp && enabledToolNames.length > 0;

        const data = await postChat(apiUrl, {
          message: q,
          history: historyForApi,
          toolsEnabled: toolsActive,
          enabledTools: enabledToolNames,
          contextPayload: getContext?.() ?? {
            workspaces: [],
            tasks: [],
            subtasks: [],
          },
        });

        const assistantFull = normalizeAssistantText(data.reply);

        if (toolsActive && data.toolsFallback) {
          setError(
            "Модель не поддерживает вызов инструментов (tools). Подключите LLM с tool calling в API ключах.",
          );
        } else if (
          toolsActive &&
          shouldExpectDataChange(q) &&
          !data.dataChanged
        ) {
          setError(
            "Агент ответил, но изменений в Kono не видно. Уточни проект или повтори запрос.",
          );
        }

        if (data.dataChanged?.workspaces) {
          await queryClient.invalidateQueries({
            queryKey: queryKeys.workspaces,
          });
        }
        if (data.dataChanged?.tasks) {
          await queryClient.invalidateQueries({
            queryKey: queryKeys.tasks.all,
          });
        }
        if (data.dataChanged?.subtasks) {
          await queryClient.invalidateQueries({
            queryKey: ["subtasks"],
          });
        }
        if (data.dataChanged?.activity) {
          await queryClient.invalidateQueries({
            queryKey: ["task-activity"],
          });
        }

        setAnswer(assistantFull);
        setHistory((h) => [
          ...h,
          { role: "user", content: q },
          { role: "assistant", content: assistantFull },
        ]);
      } catch {
        setError("Проверьте, что LM Studio запущен и сервер доступен.");
        setQuestion(q);
      } finally {
        if (actingTimerRef.current) {
          clearTimeout(actingTimerRef.current);
          actingTimerRef.current = null;
        }
        setPendingTurn(null);
        setLoading(false);
      }
    },
    [
      apiUrl,
      question,
      loading,
      history,
      withMcp,
      enabledToolNames,
      queryClient,
      getContext,
    ],
  );

  return {
    history,
    question,
    setQuestion,
    answer,
    setAnswer,
    loading,
    error,
    setError,
    askAssistant,
    reset,
    withMcp,
    toggleWithMcp,
    enabledCount,
    totalCount,
    isToolEnabled,
    toggleTool,
    setAllTools,
    pendingTurn,
  };
}
