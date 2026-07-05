import type { LucideIcon } from "lucide-react";
import { KeyRound, PlugZap } from "lucide-react";

import { DOCS_PATHS } from "@/shared/config/docs-paths";
import { SESSION_PATHS } from "@/pages/session/model/sessionPaths";

export type HomeFeatureLinkIcon =
  | { type: "mcp" }
  | { type: "kono" }
  | { type: "lucide"; icon: LucideIcon };

export type HomeFeatureLink = {
  id: string;
  path: string;
  title: string;
  description: string;
  href: string;
  image: string;
  icon: HomeFeatureLinkIcon;
};

export const HOME_FEATURE_LINKS: readonly HomeFeatureLink[] = [
  {
    id: "mcp",
    path: "/MCP",
    title: "MCP",
    description:
      "Tools для проектов, задач и поиска — из агента или внешнего сервера с JWT.",
    href: DOCS_PATHS.mcp,
    image: "/features-home/fea-1.jpg",
    icon: { type: "mcp" },
  },
  {
    id: "connectors",
    path: "/connectors",
    title: "Коннекторы",
    description:
      "Telegram, Slack, Notion и другие сервисы — уведомления рядом с задачами.",
    href: DOCS_PATHS.connectors,
    image: "/features-home/fea-2.jpg",
    icon: { type: "lucide", icon: PlugZap },
  },
  {
    id: "kono-ai",
    path: "/KonoAI",
    title: "AI-компаньон",
    description:
      "Боковой чат рядом с задачами: вопросы по проекту, не уходя со страницы.",
    href: SESSION_PATHS.sessionRoot,
    image: "/features-home/fea-3.jpg",
    icon: { type: "kono" },
  },
  {
    id: "api",
    path: "/API",
    title: "API ключи",
    description:
      "OpenRouter, Groq, LM Studio и другие LLM с вызовом функций в одном месте.",
    href: DOCS_PATHS.apiKeys,
    image: "/features-home/fea-4.jpg",
    icon: { type: "lucide", icon: KeyRound },
  },
] as const;