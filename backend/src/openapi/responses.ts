

const taskStatusEnum = {
  type: "string",
  enum: ["TODO", "DONE", "DEFERRED", "ISSUES"],
  description:
    "Статус задачи: TODO — в очереди, DONE — готово, DEFERRED — отложено, ISSUES — проблемы",
} as const;

const subtaskStatusEnum = {
  type: "string",
  enum: ["IN_PROGRESS", "DONE", "DEFERRED", "CANCELLED"],
  description:
    "Статус подзадачи: IN_PROGRESS — в процессе, DONE — выполнено, DEFERRED — отложено, CANCELLED — отменено",
} as const;

const taskPriorityEnum = {
  type: "string",
  enum: ["Срочный", "Высокий", "Средний", "Низкий"],
  description: "Приоритет задачи (хранится в поле tags)",
} as const;

const workspaceRoleEnum = {
  type: "string",
  enum: ["OWNER", "ADMIN", "EDITOR", "COMMENTER", "VIEWER"],
  description: "Роль участника в проекте",
} as const;

const healthCheckItem = {
  type: "object",
  properties: {
    status: {
      type: "string",
      enum: ["ok", "down"],
      description: "ok — сервис доступен, down — недоступен",
    },
    latencyMs: { type: "number", description: "Задержка проверки, мс" },
    message: { type: "string", description: "Дополнительное сообщение об ошибке" },
  },
} as const;

export const userDto = {
  type: "object",
  description: "Пользователь",
  properties: {
    id: { type: "integer", description: "Числовой ID пользователя" },
    name: { type: "string", description: "Отображаемое имя" },
    email: { type: "string", format: "email", description: "E-mail для входа" },
  },
  required: ["id", "name", "email"],
} as const;

export const authTokenResponse = {
  type: "object",
  description: "Успешная авторизация",
  properties: {
    token: {
      type: "string",
      description: "JWT. Передавайте в заголовке Authorization: Bearer <token>",
    },
    user: userDto,
  },
  required: ["token", "user"],
} as const;

export const workspaceDto = {
  type: "object",
  description: "Проект (workspace)",
  properties: {
    id: { type: "string", format: "uuid", description: "UUID проекта" },
    publicKey: {
      type: "string",
      description: "Публичный ключ для URL, например K-ABC123",
    },
    name: { type: "string", description: "Название проекта" },
    myRole: workspaceRoleEnum,
    kind: {
      type: "string",
      enum: ["owned", "shared"],
      description: "owned — вы владелец, shared — участник",
    },
  },
} as const;

export const taskDto = {
  type: "object",
  description: "Задача",
  properties: {
    id: { type: "string", format: "uuid", description: "UUID задачи" },
    title: { type: "string", description: "Заголовок" },
    description: { type: "string", description: "Описание" },
    tags: {
      oneOf: [taskPriorityEnum, { type: "null" }],
      description: "Приоритет или null",
    },
    startDate: {
      type: "string",
      format: "date-time",
      nullable: true,
      description: "Дата начала (ISO 8601)",
    },
    dueDate: {
      type: "string",
      format: "date-time",
      nullable: true,
      description: "Дедлайн (ISO 8601)",
    },
    creator: { type: "string", nullable: true, description: "Автор / исполнитель" },
    status: taskStatusEnum,
    workspaceId: {
      type: "string",
      format: "uuid",
      description: "UUID проекта",
    },
    createdAt: {
      type: "string",
      format: "date-time",
      description: "Дата создания (ISO 8601)",
    },
  },
} as const;

export const subtaskDto = {
  type: "object",
  description: "Подзадача",
  properties: {
    id: { type: "string", format: "uuid" },
    taskId: { type: "string", format: "uuid", description: "Родительская задача" },
    userId: { type: "integer", nullable: true, description: "ID назначенного пользователя" },
    title: { type: "string" },
    status: subtaskStatusEnum,
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
} as const;

export const activityDto = {
  type: "object",
  description: "Запись activity или комментарий",
  properties: {
    id: { type: "string", format: "uuid" },
    taskId: { type: "string", format: "uuid" },
    userId: { type: "integer", nullable: true },
    authorName: { type: "string", nullable: true, description: "Имя автора" },
    type: {
      type: "string",
      description: "Тип записи, например comment, status_change",
    },
    title: { type: "string", description: "Заголовок события" },
    body: { type: "string", nullable: true, description: "Текст комментария" },
    metadata: {
      type: "object",
      nullable: true,
      description: "Доп. данные; parentActivityId — для ответов в ветке",
      additionalProperties: true,
    },
    createdAt: { type: "string", format: "date-time" },
  },
} as const;

export const llmKeyDto = {
  type: "object",
  description: "LLM-ключ пользователя (сам ключ не возвращается, только маска)",
  properties: {
    id: { type: "string", format: "uuid" },
    label: { type: "string", nullable: true, description: "Подпись ключа" },
    hint: { type: "string", description: "Маскированный хвост ключа" },
    isActive: { type: "boolean", description: "Используется для AI-чата" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    createdByName: { type: "string" },
  },
} as const;

export const healthResponse = {
  type: "object",
  description: "Состояние сервисов",
  properties: {
    status: {
      type: "string",
      enum: ["healthy", "degraded", "unhealthy"],
      description: "healthy — всё ok, degraded — частичный сбой, unhealthy — критично",
    },
    timestamp: { type: "string", format: "date-time" },
    version: { type: "string", description: "Версия API из env.VERSION" },
    checks: {
      type: "object",
      properties: {
        api: healthCheckItem,
        database: healthCheckItem,
        ai: healthCheckItem,
      },
    },
  },
} as const;

export const aiChatResponse = {
  type: "object",
  description: "Ответ AI-компаньона",
  properties: {
    reply: { type: "string", description: "Текст ответа модели" },
  },
  required: ["reply"],
} as const;

export const adminAccessResponse = {
  type: "object",
  description: "Проверка прав администратора",
  properties: {
    isAdmin: {
      type: "boolean",
      description: "true — пользователь в списке ADMIN_EMAILS / ADMIN_USER_IDS",
    },
  },
  required: ["isAdmin"],
} as const;

export const adminOverviewResponse = {
  type: "object",
  description: "Сводка для админ-панели",
  properties: {
    stats: {
      type: "object",
      properties: {
        users: { type: "integer", description: "Всего пользователей" },
        workspaces: { type: "integer", description: "Всего проектов" },
        tasks: { type: "integer" },
        subtasks: { type: "integer" },
        llmKeys: { type: "integer", description: "Сохранённых LLM-ключей" },
        recentUsers: { type: "integer", description: "Новых за 7 дней" },
      },
    },
    health: healthResponse,
  },
} as const;

export const adminUsersResponse = {
  type: "object",
  properties: {
    total: { type: "integer", description: "Всего пользователей" },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          email: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          ownedWorkspaces: { type: "integer" },
          memberships: { type: "integer" },
        },
      },
    },
  },
} as const;

