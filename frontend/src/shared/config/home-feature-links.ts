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
  icon: HomeFeatureLinkIcon;
  accent: string;
};

export const HOME_FEATURE_LINKS: readonly HomeFeatureLink[] = [
  {
    id: "mcp",
    path: "/MCP",
    title: "MCP",
    description:
      "Tools для проектов, задач и поиска — из агента или внешнего сервера с JWT.",
    href: SESSION_PATHS.mcp,
    icon: { type: "mcp" },
    accent: "from-violet-500/12 via-indigo-500/6 to-transparent",
  },
  {
    id: "connectors",
    path: "/connectors",
    title: "Коннекторы",
    description:
      "Telegram, Slack, Notion и другие сервисы — уведомления рядом с задачами.",
    href: SESSION_PATHS.connectors,
    icon: { type: "lucide", icon: PlugZap },
    accent: "from-emerald-500/12 via-teal-500/6 to-transparent",
  },
  {
    id: "kono-ai",
    path: "/KonoAI",
    title: "AI-компаньон",
    description:
      "Боковой чат рядом с задачами: вопросы по проекту, не уходя со страницы.",
    href: SESSION_PATHS.sessionRoot,
    icon: { type: "image", src: "/kono-icon.svg", alt: "" },
    accent: "from-white/10 via-white/4 to-transparent",
  },
  {
    id: "api",
    path: "/API",
    title: "API ключи",
    description:
      "OpenRouter, Groq, LM Studio и другие LLM с вызовом функций в одном месте.",
    href: SESSION_PATHS.llmKeys,
    icon: { type: "lucide", icon: Key },
    accent: "from-amber-500/12 via-orange-500/6 to-transparent",
  },
] as const;