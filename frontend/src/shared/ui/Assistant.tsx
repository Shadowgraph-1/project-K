import { Bot, Send, X } from "lucide-react";
import { useState } from "react";

function Assistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const askAssistant = async () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:1234/api/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Если в LM Studio включен токен:
          // Authorization: `Bearer ${import.meta.env.VITE_LM_API_TOKEN}`,
        },
        body: JSON.stringify({
          model: "gemma-4-e4b-it",
          input: trimmedQuestion,
          temperature: 0.7,
          context_length: 4096,
        }),
      });

      if (!response.ok) {
        throw new Error("Не получилось получить ответ от ассистента");
      }

      const data = await response.json();

      const text = data.output
        ?.filter((item: { type: string }) => item.type === "message")
        ?.map((item: { content: string }) => item.content)
        ?.join("\n");

      setAnswer(text ?? "Ассистент не вернул текстовый ответ.");
      setQuestion("");
    } catch {
      setError("Проверьте, что LM Studio запущен и сервер доступен.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-10 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="w-[340px] overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-neutral-950">
                Focus Assistant
              </p>
              <p className="text-xs text-neutral-500">
                Задайте вопрос локальной модели
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-950"
              aria-label="Закрыть ассистента"
            >
              <X size={18} />
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto px-5 py-4">
            {!answer && !error && (
              <p className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-500">
                Привет! Напишите вопрос, и я отвечу через LM Studio.
              </p>
            )}

            {answer && (
              <div className="whitespace-pre-wrap rounded-2xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-800">
                {answer}
              </div>
            )}

            {error && (
              <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              askAssistant();
            }}
            className="border-t border-neutral-100 p-4"
          >
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  askAssistant();
                  e.preventDefault();
                }
              }}
              placeholder="Напишите вопрос..."
              rows={3}
              className="w-full resize-none rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-950"
            />

            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              {loading ? (
                <>
                  <svg
                    className="mr-2 size-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Думаю...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Отправить
                </>
              )}
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-950 text-white shadow-lg transition hover:scale-105 hover:bg-neutral-800"
        aria-label="Открыть ассистента"
      >
        <Bot size={26} />
      </button>
    </div>
  );
}

export default Assistant;
