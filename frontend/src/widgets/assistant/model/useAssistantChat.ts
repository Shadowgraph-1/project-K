import { useCallback, useState } from "react";
import { getCharacterSystemPrompt } from "./ModelPrompts";

type AssistantChatOptions = {
  apiUrl?: string;
  model?: string;
  temperature?: number;
  tasks?: { title: string; done: boolean; description?: string }[];
  characterId?: string;
};

type Chat = {
  role: "user" | "assistant";
  content: string;
}

export function useAssistantChat(options: AssistantChatOptions = {}) {
  const {
    apiUrl = "http://localhost:1234/v1/chat/completions",
    model = "gemma-4-e4b-it",
    temperature = 0.7,
    tasks = [],
    characterId = "nekko",
  } = options;

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

      setLoading(true);
      setError("");
      setAnswer("");

      const sessionLayer =
        tasks.length > 0
          ? `Ты помощник фокус-сессии.
Задачи пользователя:
${tasks.map((t, i) =>
  `${i + 1}. [${t.done ? "✓" : " "}] ${t.title}${t.description ? `\n   Описание: ${t.description}` : ""}`
).join("\n")}

Помогай пользователю выполнять эти задачи, давай советы, разбивай на шаги.`
          : `Ты помощник фокус-сессии. Помогай пользователю сосредоточиться и работать продуктивно.`;

      const persona = getCharacterSystemPrompt(characterId)?.trim() ?? "";
      const systemPrompt = [persona, sessionLayer].filter(Boolean).join("\n\n");

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: "system",
                content: systemPrompt
              },
              ...history,
              {
                role: "user",
                content: q,
              },
            ],
            stream: true,
            temperature,
          }),
        });

        if (!response.ok) {
          throw new Error("Не получилось получить ответ от ассистента");
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("Ответ без тела (ожидался stream)");
        }

        setQuestion("");

        const decoder = new TextDecoder();
        let buffer = "";
        let stop = false;
        let assistantFull = "";

        while (!stop) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (let line of lines) {
            line = line.trimStart();
            if (!line.startsWith("data:")) continue;

            const json = line.startsWith("data: ")
              ? line.slice(6).trim()
              : line.slice(5).trim();

            if (json === "" || json === "[DONE]") {
              if (json === "[DONE]") stop = true;
              continue;
            }

            try {
              const parsed = JSON.parse(json) as {
                choices?: { delta?: { content?: string | null } }[];
              };
              const token = parsed.choices?.[0]?.delta?.content;
              if (typeof token === "string" && token.length > 0) {
                assistantFull += token;
                setAnswer((prev) => prev + token);
              }
            } catch {
              //
            }
          }
        }

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
    [apiUrl, question, loading, model, temperature, tasks, characterId, history],
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
