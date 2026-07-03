import type { ReactNode } from "react";
import {
  ArrowUpRight,
  Bot,
  Check,
  ChevronRight,
  ExternalLink,
  Plug2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { MCP_LLM_SOURCES } from "@/shared/config/mcp-llm-sources";
import {
  MCP_TOOL_CATEGORIES,
  MCP_TOOLS,
  type McpToolCategory,
} from "@/shared/config/mcp-tools";
import { SESSION_PATHS } from "@/pages/session/model/sessionPaths";
import { McpLogo } from "@/shared/ui/icons/McpLogo";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

import { LlmProviderIcon } from "../LlmProviderIcon";
import { McpInstallBlock } from "../McpInstallBlock";
import { useMcpInstallTabs } from "./useMcpInstallTabs";

const TOOL_CATEGORY_ORDER: McpToolCategory[] = [
  "projects",
  "tasks",
  "subtasks",
  "activity",
  "search",
];

const MCP_FEATURES = [
  {
    icon: Bot,
    iconClassName: "size-7",
    title: "В чате Kono AI",
    description:
      "Включите MCP под полем ввода — модель вызывает инструменты Kono напрямую.",
    bullets: [
      "Создание и удаление задач, изменение статусов",
      "Декомпозиция на подзадачи и отметка выполненных",
      "Комментарии в ленте задачи",
      "Поиск по workspace без ручного переключения",
      "Интерфейс обновляется после действий ассистента",
    ],
  },
  {
    icon: McpLogo,
    iconClassName: "size-6",
    title: "Вызов инструментов",
    description:
      "MCP в приложении работает через вызов функций (tools) вашей LLM.",
    bullets: [
      "12 инструментов: проекты, задачи, подзадачи, комментарии, поиск",
      "Нужна модель с поддержкой tools",
      "Ключ провайдера — в разделе API ключи",
      "Внешний MCP-сервер — отдельный stdio-процесс",
    ],
  },
  {
    icon: Plug2,
    iconClassName: "size-7",
    title: "Внешний MCP-сервер",
    description:
      "Локальный stdio-сервер Kono для любого MCP-хоста с вашим JWT.",
    bullets: [
      "POST /auth/login — email и password, в ответе поле token",
      "Токен кладётся в KONO_API_KEY в backend/.env",
      "npm run mcp в папке backend",
      "Подключение через конфиг MCP-клиента (Cursor, Claude Desktop и др.)",
    ],
  },
] as const;

function CheckBullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
      <Check
        className="mt-1 size-3.5 shrink-0 text-muted-foreground/70"
        aria-hidden
      />
      <span>{children}</span>
    </li>
  );
}

function GrokLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
}) {
  const className =
    "relative inline-flex shrink-0 items-center justify-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
        <ArrowUpRight className="size-3.5" aria-hidden />
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {children}
      <ChevronRight className="size-3.5" aria-hidden />
    </Link>
  );
}

