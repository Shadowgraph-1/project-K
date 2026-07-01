import type { FastifyReply } from "fastify";

export type ApiErrorCode =
  // Auth & users
  | "email_taken"
  | "invalid_credentials"
  | "user_not_found"
  | "invalid_password"
  // Workspaces & tasks
  | "workspace_not_found"
  | "task_not_found"
  | "subtask_not_found"
  | "invalid_task_status"
  | "invalid_subtask_status"
  // Task activity
  | "activity_empty_body"
  | "activity_parent_not_found"
  // Workspace members
  | "target_is_owner"
  | "already_member"
  | "already_invited"
  | "owner_remove_forbidden"
  | "self_remove_forbidden"
  | "member_not_found"
  | "owner_role_forbidden"
  | "owner_leave_forbidden"
  | "invite_not_found"
  | "invite_already_processed"
  // Route validation
  | "missing_user_id"
  | "invalid_user_id"
  | "invalid_role"
  // Infrastructure
  | "validation_failed"
  | "unauthorized"
  | "forbidden"
  | "route_not_found"
  | "duplicate_record"
  | "record_not_found"
  | "ai_unavailable"
  | "internal_server_error";

export type ApiError = {
  error: ApiErrorCode;
};

export type ApiErrorBody = {
  error: string;
  fields?: Record<string, string[] | undefined>;
};

const API_ERROR_STATUS: Record<ApiErrorCode, number> = {
  email_taken: 409,
  invalid_credentials: 401,
  user_not_found: 404,
  invalid_password: 401,
  workspace_not_found: 404,
  task_not_found: 404,
  subtask_not_found: 404,
  invalid_task_status: 400,
  invalid_subtask_status: 400,
  activity_empty_body: 400,
  activity_parent_not_found: 404,
  target_is_owner: 400,
  already_member: 400,
  already_invited: 400,
  owner_remove_forbidden: 400,
  self_remove_forbidden: 400,
  member_not_found: 404,
  owner_role_forbidden: 400,
  owner_leave_forbidden: 400,
  invite_not_found: 404,
  invite_already_processed: 400,
  missing_user_id: 400,
  invalid_user_id: 400,
  invalid_role: 400,
  validation_failed: 400,
  unauthorized: 401,
  forbidden: 403,
  route_not_found: 404,
  duplicate_record: 409,
  record_not_found: 404,
  ai_unavailable: 503,
  internal_server_error: 500,
};

const API_ERROR_MESSAGE: Record<ApiErrorCode, string> = {
  email_taken: "Email уже занят",
  invalid_credentials: "Неверный email или пароль",
  user_not_found: "Пользователь не найден",
  invalid_password: "Неверный пароль",
  workspace_not_found: "Проект не найден",
  task_not_found: "Задача не найдена",
  subtask_not_found: "Подзадача не найдена",
  invalid_task_status: "Недопустимый статус",
  invalid_subtask_status: "Недопустимый статус",
  activity_empty_body: "Запись не может быть пустой",
  activity_parent_not_found: "Запись для ответа не найдена",
  target_is_owner: "Пользователь уже владелец проекта",
  already_member: "Пользователь уже в проекте",
  already_invited: "Приглашение уже отправлено",
  owner_remove_forbidden: "Нельзя удалить владельца",
  self_remove_forbidden: "Используйте выход из проекта",
  member_not_found: "Участник не найден",
  owner_role_forbidden: "Роль владельца нельзя изменить",
  owner_leave_forbidden: "Владелец не может покинуть проект",
  invite_not_found: "Приглашение не найдено",
  invite_already_processed: "Приглашение уже обработано",
  missing_user_id: "Укажите userId",
  invalid_user_id: "Некорректный userId",
  invalid_role: "Некорректная роль",
  validation_failed: "Некорректные данные",
  unauthorized: "Требуется авторизация",
  forbidden: "Доступ запрещён",
  route_not_found: "Маршрут не найден",
  duplicate_record: "Запись уже существует",
  record_not_found: "Не найдено",
  ai_unavailable:
    "AI-сервис недоступен. Проверь LM Studio и переменные окружения.",
  internal_server_error: "Внутренняя ошибка сервера",
};

export class ApiHttpError extends Error {
  readonly code: ApiErrorCode;

  constructor(code: ApiErrorCode) {
    super(API_ERROR_MESSAGE[code]);
    this.name = "ApiHttpError";
    this.code = code;
  }
}

export function apiErr(code: ApiErrorCode): ApiError {
  return { error: code };
}

export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof (value as ApiError).error === "string" &&
    (value as ApiError).error in API_ERROR_STATUS
  );
}

export function getApiErrorStatus(code: ApiErrorCode): number {
  return API_ERROR_STATUS[code];
}

export function getApiErrorMessage(code: ApiErrorCode): string {
  return API_ERROR_MESSAGE[code];
}

export function replyApiError(
  reply: FastifyReply,
  code: ApiErrorCode,
  extra?: Pick<ApiErrorBody, "fields">,
) {
  const body: ApiErrorBody = { error: getApiErrorMessage(code) };
  if (extra?.fields) {
    body.fields = extra.fields;
  }
  return reply.status(getApiErrorStatus(code)).send(body);
}

export function sendApiErrorResult<T>(
  reply: FastifyReply,
  result: T | ApiError,
): T | undefined {
  if (isApiError(result)) {
    replyApiError(reply, result.error);
    return undefined;
  }
  return result;
}
