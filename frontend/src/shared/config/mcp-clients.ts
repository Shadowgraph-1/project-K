export type McpSupportedClient = {
  id: string;
  title: string;
  description: string;
  href: string;
  /** SVG в `frontend/public/mcp-clients/` или `/kono-icon.svg` */
  logo: string;
  brandColor: string;
  /** Белая иконка на цветном фоне (по умолчанию true) */
  logoOnBrand?: boolean;
  external: boolean;
};

const MCP_CLIENT_LOGOS = {
  cursor: "/mcp-clients/cursor.svg",
  anthropic: "/mcp-clients/anthropic.svg",
  windsurf: "/mcp-clients/windsurf.svg",
  kono: "/kono-icon.svg",
} as const;

/** MCP-хосты, с которыми совместим Kono MCP-сервер. */
export const MCP_SUPPORTED_CLIENTS: McpSupportedClient[] = [
  {
    id: "cursor",
    title: "Cursor",
    description: "IDE с MCP — подключите Kono через конфиг клиента",
    href: "https://cursor.com/docs/context/mcp",
    logo: MCP_CLIENT_LOGOS.cursor,
    brandColor: "#000000",
    logoOnBrand: false,
    external: true,
  },
  {
    id: "claude-desktop",
    title: "Claude Desktop",
    description: "Десктопный клиент Anthropic с поддержкой MCP",
    href: "https://modelcontextprotocol.io/quickstart/user",
    logo: MCP_CLIENT_LOGOS.anthropic,
    brandColor: "#CC785C",
    logoOnBrand: true,
    external: true,
  },
  {
    id: "windsurf",
    title: "Windsurf",
    description: "AI-IDE с MCP-серверами в настройках редактора",
    href: "https://docs.windsurf.com/windsurf/mcp",
    logo: MCP_CLIENT_LOGOS.windsurf,
    brandColor: "#0FB982",
    logoOnBrand: true,
    external: true,
  },
  {
    id: "kono",
    title: "Kono AI",
    description: "Встроенный агент — включите MCP под полем ввода в чате",
    href: "/projects/mcp",
    logo: MCP_CLIENT_LOGOS.kono,
    brandColor: "#171717",
    logoOnBrand: false,
    external: false,
  },
];