export function McpSettingsLandingView() {
  const { apiUrl, installTabs } = useMcpInstallTabs();

  const toolsByCategory = TOOL_CATEGORY_ORDER.map((category) => ({
    category,
    label: MCP_TOOL_CATEGORIES[category],
    tools: MCP_TOOLS.filter((tool) => tool.category === category),
  }));

  return (
    <div className="pb-8">
      <div className="relative pb-12 pt-4 sm:pb-16 sm:pt-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-1.5">
            <McpLogo className="size-5 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">Kono MCP</p>
          </div>

          <h1 className="mt-4 text-balance text-3xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Управляйте Kono
            <br />
            <span className="text-muted-foreground">через MCP tools.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            Проекты, задачи, подзадачи, комментарии и поиск — из чата Kono AI
            или через внешний MCP-сервер. Нужна LLM с поддержкой вызова функций.
          </p>

          <div className="mx-auto mt-8 w-full max-w-xl">
            <McpInstallBlock
              tabs={installTabs}
              hint="Вкладка JWT — запрос токена. Поле token → KONO_API_KEY"
            />
          </div>

          <div className="mt-3 flex flex-wrap justify-center gap-1">
            <GrokLink href={SESSION_PATHS.llmKeys}>API ключи</GrokLink>
            <GrokLink href="https://modelcontextprotocol.io" external>
              Документация MCP
            </GrokLink>
          </div>
        </div>
      </div>

      <section className="border-t border-border py-12 sm:py-16">
        <div className="mx-auto max-w-2xl space-y-16">
          {MCP_FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="space-y-4">
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "shrink-0 text-foreground",
                      feature.iconClassName,
                    )}
                    aria-hidden
                  />
                  <h2 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                    {feature.title}
                  </h2>
                </div>
                <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.bullets.map((bullet) => (
                    <CheckBullet key={bullet}>{bullet}</CheckBullet>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border py-12 sm:py-16">
        <div className="mb-10 max-w-lg">
          <h2 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Где взять LLM с инструментами
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Подключите ключ провайдера в{" "}
            <Link
              to={SESSION_PATHS.llmKeys}
              className="text-foreground underline-offset-2 hover:underline"
            >
              API ключах
            </Link>
            . MCP в чате использует вызов функций модели.
          </p>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {MCP_LLM_SOURCES.map((source) => (
            <li key={source.id}>
              <a
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full items-center gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3 transition-colors hover:border-border hover:bg-muted/35"
              >
                <LlmProviderIcon source={source} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-foreground">
                    {source.title}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                    {source.description}
                  </span>
                </span>
                <ExternalLink className="size-3.5 shrink-0 text-muted-foreground opacity-60 transition-opacity group-hover:opacity-100" />
              </a>
            </li>
          ))}
          <li>
            <Link
              to={SESSION_PATHS.llmKeys}
              className="group flex h-full items-center gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3 transition-colors hover:border-border hover:bg-muted/35"
            >
              <span
                className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg p-1"
                style={{ backgroundColor: "#171717" }}
                aria-hidden
              >
                <img
                  src="/kono-icon.svg"
                  alt=""
                  width={32}
                  height={32}
                  className="size-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-foreground">
                  API ключи Kono
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                  Сохранить и активировать ключ провайдера
                </span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          </li>
        </ul>
      </section>

      <section className="border-t border-border py-12 sm:py-16">
        <div className="mb-10 max-w-lg">
          <h2 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Доступные инструменты
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {MCP_TOOLS.length} tools для Kono AI и внешнего MCP-сервера.
          </p>
        </div>

        <div className="space-y-10">
          {toolsByCategory.map(({ category, label, tools }) => (
            <div key={category}>
              <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                {label}
              </h3>
              <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <div key={tool.name} className="flex items-start gap-3">
                      {Icon ? (
                        <Icon
                          className="mt-0.5 size-[18px] shrink-0 text-muted-foreground/50"
                          aria-hidden
                        />
                      ) : null}
                      <div>
                        <p className="font-mono text-sm font-medium text-foreground/80">
                          {tool.name}
                          {tool.destructive ? (
                            <span className="ml-1.5 font-sans text-[10px] font-normal text-rose-600 dark:text-rose-400">
                              destructive
                            </span>
                          ) : null}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border py-12 sm:py-16">
        <div className="rounded-2xl bg-muted/40 px-6 py-8 ring-1 ring-border/30 sm:px-10 sm:py-12">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-lg">
              <h2 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                Подключите внешний MCP
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Заполните .env, запустите сервер и добавьте конфиг в MCP-клиент.
                API:{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  {apiUrl}
                </code>
              </p>
            </div>
            <div className="w-full min-w-0 lg:max-w-md lg:shrink-0">
              <McpInstallBlock tabs={installTabs} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-12 sm:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-2xl font-medium tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            MCP в Kono AI
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
            «Создай задачу», «разбей на подзадачи», «отметь выполненной»,
            «удали задачу», «оставь комментарий» — бот сделает сам через MCP.
          </p>
          <div className="mx-auto mt-8 w-full max-w-lg">
            <McpInstallBlock tabs={installTabs} />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <GrokLink href={SESSION_PATHS.llmKeys}>API ключи</GrokLink>
            <Button
              variant="default"
              className="h-auto gap-1 rounded-full px-4 py-2 text-primary-foreground hover:brightness-90 hover:text-primary-foreground"
              asChild
            >
              <Link to={SESSION_PATHS.sessionRoot} className="no-underline">
                Открыть проекты
                <ChevronRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}