export const errorResponse = {
  type: "object",
  description: "Ошибка API",
  properties: {
    error: {
      type: "string",
      description: "Человекочитаемое сообщение об ошибке",
    },
    fields: {
      type: "object",
      additionalProperties: {
        type: "array",
        items: { type: "string" },
      },
      description: "Ошибки валидации по полям",
    },
  },
  required: ["error"],
} as const;

export const okMessageResponse = {
  type: "object",
  description: "Успешная операция с сообщением",
  properties: {
    ok: { type: "boolean" },
    message: { type: "string" },
  },
} as const;

export const jsonObject = {
  type: "object",
  additionalProperties: true,
} as const;

export const jsonArray = {
  type: "array",
  items: jsonObject,
} as const;

export const workspaceListResponse = {
  type: "array",
  description: "Список проектов текущего пользователя",
  items: workspaceDto,
} as const;

export const taskListResponse = {
  type: "array",
  description: "Список задач проекта",
  items: taskDto,
} as const;

export const subtaskListResponse = {
  type: "array",
  items: subtaskDto,
} as const;

export const activityListResponse = {
  type: "array",
  description: "Лента activity задачи (от старых к новым или наоборот — см. сервис)",
  items: activityDto,
} as const;

export const taskStatusHistoryDto = {
  type: "object",
  description: "Запись истории смены статуса задачи",
  properties: {
    id: { type: "string", format: "uuid" },
    taskId: { type: "string", format: "uuid" },
    fromStatus: {
      ...taskStatusEnum,
      nullable: true,
      description: "Предыдущий статус; null — первое событие (создание)",
    },
    toStatus: taskStatusEnum,
    userId: { type: "integer", nullable: true },
    userName: { type: "string", nullable: true },
    changedAt: {
      type: "string",
      format: "date-time",
      description: "Когда статус изменился",
    },
  },
  required: ["id", "taskId", "toStatus", "changedAt"],
} as const;

export const taskStatusHistoryListResponse = {
  type: "array",
  description: "История статусов задачи, от старых к новым",
  items: taskStatusHistoryDto,
} as const;

export const llmKeysResponse = {
  type: "object",
  description: "Список LLM-ключей пользователя",
  properties: {
    useDefault: {
      type: "boolean",
      description: "true — используется системный LLM из env",
    },
    keys: {
      type: "array",
      items: llmKeyDto,
    },
  },
  required: ["useDefault", "keys"],
} as const;

export const workspaceMemberDto = {
  type: "object",
  properties: {
    userId: { type: "integer" },
    name: { type: "string" },
    isOwner: { type: "boolean" },
    role: workspaceRoleEnum,
  },
  required: ["userId", "name", "isOwner", "role"],
} as const;

export const pendingInviteDto = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    userId: { type: "integer" },
    name: { type: "string" },
    role: workspaceRoleEnum,
  },
  required: ["id", "userId", "name", "role"],
} as const;

export const workspaceMembersResponse = {
  type: "object",
  description: "Участники проекта и ожидающие приглашения",
  properties: {
    members: {
      type: "array",
      items: workspaceMemberDto,
    },
    pendingInvites: {
      type: "array",
      items: pendingInviteDto,
    },
  },
  required: ["members", "pendingInvites"],
} as const;

export const userSearchPageResponse = {
  type: "object",
  description: "Страница результатов поиска пользователей для приглашения",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
        },
        required: ["id", "name"],
      },
    },
    nextOffset: {
      type: "integer",
      nullable: true,
      description: "Смещение следующей страницы или null",
    },
  },
  required: ["items", "nextOffset"],
} as const;

export const incomingInvitesResponse = {
  type: "array",
  description: "Входящие приглашения в проекты",
  items: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      workspaceId: { type: "string", format: "uuid" },
      workspaceName: { type: "string" },
      inviterName: { type: "string" },
      createdAt: { type: "string", format: "date-time" },
    },
    required: [
      "id",
      "workspaceId",
      "workspaceName",
      "inviterName",
      "createdAt",
    ],
  },
} as const;

export const noContentResponse = {
  type: "null",
  description: "Успех, тело ответа пустое",
} as const;
