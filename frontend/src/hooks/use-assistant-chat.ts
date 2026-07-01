import { useCallback, useState } from "react";
import axios from "axios";

import { api } from "@/api/client";
import { normalizeAssistantText } from "@/shared/lib/normalize-assistant-text";

export type AssistantContextItem = {
  title: string;
  done: boolean;
  description?: string;
};

type AssistantChatOptions = {
  apiUrl?: string;
  tasks?: AssistantContextItem[];
  subtasks?: AssistantContextItem[];
};

type Chat = {
  role: "user" | "assistant";
  content: string;
};

type ChatApiResponse = {
  reply: string;
};

async function postChat(
  apiUrl: string,
  body: {
    message: string;
    tasks: AssistantContextItem[];
    subtasks: AssistantContextItem[];
    history: Chat[];
  },
) {
  if (apiUrl.startsWith("http")) {
    const { data } = await axios.post<ChatApiResponse>(apiUrl, body, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  }

  const path = apiUrl.startsWith("/") ? apiUrl : `/${apiUrl}`;
  const { data } = await api.post<ChatApiResponse>(path, body);
  return data;
}

export function useAssistantChat(options: AssistantChatOptions = {}) {
  const { apiUrl = "/ai/chat", tasks = [], subtasks = [] } = options;

  const [history, setHistory] = useState<Chat[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reset = useCallback(() => {
    setHistory([]);
    setQuestion("");
    setAnswer("");
    setError("");
  }, []);

  const askAssistant = useCallback(
    async (messageOverride?: string) => {
      const q = (messageOverride ?? question).trim();
      if (!q || loading) return;

      const historyForApi = history.slice(-40);

      setLoading(true);
      setError("");
      setAnswer("");

      try {
        const data = await postChat(apiUrl, {
          message: q,
          tasks,
          subtasks,
          history: historyForApi,
        });

        const assistantFull = normalizeAssistantText(data.reply);

        setAnswer(assistantFull);
        setQuestion("");
        setHistory((h) => [
          ...h,
          { role: "user", content: q },
          { role: "assistant", content: assistantFull },
        ]);
      } catch {
        setError("Проверьте, что LM Studio запущен и сервер доступен.");
      } finally {
        setLoading(false);
      }
    },
    [apiUrl, question, loading, tasks, subtasks, history],
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
  };
}
