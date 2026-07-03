import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { HomeIntegrationCard } from "@/pages/home/ui/components/HomeIntegrationCard";
import { HomeInlineCode } from "@/pages/home/ui/components/HomeInlineCode";
import { LlmProviderIcon } from "@/pages/session/ui/settings/LlmProviderIcon";
import { SESSION_PATHS } from "@/pages/session/model/sessionPaths";
import { MCP_SUPPORTED_CLIENTS } from "@/shared/config/mcp-clients";
import { MCP_LLM_SOURCES } from "@/shared/config/mcp-llm-sources";
import {
  MCP_TOOL_CATEGORIES,
  MCP_TOOLS,
  type McpToolCategory,
} from "@/shared/config/mcp-tools";
import { SECTION_ID } from "@/shared/config/sectionIds";
import { Button } from "@/shared/ui/button";
import { McpLogo } from "@/shared/ui/icons/McpLogo";

const MCP_CATEGORY_ORDER: McpToolCategory[] = [
  "projects",
  "tasks",
  "subtasks",
  "search",
  "activity",
];

function groupToolsByCategory() {
  return MCP_CATEGORY_ORDER.map((category) => ({
    category,
    label: MCP_TOOL_CATEGORIES[category],
    tools: MCP_TOOLS.filter((tool) => tool.category === category),
  }));
}

export default function McpHomeSection() {
  const toolGroups = groupToolsByCategory();

  return (
    <section
      id={SECTION_ID.MCP}
      className="scroll-mt-20 border-t border-white/8 bg-black py-20 sm:py-28"
    >
      <div className="mx-auto w-full px-4 lg:px-6 xl:max-w-7xl">
        <div className="max-w-3xl" data-aos="fade-up">
          <div className="flex items-center gap-2">
            <McpLogo className="size-4 text-white" aria-hidden />
            <p className="text-sm font-medium text-white/40">MCP</p>
          </div>
          <h2 className="mt-4 text-pretty text-3xl font-medium tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
            Kono для AI-клиентов
          </h2>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/45 sm:text-lg">
            Model Context Protocol подключает проекты, задачи и поиск к
            AI-агентам — без ручного копирования в промпт.
          </p>
        </div>

        <div
          className="mt-12 rounded-2xl border border-white/8 bg-[rgb(10,10,10)] p-5 sm:p-6 lg:mt-16"
          data-aos="fade-up"
          data-aos-delay="80"
        >
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-base font-medium text-white/88">
                  Поддерживаемые агенты
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/38">
                  MCP-клиенты — в чате Kono AI или через внешний stdio-сервер с
                  JWT.
                </p>
                <ul className="mt-4 space-y-2">
                  {MCP_SUPPORTED_CLIENTS.map((client) => (
                    <li key={client.id}>
                      <HomeIntegrationCard
                        title={client.title}
                        description={client.description}
                        href={client.href}
                        external={client.external}
                        icon={<LlmProviderIcon source={client} />}
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-white/8 pt-8 lg:border-t-0 lg:pt-0">
                <h3 className="text-base font-medium text-white/88">
                  Провайдеры LLM
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/38">
                  Модели с вызовом функций. Ключ — в{" "}
                  <Link
                    to={SESSION_PATHS.llmKeys}
                    className="text-white/55 underline-offset-2 hover:text-white/75 hover:underline"
                  >
                    API ключах
                  </Link>
                  .
                </p>
                <ul className="mt-4 space-y-2">
                  {MCP_LLM_SOURCES.map((source) => (
                    <li key={source.id}>
                      <HomeIntegrationCard
                        title={source.title}
                        description={source.description}
                        href={source.href}
                        external
                        icon={<LlmProviderIcon source={source} />}
                      />
                    </li>
                  ))}
                  <li>
                    <HomeIntegrationCard
                      title="API ключи Kono"
                      description="Сохранить и активировать ключ провайдера"
                      href={SESSION_PATHS.llmKeys}
                      icon={
                        <LlmProviderIcon
                          source={{
                            title: "API ключи Kono",
                            logo: "/kono-icon.svg",
                            brandColor: "#171717",
                            logoOnBrand: false,
                          }}
                        />
                      }
                    />
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/8 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0 xl:pl-12">
              <h3 className="text-base font-medium text-white/88">
                Инструменты MCP
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/38">
                {MCP_TOOLS.length} встроенных{" "}
                <HomeInlineCode>tools</HomeInlineCode> — один набор для чата и
                внешнего сервера.
              </p>

              <div className="mt-4 space-y-5">
                {toolGroups.map((group) => (
                  <div key={group.category}>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-white/34">
                      {group.label}
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {group.tools.map((tool) => (
                        <li
                          key={tool.name}
                          className="text-sm leading-relaxed text-white/42"
                        >
                          <HomeInlineCode>{tool.name}</HomeInlineCode>
                          {" — "}
                          {tool.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-5 lg:mt-10">
            <p className="text-sm text-white/38">
              JWT и внешний сервер · документация по настройке
            </p>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 rounded-full border-white/15 bg-transparent px-4 text-white/80 shadow-none hover:bg-white/[0.05] hover:text-white"
            >
              <Link to={`${SESSION_PATHS.mcp}?view=docs`}>
                Документация MCP
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
