export type ConnectorStatus = "connected" | "reauth";

export type ConnectorDefinition = {
  id: string;
  name: string;
  description?: string;
  /** SVG в `frontend/public/connectors/` (Simple Icons) */
  logo: string;
  /** Фон плашки под логотип */
  brandColor: string;
  /** Белая иконка на цветном фоне (по умолчанию true) */
  logoOnBrand?: boolean;
  /** Доступен для подключения (остальные — скоро) */
  available?: boolean;
  status?: ConnectorStatus;
};

const CONNECTOR_LOGOS = {
  telegram: "/connectors/telegram.svg",
  slack: "/connectors/slack.svg",
  googleCalendar: "/connectors/googlecalendar.svg",
  notion: "/connectors/notion.svg",
  github: "/connectors/github.svg",
  linear: "/connectors/linear.svg",
  discord: "/connectors/discord.svg",
  gmail: "/connectors/gmail.svg",
  googleDrive: "/connectors/googledrive.svg",
  vercel: "/connectors/vercel.svg",
} as const;

export const RECOMMENDED_CONNECTORS: ConnectorDefinition[] = [
  {
    id: "telegram",
    name: "Telegram",
    description: "Уведомления о задачах и инвайтах в личку бота",
    logo: CONNECTOR_LOGOS.telegram,
    brandColor: "#26A5E4",
    available: true,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Сообщения в канал команды",
    logo: CONNECTOR_LOGOS.slack,
    brandColor: "#4A154B",
    available: false,
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Синхронизация дедлайнов задач",
    logo: CONNECTOR_LOGOS.googleCalendar,
    brandColor: "#4285F4",
    available: false,
  },
  {
    id: "notion",
    name: "Notion",
    description: "Импорт заметок и страниц",
    logo: CONNECTOR_LOGOS.notion,
    brandColor: "#000000",
    available: false,
  },
  {
    id: "github",
    name: "GitHub",
    description: "Issues и pull request'ы рядом с задачами",
    logo: CONNECTOR_LOGOS.github,
    brandColor: "#181717",
    available: false,
  },
  {
    id: "linear",
    name: "Linear",
    description: "Двусторонняя синхронизация задач",
    logo: CONNECTOR_LOGOS.linear,
    brandColor: "#5E6AD2",
    available: false,
  },
];

export const MORE_RECOMMENDED_CONNECTORS: ConnectorDefinition[] = [
  {
    id: "discord",
    name: "Discord",
    description: "Webhook-уведомления в сервер",
    logo: CONNECTOR_LOGOS.discord,
    brandColor: "#5865F2",
    available: false,
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Письма по важным событиям проекта",
    logo: CONNECTOR_LOGOS.gmail,
    brandColor: "#EA4335",
    available: false,
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Вложения к задачам из облака",
    logo: CONNECTOR_LOGOS.googleDrive,
    brandColor: "#34A853",
    available: false,
  },
  {
    id: "vercel",
    name: "Vercel",
    description: "Деплои и preview-ссылки в activity",
    logo: CONNECTOR_LOGOS.vercel,
    brandColor: "#000000",
    available: false,
  },
];

export const CONNECTED_CONNECTORS: ConnectorDefinition[] = [];
