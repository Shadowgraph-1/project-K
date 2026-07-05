import type { ReactNode } from "react";
import { ChevronRight, ExternalLink, Plus, Plug2 } from "lucide-react";
import { Link } from "react-router-dom";

import { MCP_LLM_SOURCES } from "@/shared/config/mcp-llm-sources";
import { DOCS_PATHS } from "@/shared/config/docs-paths";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

import { LlmProviderIcon } from "./LlmProviderIcon";
import { McpDocsCodeBlock } from "./mcp/McpDocsCodeBlock";
import { DocsTocAside } from "./mcp/DocsTocAside";

const TOC = [
  { id: "how-it-works", label: "Как это работает", depth: 0 },
  { id: "quickstart", label: "Быстрый старт", depth: 0 },
  { id: "get-key", label: "Получить ключ", depth: 1 },
  { id: "add-key", label: "Добавить в Kono", depth: 1 },
  { id: "use-chat", label: "Kono AI", depth: 1 },
  { id: "providers", label: "Провайдеры", depth: 0 },
  { id: "server-config", label: "backend/.env", depth: 0 },
  { id: "lm-studio", label: "LM Studio", depth: 1 },
  { id: "openrouter", label: "OpenRouter", depth: 1 },
  { id: "mcp-note", label: "MCP и JWT", depth: 0 },
] as const;

const LM_STUDIO_ENV = `# backend/.env — локальный LM Studio
LM_BASE_URL=http://localhost:1234/v1
LM_API_KEY=lm-studio
LM_MODEL=qwen2.5-7b-instruct`;

const OPENROUTER_ENV = `# backend/.env — OpenRouter (ключи пользователей в UI)
LM_BASE_URL=https://openrouter.ai/api/v1
LM_API_KEY=placeholder
LM_MODEL=openai/gpt-4o-mini`;

const PROSE =
  "mx-auto w-full max-w-2xl px-1 text-pretty leading-6 sm:px-2 [&_hr]:my-10 [&_hr]:border-border [&_p]:mb-4 [&_p]:max-w-2xl [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_p_a]:text-foreground [&_p_a]:underline [&_p_a]:underline-offset-2 [&_strong]:font-medium [&_strong]:text-foreground [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ul]:text-sm [&_ul]:text-muted-foreground [&_ul:not(.not-prose)_a]:text-foreground [&_ul:not(.not-prose)_a]:underline [&_ul:not(.not-prose)_a]:underline-offset-2";

function DocsInlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="not-prose rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[0.95em] text-amber-700 dark:text-amber-300">
      {children}
    </code>
  );
}

function DocsHeading({
  id,
  level,
  children,
}: {
  id: string;
  level: 2 | 3;
  children: ReactNode;
}) {
  const Tag = level === 2 ? "h2" : "h3";
  const className =
    level === 2
      ? "not-prose mb-4 mt-12 scroll-mt-24 text-xl font-medium leading-snug text-foreground"
      : "not-prose mb-3 mt-10 scroll-mt-24 text-lg font-medium leading-normal text-foreground";

  return (
    <Tag id={id} className={className}>
      <a href={`#${id}`} className="not-prose hover:text-foreground/80">
        {children}
      </a>
    </Tag>
  );
}

type LlmKeysDocsViewProps = {
  onCreate: (presetLabel?: string) => void;
};

