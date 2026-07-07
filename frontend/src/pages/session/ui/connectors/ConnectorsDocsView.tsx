import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

import { SESSION_PATHS } from "@/pages/session/model/sessionPaths";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

import { DocsTocAside } from "../settings/mcp/DocsTocAside";
import { McpDocsCodeBlock } from "../settings/mcp/McpDocsCodeBlock";

const TOC = [
  { id: "overview", label: "Как это работает", depth: 0 },
  { id: "telegram-local", label: "Telegram локально", depth: 0 },
  { id: "botfather", label: "BotFather", depth: 1 },
  { id: "chat-id", label: "chat_id", depth: 1 },
  { id: "env", label: "backend/.env", depth: 1 },
  { id: "ui-toggle", label: "Включить в UI", depth: 0 },
  { id: "api", label: "API коннекторов", depth: 0 },
  { id: "debug", label: "Проверка и ошибки", depth: 0 },
] as const;

const PROSE =
  "mx-auto w-full max-w-2xl px-1 text-pretty leading-6 sm:px-2 [&_hr]:my-10 [&_hr]:border-border [&_p]:mb-4 [&_p]:max-w-2xl [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_p_a]:text-foreground [&_p_a]:underline [&_p_a]:underline-offset-2 [&_strong]:font-medium [&_strong]:text-foreground [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ul]:text-sm [&_ul]:text-muted-foreground [&_ul:not(.not-prose)_a]:text-foreground [&_ul:not(.not-prose)_a]:underline [&_ul:not(.not-prose)_a]:underline-offset-2";

const TELEGRAM_ENV = `# backend/.env
TELEGRAM_BOT_TOKEN=<token из BotFather>
TELEGRAM_CHAT_ID=<fallback chat_id для TELEGRAM_DEFAULT_CHAT_EMAIL>
TELEGRAM_DEFAULT_CHAT_EMAIL=litvin4chuk@mail.ru

# опционально, если Node не ходит в api.telegram.org напрямую
TELEGRAM_PROXY=http://127.0.0.1:10809`;

const GET_ME = `Invoke-RestMethod "https://api.telegram.org/bot<TOKEN>/getMe"`;

const GET_UPDATES = `Invoke-RestMethod "https://api.telegram.org/bot<TOKEN>/getUpdates"`;

const SEND_MESSAGE = `$token = "<TOKEN>"
$chatId = "<CHAT_ID>"

Invoke-RestMethod -Method Post \`
  -Uri "https://api.telegram.org/bot$token/sendMessage" \`
  -ContentType "application/json" \`
  -Body (@{
    chat_id = $chatId
    text = "Привет из Kono"
  } | ConvertTo-Json)`;

const PATCH_CONNECTOR = `PATCH /api/connectors/telegram
Content-Type: application/json
Authorization: Bearer <JWT>

{
  "enabled": true,
  "telegramChatId": "123456789"
}`;

const DELETE_CONNECTOR = `DELETE /api/connectors/telegram
Authorization: Bearer <JWT>`;

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

