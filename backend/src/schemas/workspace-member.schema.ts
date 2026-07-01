import { z } from "zod";
import { WorkspaceRole } from "../generated/prisma/client.js";

export const workspaceMembersParamSchema = z
  .object({
    id: z.string().min(1).describe("UUID проекта"),
  })
  .describe("Параметры URL: участники проекта");

export const workspaceMembersSearchQuerySchema = z
  .object({
    q: z.string().optional().default("").describe("Строка поиска по имени или email"),
    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .default(30)
      .describe("Лимит результатов (1–50)"),
    offset: z.coerce
      .number()
      .int()
      .min(0)
      .optional()
      .default(0)
      .describe("Смещение для пагинации"),
  })
  .describe("Поиск пользователей для приглашения");

export const workspaceInviteUserSchema = z
  .object({
    userId: z.number().int().positive().describe("Числовой ID приглашаемого пользователя"),
  })
  .describe("Приглашение в проект");

export const workspaceMemberParamSchema = z
  .object({
    workspaceId: z.string().min(1).describe("UUID проекта"),
    userId: z.coerce.number().int().positive().describe("ID участника"),
  })
  .describe("Параметры URL: участник проекта");

export const workspaceMemberRoleSchema = z
  .object({
    role: z
      .enum([
        WorkspaceRole.ADMIN,
        WorkspaceRole.EDITOR,
        WorkspaceRole.COMMENTER,
        WorkspaceRole.VIEWER,
      ])
      .describe("Новая роль (OWNER менять нельзя через этот метод)"),
  })
  .describe("Смена роли участника");

export const workspaceLeaveParamSchema = z
  .object({
    workspaceId: z.string().min(1).describe("UUID проекта, который покидаете"),
  })
  .describe("Выход из проекта");

export const inviteIdParamSchema = z
  .object({
    id: z.string().min(1).describe("UUID приглашения"),
  })
  .describe("Параметры URL: приглашение");
