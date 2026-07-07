import { useMemo, type ReactNode } from "react";
import { ChevronRight, Copy, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { MCP_LLM_SOURCES } from "@/shared/config/mcp-llm-sources";
import {
  MCP_TOOL_CATEGORIES,
  MCP_TOOLS,
  type McpToolCategory,
} from "@/shared/config/mcp-tools";
import { SESSION_PATHS } from "@/pages/session/model/sessionPaths";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

import { LlmProviderIcon } from "../LlmProviderIcon";
import { McpDocsCodeBlock } from "./McpDocsCodeBlock";
import { DocsTocAside } from "./DocsTocAside";
import { useMcpInstallTabs } from "./useMcpInstallTabs";

const TOC = [
  { id: "quickstart", label: "Быстрый старт", depth: 0 },
  { id: "in-app-chat", label: "Kono AI в приложении", depth: 1 },
  { id: "external-server", label: "Внешний MCP-сервер", depth: 1 },
  { id: "jwt-token", label: "Получение JWT", depth: 1 },
  { id: "env-config", label: "backend/.env", depth: 1 },
  { id: "tools", label: "Инструменты", depth: 0 },
  { id: "bot-capabilities", label: "Что умеет бот", depth: 1 },
  { id: "llm-providers", label: "Провайдеры LLM", depth: 0 },
] as const;

const TOOL_CATEGORY_ORDER: McpToolCategory[] = [
  "projects",
  "tasks",
  "subtasks",
  "activity",
  "search",
];

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

function CopyForLlmButton({ markdown }: { markdown: string }) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(markdown);
      toast.success("Markdown скопирован");
    } catch {
      toast.error("Не удалось скопировать");
    }
  }

  return (
    <button
      type="button"
      onClick={() => void copy()}
      className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
    >
      <Copy className="size-4" aria-hidden />
      Скопировать для LLM
    </button>
  );
}

