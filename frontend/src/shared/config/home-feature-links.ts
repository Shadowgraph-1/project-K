import type { LucideIcon } from "lucide-react";
import { Key, PlugZap } from "lucide-react";

import { SESSION_PATHS } from "@/pages/session/model/sessionPaths";

export type HomeFeatureLinkIcon =
  | { type: "mcp" }
  | { type: "lucide"; icon: LucideIcon }
  | { type: "image"; src: string; alt: string };

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
    href: SESSION_PATHS.mcp,
    image: "/features-home/fea-1.jpg",
    icon: { type: "mcp" },
  },
  {
    id: "connectors",
    path: "/connectors",
    title: "Коннекторы",
    description:
      "Telegram, Slack, Notion и другие сервисы — уведомления рядом с задачами.",
    href: SESSION_PATHS.connectors,
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
    icon: { type: "image", src: "/kono-icon.svg", alt: "" },
  },
  {
    id: "api",
    path: "/API",
    title: "API ключи",
    description:
      "OpenRouter, Groq, LM Studio и другие LLM с вызовом функций в одном месте.",
    href: SESSION_PATHS.llmKeys,
    image: "/features-home/fea-4.jpg",
    icon: { type: "lucide", icon: Key },
  },
] as const;