export function LlmKeysDocsView({ onCreate }: LlmKeysDocsViewProps) {
  return (
    <div className="flex min-w-0 gap-8 pb-12">
      <div className="min-w-0 flex-1 pt-2 sm:pt-4">
        <main className={cn(PROSE)}>
          <div className="not-prose">
            <h4 className="pb-1 text-xs font-medium text-muted-foreground">
              Kono AI
            </h4>
            <h1
              id="llm-keys"
              className="scroll-mt-24 text-3xl font-medium tracking-tight text-foreground"
            >
              Подключение LLM
            </h1>

            <div className="mb-5 mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                className="h-auto shrink-0 gap-1 rounded-full px-4 py-2 shadow-sm"
                onClick={() => onCreate()}
              >
                <Plus className="size-4" aria-hidden />
                Создать ключ
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-auto shrink-0 gap-1 rounded-full px-4 py-2"
                asChild
              >
                <Link to={DOCS_PATHS.mcp} className="no-underline">
                  Документация MCP
                  <ChevronRight className="size-4" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>

          <p>
            API-ключ провайдера хранится в вашем аккаунте Kono и подставляется в
            запросы ассистента вместо системного{" "}
            <DocsInlineCode>LM_API_KEY</DocsInlineCode>. Адрес API и модель
            задаёт администратор сервера в{" "}
            <DocsInlineCode>backend/.env</DocsInlineCode>.
          </p>

          <p>
            Для MCP в чате нужна модель с поддержкой{" "}
            <DocsInlineCode>tools</DocsInlineCode> (вызов функций). Без своих
            ключей используется системный LLM из env — строка «Kono AI» в
            таблице ключей.
          </p>

          <hr />

          <DocsHeading id="how-it-works" level={2}>
            Как это работает
          </DocsHeading>

          <p>
            <strong>Схема подключения:</strong>
          </p>

          <ul>
            <li>
              <strong>Сервер</strong> —{" "}
              <DocsInlineCode>LM_BASE_URL</DocsInlineCode> и{" "}
              <DocsInlineCode>LM_MODEL</DocsInlineCode> в env
            </li>
            <li>
              <strong>Пользователь</strong> — свой apiKey в разделе API ключи
            </li>
            <li>
              <strong>Чат</strong> —{" "}
              <DocsInlineCode>POST /ai/chat</DocsInlineCode> с активным ключом
            </li>
          </ul>

          <p>
            Активный ключ один на аккаунт. Первый добавленный ключ включается
            автоматически; переключение — через «Использовать ключ» в таблице.
            Полный ключ после сохранения не показывается, только маска.
          </p>

          <DocsHeading id="quickstart" level={2}>
            Быстрый старт
          </DocsHeading>

          <DocsHeading id="get-key" level={3}>
            Получить ключ
          </DocsHeading>

          <p>
            Зарегистрируйтесь у провайдера и создайте API-ключ на его сайте.
            Для tool calling выбирайте модели с поддержкой функций — у OpenRouter
            это фильтр{" "}
            <DocsInlineCode>supported_parameters=tools</DocsInlineCode>.
          </p>

          <DocsHeading id="add-key" level={3}>
            Добавить в Kono
          </DocsHeading>

          <p>
            Нажмите «Создать ключ», вставьте apiKey и укажите название (например,
            OpenRouter). Минимальная длина ключа — 8 символов.
          </p>

          <ul>
            <li>
              <strong>Название</strong> — для удобства в таблице
            </li>
            <li>
              <strong>Ключ</strong> — значение от провайдера (
              <DocsInlineCode>sk-or-v1-…</DocsInlineCode>,{" "}
              <DocsInlineCode>lm-studio</DocsInlineCode> и т.д.)
            </li>
          </ul>

          <DocsHeading id="use-chat" level={3}>
            Kono AI
          </DocsHeading>

          <p>
            Откройте чат ассистента в workspace. Если ключ активен, запросы идут
            с вашим apiKey. Для вызова инструментов Kono включите MCP под полем
            ввода — см.{" "}
            <Link to={DOCS_PATHS.mcp}>документацию MCP</Link>.
          </p>

          <p>
            <strong>Важно:</strong> LLM-ключ — для модели в чате. JWT (
            <DocsInlineCode>KONO_API_KEY</DocsInlineCode>) — только для внешнего
            MCP-сервера, это разные credentials.
          </p>

          <DocsHeading id="providers" level={2}>
            Провайдеры
          </DocsHeading>

          <p>
            Платформы с моделями, поддерживающими вызов функций. Получите ключ на
            сайте провайдера и добавьте его здесь.
          </p>

          <ul className="not-prose space-y-2 pl-0">
            {MCP_LLM_SOURCES.map((source) => (
              <li key={source.id} className="list-none">
                <div className="flex flex-col gap-3 rounded-lg border border-border/50 p-3 sm:flex-row sm:items-center">
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-w-0 flex-1 items-center gap-3 transition-colors hover:opacity-90"
                  >
                    <LlmProviderIcon source={source} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-foreground">
                        {source.title}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {source.description}
                      </span>
                    </span>
                    <ExternalLink className="size-3.5 shrink-0 text-muted-foreground" />
                  </a>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 shrink-0 rounded-full px-3 text-xs"
                    onClick={() => onCreate(source.title)}
                  >
                    Добавить ключ
                  </Button>
                </div>
              </li>
            ))}
            <li className="list-none">
              <div className="flex flex-col gap-3 rounded-lg border border-border/50 p-3 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#525CD1]/15 text-[#525CD1] dark:bg-indigo-500/15 dark:text-indigo-400"
                    aria-hidden
                  >
                    <Plug2 className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-foreground">
                      Свой провайдер
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Любой OpenAI-compatible API + LM_BASE_URL на сервере
                    </span>
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="h-8 shrink-0 rounded-full px-3 text-xs"
                  onClick={() => onCreate()}
                >
                  Добавить ключ
                </Button>
              </div>
            </li>
          </ul>

          <DocsHeading id="server-config" level={2}>
            backend/.env
          </DocsHeading>

          <p>
            Администратор задаёт endpoint и модель. Ключи пользователей из UI
            заменяют только <DocsInlineCode>LM_API_KEY</DocsInlineCode> при
            активном ключе в аккаунте.
          </p>

          <DocsHeading id="lm-studio" level={3}>
            LM Studio
          </DocsHeading>

          <p>
            Запустите Local Server в LM Studio. Ключ в UI можно указать как{" "}
            <DocsInlineCode>lm-studio</DocsInlineCode> или оставить системный по
            умолчанию.
          </p>

          <McpDocsCodeBlock label="env" code={LM_STUDIO_ENV} />

          <DocsHeading id="openrouter" level={3}>
            OpenRouter
          </DocsHeading>

          <p>
            Ключ <DocsInlineCode>sk-or-v1-…</DocsInlineCode> получите на{" "}
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noreferrer"
            >
              openrouter.ai/keys
            </a>
            . Добавьте его через «Создать ключ» — Kono подставит его в запросы.
          </p>

          <McpDocsCodeBlock label="env" code={OPENROUTER_ENV} />

          <DocsHeading id="mcp-note" level={2}>
            MCP и JWT
          </DocsHeading>

          <p>
            Для встроенного MCP в чате достаточно LLM-ключа и модели с tools.
            Внешний stdio-сервер Kono авторизуется JWT через{" "}
            <DocsInlineCode>POST /auth/login</DocsInlineCode> — подробности в
            разделе MCP.
          </p>

          <div className="not-prose mt-6">
            <Button
              type="button"
              variant="default"
              className="h-auto gap-1 rounded-full px-4 py-2 text-primary-foreground hover:brightness-90 hover:text-primary-foreground"
              asChild
            >
              <Link to={DOCS_PATHS.mcp} className="no-underline">
                Документация MCP
                <ChevronRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>

          <hr className="mb-10 mt-16" />
        </main>
      </div>

      <DocsTocAside items={TOC} />
    </div>
  );
}