export function McpSettingsDocsView() {
  const { apiUrl, mcpClientConfig, envExample, jwtExamples } = useMcpInstallTabs();

  const llmMarkdown = useMemo(
    () =>
      MCP_LLM_SOURCES.map(
        (source) => `- [${source.title}](${source.href}): ${source.description}`,
      ).join("\n"),
    [],
  );

  const toolsByCategory = useMemo(
    () =>
      TOOL_CATEGORY_ORDER.map((category) => ({
        category,
        label: MCP_TOOL_CATEGORIES[category],
        tools: MCP_TOOLS.filter((tool) => tool.category === category),
      })),
    [],
  );

  const markdownDoc = useMemo(
    () =>
      [
        "# MCP-сервер Kono",
        "",
        "Kono предоставляет MCP-инструменты для управления проектами, задачами, подзадачами и комментариями.",
        "",
        "## Подключение",
        "",
        "Локальный stdio-сервер (не HTTP). Запуск: `npx -y @kono/mcp-server@latest`",
        "",
        `API URL: ${apiUrl}`,
        "",
        "## Быстрый старт — Kono AI",
        "",
        "1. Подключите LLM с инструментами в API ключах",
        "2. Включите MCP в чате Kono AI",
        "",
        "## Быстрый старт — внешний MCP",
        "",
        "### Получение JWT",
        "",
        "Запрос:",
        "",
        "```bash",
        jwtExamples.curl,
        "```",
        "",
        "Из ответа скопируйте поле `token` в `KONO_API_KEY`.",
        "",
        "PowerShell:",
        "",
        "```powershell",
        jwtExamples.powershell,
        "```",
        "",
        "### Переменные окружения",
        "",
        "```",
        envExample,
        "```",
        "",
        "### Конфиг MCP-клиента",
        "",
        "```json",
        mcpClientConfig,
        "```",
        "",
        "## Инструменты",
        "",
        ...toolsByCategory.flatMap(({ label, tools }) => [
          `### ${label}`,
          "",
          ...tools.map(
            (tool) =>
              `- \`${tool.name}\`${tool.destructive ? " (необратимо)" : ""} — ${tool.description}`,
          ),
          "",
        ]),
        "",
        "## Что умеет бот",
        "",
        "- Создавать проекты и задачи по запросу в чате",
        "- Обновлять статусы задач и подзадач (отметить выполненной, отложить)",
        "- Удалять задачи и подзадачи по явной просьбе",
        "- Декомпозировать задачи на подзадачи",
        "- Оставлять комментарии в ленте задачи",
        "- Искать проекты и задачи по названию",
        "",
        "## Провайдеры LLM",
        "",
        llmMarkdown,
      ].join("\n"),
    [
      apiUrl,
      envExample,
      mcpClientConfig,
      llmMarkdown,
      jwtExamples,
      toolsByCategory,
    ],
  );

  return (
    <div className="flex min-w-0 gap-8 pb-12">
      <div className="min-w-0 flex-1 pt-2 sm:pt-4">
        <main
          className={cn(
            "mx-auto w-full max-w-2xl px-1 text-pretty leading-6 sm:px-2",
            "[&_p_a]:text-foreground [&_p_a]:underline [&_p_a]:underline-offset-2",
            "[&_ul:not(.not-prose)_a]:text-foreground [&_ul:not(.not-prose)_a]:underline [&_ul:not(.not-prose)_a]:underline-offset-2",
            "[&_hr]:my-10 [&_hr]:border-border",
            "[&_p]:mb-4 [&_p]:max-w-2xl [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-muted-foreground",
            "[&_strong]:font-medium [&_strong]:text-foreground",
            "[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ul]:text-sm [&_ul]:text-muted-foreground",
          )}
        >
          <div className="not-prose">
            <h4 className="pb-1 text-xs font-medium text-muted-foreground">
              Разработчикам
            </h4>
            <h1
              id="kono-mcp-server"
              className="scroll-mt-24 text-3xl font-medium tracking-tight text-foreground"
            >
              MCP-сервер Kono
            </h1>

            <div className="mb-5 mt-4 flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
                <CopyForLlmButton markdown={markdownDoc} />
                <span className="hidden h-4 border-l border-border sm:inline" />
                <a
                  href="https://modelcontextprotocol.io"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ExternalLink className="size-4" aria-hidden />
                  modelcontextprotocol.io
                </a>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="default"
                  className="h-auto shrink-0 gap-1 rounded-full px-4 py-2 text-primary-foreground hover:brightness-90 hover:text-primary-foreground"
                  asChild
                >
                  <Link to={SESSION_PATHS.llmKeys} className="no-underline">
                    API ключи
                    <ChevronRight className="size-4" aria-hidden />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <p>
            Kono поддерживает{" "}
            <a href="https://modelcontextprotocol.io/" target="_blank" rel="noreferrer">
              Model Context Protocol (MCP)
            </a>{" "}
            двумя способами: встроенный вызов инструментов в чате Kono AI и
            локальный stdio-сервер для внешних MCP-хостов. Ассистент может
            управлять проектами, задачами, подзадачами, комментариями и
            искать по workspace — без ручного копирования данных в промпт.
          </p>

          <p>
            Для чата нужна LLM с поддержкой{" "}
            <DocsInlineCode>tools</DocsInlineCode> (вызов функций). Ключ
            провайдера настраивается в разделе API ключи.
          </p>

          <p>
            <strong>Транспорт внешнего сервера:</strong>
          </p>

          <McpDocsCodeBlock label="текст" code="stdio (npx -y @kono/mcp-server@latest)" />

          <p>
            Сервер ходит в Kono REST API с JWT пользователя. Сессии MCP не
            требуются — достаточно переменных окружения и конфига клиента.
            Инструменты соответствуют спецификации MCP: JSON Schema для
            параметров, <DocsInlineCode>isError</DocsInlineCode> при ошибках,
            <DocsInlineCode>destructiveHint</DocsInlineCode> для удаления.
          </p>

          <hr />

          <DocsHeading id="quickstart" level={2}>
            Быстрый старт
          </DocsHeading>

          <DocsHeading id="in-app-chat" level={3}>
            Kono AI в приложении
          </DocsHeading>

          <p>
            В чате Kono AI включите MCP кнопкой под полем ввода. Модель с
            поддержкой вызова функций сможет вызывать все инструменты Kono
            напрямую — создавать и удалять задачи, менять статусы, добавлять
            подзадачи, оставлять комментарии, искать по проектам.
          </p>

          <ul>
            <li>
              <strong>LLM:</strong> модель с{" "}
              <DocsInlineCode>tools</DocsInlineCode> (вызов функций)
            </li>
            <li>
              <strong>Ключ:</strong>{" "}
              <Link to={SESSION_PATHS.llmKeys}>API ключи Kono</Link>
            </li>
            <li>
              <strong>MCP:</strong> переключатель MCP в панели ввода чата
            </li>
          </ul>

          <DocsHeading id="external-server" level={3}>
            Внешний MCP-сервер
          </DocsHeading>

          <p>
            Локальный stdio-сервер Kono подключается к любому MCP-хосту. Для
            авторизации нужен JWT пользователя — его получают через{" "}
            <DocsInlineCode>POST /auth/login</DocsInlineCode> (или{" "}
            <DocsInlineCode>POST /auth/register</DocsInlineCode> при регистрации).
          </p>

          <DocsHeading id="jwt-token" level={3}>
            Получение JWT
          </DocsHeading>

          <p>
            Отправьте email и пароль на{" "}
            <DocsInlineCode>{jwtExamples.loginUrl}</DocsInlineCode>. В ответе
            будет JSON с полем <DocsInlineCode>token</DocsInlineCode> — его
            значение и есть JWT для <DocsInlineCode>KONO_API_KEY</DocsInlineCode>.
          </p>

          <p>
            <strong>curl:</strong>
          </p>

          <McpDocsCodeBlock label="bash" code={jwtExamples.curl} />

          <p>
            Сразу вытащить только токен (нужен{" "}
            <DocsInlineCode>jq</DocsInlineCode>):
          </p>

          <McpDocsCodeBlock label="bash" code={jwtExamples.curlExtract} />

          <p>
            <strong>PowerShell:</strong>
          </p>

          <McpDocsCodeBlock label="powershell" code={jwtExamples.powershell} />

          <p>Пример ответа:</p>

          <McpDocsCodeBlock
            label="json"
            code={`{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Имя",
    "email": "you@example.com"
  }
}`}
          />

          <p>Добавьте сервер в конфиг MCP-клиента:</p>

          <McpDocsCodeBlock label="json" code={mcpClientConfig} />

          <DocsHeading id="env-config" level={3}>
            Переменные окружения
          </DocsHeading>

          <p>
            Передайте переменные в блоке <DocsInlineCode>env</DocsInlineCode>{" "}
            конфига MCP-клиента:
          </p>

          <McpDocsCodeBlock label="env" code={envExample} />

          <p>Запуск сервера:</p>

          <McpDocsCodeBlock label="команда" code="npx -y @kono/mcp-server@latest" />

          <DocsHeading id="tools" level={2}>
            Инструменты
          </DocsHeading>

          <p>
            Один и тот же набор из {MCP_TOOLS.length} инструментов доступен в
            чате Kono AI и на внешнем MCP-сервере:
          </p>

          {toolsByCategory.map(({ category, label, tools }) => (
            <div key={category}>
              <DocsHeading id={`tools-${category}`} level={3}>
                {label}
              </DocsHeading>
              <ul>
                {tools.map((tool) => (
                  <li key={tool.name}>
                    <DocsInlineCode>{tool.name}</DocsInlineCode>
                    {tool.destructive ? " (необратимо)" : ""} —{" "}
                    {tool.description}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <DocsHeading id="bot-capabilities" level={3}>
            Что умеет бот
          </DocsHeading>

          <p>Примеры запросов, которые Kono AI обрабатывает через MCP:</p>

          <ul>
            <li>
              <strong>Проекты:</strong> «Создай проект Marketing Q3», «Покажи мои
              проекты»
            </li>
            <li>
              <strong>Задачи:</strong> «Добавь задачу „Подготовить отчёт" в
              проект X», «Отметь задачу Y выполненной», «Удали задачу Z»
            </li>
            <li>
              <strong>Подзадачи:</strong> «Разбей задачу на шаги: дизайн,
              вёрстка, тесты», «Отметь подзадачу „вёрстка" выполненной»
            </li>
            <li>
              <strong>Комментарии:</strong> «Оставь комментарий к задаче: жду
              макеты от дизайнера»
            </li>
            <li>
              <strong>Поиск:</strong> «Найди задачи про деплой», «Где проект
              Backend?»
            </li>
          </ul>

          <p>
            Бот сам вызывает <DocsInlineCode>list_projects</DocsInlineCode>,{" "}
            <DocsInlineCode>search_kono</DocsInlineCode> или{" "}
            <DocsInlineCode>list_tasks</DocsInlineCode>, чтобы получить UUID —
            не нужно копировать ID вручную. Удаление задач и подзадач
            выполняется только по явной просьбе.
          </p>

          <DocsHeading id="llm-providers" level={2}>
            Провайдеры LLM
          </DocsHeading>

          <p>
            Платформы с моделями, поддерживающими вызов функций. Ключ подключите
            в{" "}
            <Link to={SESSION_PATHS.llmKeys}>API ключах</Link>.
          </p>

          <ul className="not-prose space-y-2 pl-0">
            {MCP_LLM_SOURCES.map((source) => (
              <li key={source.id} className="list-none">
                <a
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-border/50 px-3 py-2 transition-colors hover:bg-muted/30"
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
              </li>
            ))}
          </ul>

          <hr className="mb-10 mt-16" />

          <div className="not-prose flex flex-col items-start justify-between gap-2 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              API:{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">{apiUrl}</code>
            </p>
            <CopyForLlmButton markdown={markdownDoc} />
          </div>
        </main>
      </div>

      <DocsTocAside items={TOC} />
    </div>
  );
}