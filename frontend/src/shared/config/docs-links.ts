import { SESSION_PATHS } from "@/pages/session/model/sessionPaths";
import { env } from "@/shared/config/env";

export type HomeDocsLink = {
  id: string;
  label: string;
  description: string;
  href: string;
  external?: boolean;
};

export function getSwaggerDocsUrl(): string {
  const apiUrl = env.apiUrl || "http://localhost:3000/api";

  try {
    const url = new URL(apiUrl);
    url.pathname = "/docs";
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return "http://localhost:3000/docs";
  }
}

export const HOME_DOCS_LINKS: HomeDocsLink[] = [
  {
    id: "api",
    label: "REST API",
    description: "Swagger — эндпоинты, схемы, примеры",
    href: getSwaggerDocsUrl(),
    external: true,
  },
  {
    id: "mcp",
    label: "MCP",
    description: "Инструменты, JWT и внешний сервер",
    href: `${SESSION_PATHS.mcp}?view=docs`,
  },
  {
    id: "connectors",
    label: "Коннекторы",
    description: "Интеграции и подключения",
    href: SESSION_PATHS.connectors,
  },
  {
    id: "llm-keys",
    label: "API ключи LLM",
    description: "Провайдеры, env и Kono AI",
    href: `${SESSION_PATHS.llmKeys}?view=docs`,
  },
];