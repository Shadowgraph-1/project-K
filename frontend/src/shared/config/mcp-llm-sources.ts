export type McpLlmSource = {
  id: string;
  href: string;
  title: string;
  description: string;
  /** SVG или PNG в `frontend/public/llm-providers/` */
  logo: string;
  brandColor: string;
  /** Белая иконка на цветном фоне (как у коннекторов) */
  logoOnBrand?: boolean;
  external?: boolean;
};

const LLM_PROVIDER_LOGOS = {
  openrouter: "/llm-providers/openrouter.svg",
  lmstudio: "/llm-providers/lmstudio.svg",
  groq: "/llm-providers/groq.svg",
  together: "/llm-providers/together.png",
} as const;

export const MCP_LLM_SOURCES: McpLlmSource[] = [
  {
    id: "openrouter",
    href: "https://openrouter.ai/models?supported_parameters=tools",
    title: "OpenRouter",
    description: "Каталог моделей с tool calling — один ключ, много провайдеров",
    logo: LLM_PROVIDER_LOGOS.openrouter,
    brandColor: "#000000",
    logoOnBrand: true,
    external: true,
  },
  {
    id: "lmstudio",
    href: "https://lmstudio.ai",
    title: "LM Studio",
    description: "Локальный сервер, OpenAI-compatible API и function calling",
    logo: LLM_PROVIDER_LOGOS.lmstudio,
    brandColor: "#1C1C1C",
    logoOnBrand: true,
    external: true,
  },
  {
    id: "groq",
    href: "https://groq.com",
    title: "Groq",
    description: "Быстрый облачный API, модели с поддержкой tools",
    logo: LLM_PROVIDER_LOGOS.groq,
    brandColor: "#FFF5F2",
    logoOnBrand: false,
    external: true,
  },
  {
    id: "together",
    href: "https://www.together.ai",
    title: "Together AI",
    description: "Open-source модели через единый API с tools",
    logo: LLM_PROVIDER_LOGOS.together,
    brandColor: "#F4F4F5",
    logoOnBrand: false,
    external: true,
  },
];