export function ConnectorsDocsView() {
  return (
    <div className="flex min-w-0 gap-8 pb-12">
      <div className="min-w-0 flex-1 pt-2 sm:pt-4">
        <main className={cn(PROSE)}>
          <div className="not-prose">
            <h4 className="pb-1 text-xs font-medium text-muted-foreground">
              Интеграции
            </h4>
            <h1
              id="connectors-docs"
              className="scroll-mt-24 text-3xl font-medium tracking-tight text-foreground"
            >
              Документация коннекторов
            </h1>

            <div className="mb-5 mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                className="h-auto shrink-0 gap-1 rounded-full px-4 py-2 shadow-sm"
                asChild
              >
                <Link to={SESSION_PATHS.connectors}>Каталог коннекторов</Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-auto shrink-0 gap-1 rounded-full px-4 py-2"
                asChild
              >
                <a
                  href="https://core.telegram.org/bots/api/"
                  target="_blank"
                  rel="noreferrer"
                  className="no-underline"
                >
                  Telegram Bot API
                  <ExternalLink className="size-4" aria-hidden />
                </a>
              </Button>
            </div>
          </div>

          <p id="overview">
            Коннекторы подключают внешние сервисы к событиям Kono. Сейчас
            реализован простой локальный Telegram-коннектор: при создании задачи
            backend отправляет сообщение в личный чат бота, если коннектор
            включён у пользователя.
          </p>

          <p>
            Состояние хранится в таблице{" "}
            <DocsInlineCode>user_connectors</DocsInlineCode>: пользователь,
            ID коннектора, флаг <DocsInlineCode>enabled</DocsInlineCode> и
            личный <DocsInlineCode>telegram_chat_id</DocsInlineCode>.
            Серверная готовность проверяется по{" "}
            <DocsInlineCode>TELEGRAM_BOT_TOKEN</DocsInlineCode>.
          </p>

          <hr />

          <DocsHeading id="telegram-local" level={2}>
            Telegram локально
          </DocsHeading>

          <DocsHeading id="botfather" level={3}>
            BotFather
          </DocsHeading>

          <ul>
            <li>
              Откройте <strong>@BotFather</strong> в Telegram.
            </li>
            <li>
              Создайте бота через <DocsInlineCode>/newbot</DocsInlineCode>.
            </li>
            <li>
              Скопируйте токен в{" "}
              <DocsInlineCode>TELEGRAM_BOT_TOKEN</DocsInlineCode>.
            </li>
            <li>
              Напишите своему боту <DocsInlineCode>/start</DocsInlineCode>.
            </li>
          </ul>

          <p>Проверка токена:</p>

          <McpDocsCodeBlock label="powershell" code={GET_ME} />

          <DocsHeading id="chat-id" level={3}>
            chat_id
          </DocsHeading>

          <p>
            После <DocsInlineCode>/start</DocsInlineCode> запросите updates и
            найдите <DocsInlineCode>message.chat.id</DocsInlineCode>. В личном
            чате он обычно совпадает с <DocsInlineCode>from.id</DocsInlineCode>.
          </p>

          <McpDocsCodeBlock label="powershell" code={GET_UPDATES} />

          <p>Проверка отправки сообщения без Kono:</p>

          <McpDocsCodeBlock label="powershell" code={SEND_MESSAGE} />

          <DocsHeading id="env" level={3}>
            backend/.env
          </DocsHeading>

          <p>
            На сервере нужен только токен бота. Chat ID каждый пользователь
            указывает в UI при подключении Telegram. Для email из{" "}
            <DocsInlineCode>TELEGRAM_DEFAULT_CHAT_EMAIL</DocsInlineCode> можно
            использовать <DocsInlineCode>TELEGRAM_CHAT_ID</DocsInlineCode> из
            env как fallback.
          </p>

          <McpDocsCodeBlock label="env" code={TELEGRAM_ENV} />

          <p>
            Если PowerShell достаёт Telegram API, а Node получает timeout,
            используйте <DocsInlineCode>TELEGRAM_PROXY</DocsInlineCode>. После
            изменения env перезапустите backend.
          </p>

          <hr />

          <DocsHeading id="ui-toggle" level={2}>
            Включить в UI
          </DocsHeading>

          <ul>
            <li>
              Откройте <DocsInlineCode>/projects/connectors</DocsInlineCode>.
            </li>
            <li>
              В карточке Telegram нажмите <strong>Подключить</strong> и укажите
              свой <DocsInlineCode>chat_id</DocsInlineCode>.
            </li>
            <li>
              После подключения карточка переедет в блок{" "}
              <strong>Подключённые</strong>.
            </li>
            <li>
              Switch на карточке включает или выключает Telegram-уведомления,
              но не удаляет подключение.
            </li>
            <li>
              Меню <strong>⋮ → Удалить</strong> полностью удаляет подключение;
              после этого Telegram можно подключить заново.
            </li>
          </ul>

          <p>
            Уведомление отправляется после создания задачи через{" "}
            <DocsInlineCode>notifyTelegramForUser</DocsInlineCode>. Если
            коннектор выключен, задача создаётся как обычно, но сообщение в
            Telegram не отправляется.
          </p>

          <hr />

          <DocsHeading id="api" level={2}>
            API коннекторов
          </DocsHeading>

          <p>
            API находится под авторизацией JWT и использует текущего
            пользователя из сессии.
          </p>

          <ul>
            <li>
              <DocsInlineCode>GET /api/connectors</DocsInlineCode> — список
              коннекторов: <DocsInlineCode>installed</DocsInlineCode>,{" "}
              <DocsInlineCode>enabled</DocsInlineCode>,{" "}
              <DocsInlineCode>configured</DocsInlineCode> и{" "}
              <DocsInlineCode>telegramChatId</DocsInlineCode>.
            </li>
            <li>
              <DocsInlineCode>PATCH /api/connectors/telegram</DocsInlineCode>{" "}
              — включить или выключить уведомления Telegram.
            </li>
            <li>
              <DocsInlineCode>DELETE /api/connectors/telegram</DocsInlineCode>{" "}
              — удалить подключение Telegram.
            </li>
          </ul>

          <McpDocsCodeBlock label="http" code={PATCH_CONNECTOR} />
          <McpDocsCodeBlock label="http" code={DELETE_CONNECTOR} />

          <p>
            <DocsInlineCode>configured: false</DocsInlineCode> означает, что в
            backend env нет <DocsInlineCode>TELEGRAM_BOT_TOKEN</DocsInlineCode>.
            В этом случае UI покажет «Не настроен», а API не даст включить
            коннектор.
          </p>

          <hr />

          <DocsHeading id="debug" level={2}>
            Проверка и ошибки
          </DocsHeading>

          <ul>
            <li>
              <strong>Сообщение не пришло:</strong> проверьте, что Telegram
              включён в блоке «Подключённые».
            </li>
            <li>
              <strong>Timeout api.telegram.org:</strong> проверьте VPN или
              <DocsInlineCode>TELEGRAM_PROXY</DocsInlineCode>.
            </li>
            <li>
              <strong>result: [] в getUpdates:</strong> сначала отправьте боту{" "}
              <DocsInlineCode>/start</DocsInlineCode>.
            </li>
            <li>
              <strong>connector_not_configured:</strong> заполните{" "}
              <DocsInlineCode>TELEGRAM_BOT_TOKEN</DocsInlineCode> и укажите
              Chat ID в UI, затем перезапустите backend.
            </li>
          </ul>
        </main>
      </div>

      <DocsTocAside items={TOC} />
    </div>
  );
}
