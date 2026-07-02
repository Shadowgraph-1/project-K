import type { FastifyPluginAsync } from "fastify";
import {
  acceptInvite,
  declineInvite,
  getIncomingInvites,
  getMembers,
  inviteUser,
  leaveWorkspace,
  removeMember,
  searchUsersToInvite,
  updateMemberRole,
} from "../services/workspace-members.service.js";
import {
  inviteIdParamSchema,
  workspaceInviteUserSchema,
  workspaceLeaveParamSchema,
  workspaceMemberParamSchema,
  workspaceMemberRoleSchema,
  workspaceMembersParamSchema,
  workspaceMembersSearchQuerySchema,
} from "../schemas/workspace-member.schema.js";
import { parseBody } from "../utils/parse-body.js";
import { routeSchema } from "../openapi/route-schema.js";
import {
  errorResponse,
  incomingInvitesResponse,
  jsonObject,
  userSearchPageResponse,
  workspaceMembersResponse,
} from "../openapi/responses.js";

const workspaceMembersRoutes: FastifyPluginAsync = async (app) => {
  app.get<{ Params: { id: string } }>(
    "/workspaces/:id/members",
    {
      schema: routeSchema({
        tags: ["Участники"],
        summary: "Участники проекта",
        description: "Список членов команды с ролями (OWNER, ADMIN, EDITOR, …).",
        security: true,
        params: workspaceMembersParamSchema,
        response: { 200: workspaceMembersResponse, 403: errorResponse },
      }),
    },
    async (request) => {
      const { id: workspaceId } = parseBody(
        workspaceMembersParamSchema,
        request.params,
      );
      return getMembers(workspaceId, request.user.id);
    },
  );

  app.get<{ Params: { id: string } }>(
    "/workspaces/:id/members/search",
    {
      schema: routeSchema({
        tags: ["Участники"],
        summary: "Поиск для приглашения",
        description:
          "Ищет пользователей по имени или e-mail для добавления в проект.\n\n" +
          "Query: `q`, `limit` (до 50), `offset`.",
        security: true,
        params: workspaceMembersParamSchema,
        querystring: workspaceMembersSearchQuerySchema,
        response: { 200: userSearchPageResponse, 403: errorResponse },
      }),
    },
    async (request) => {
      const { id: workspaceId } = parseBody(
        workspaceMembersParamSchema,
        request.params,
      );
      const { q, limit, offset } = parseBody(
        workspaceMembersSearchQuerySchema,
        request.query,
      );
      return searchUsersToInvite(
        workspaceId,
        request.user.id,
        q.trim(),
        limit,
        offset,
      );
    },
  );

  app.post<{ Params: { id: string } }>(
    "/workspaces/:id/members",
    {
      schema: routeSchema({
        tags: ["Участники"],
        summary: "Пригласить пользователя",
        description:
          "Отправляет персональное приглашение пользователю по числовому `userId`.",
        security: true,
        params: workspaceMembersParamSchema,
        body: workspaceInviteUserSchema,
        response: { 200: jsonObject, 403: errorResponse },
      }),
    },
    async (request) => {
      const { id: workspaceId } = parseBody(
        workspaceMembersParamSchema,
        request.params,
      );
      const { userId } = parseBody(workspaceInviteUserSchema, request.body);
      return inviteUser(workspaceId, userId, request.user.id);
    },
  );

  app.delete<{ Params: { workspaceId: string; userId: string } }>(
    "/workspaces/:workspaceId/members/:userId",
    {
      schema: routeSchema({
        tags: ["Участники"],
        summary: "Удалить участника",
        description: "Исключает пользователя из проекта. Требуются права админа/владельца.",
        security: true,
        params: workspaceMemberParamSchema,
        response: { 200: jsonObject, 403: errorResponse },
      }),
    },
    async (request) => {
      const { workspaceId, userId: targetUserId } = parseBody(
        workspaceMemberParamSchema,
        request.params,
      );
      return removeMember(workspaceId, targetUserId, request.user.id);
    },
  );

  app.patch<{ Params: { workspaceId: string; userId: string } }>(
    "/workspaces/:workspaceId/members/:userId",
    {
      schema: routeSchema({
        tags: ["Участники"],
        summary: "Сменить роль",
        description:
          "Обновляет роль участника: ADMIN, EDITOR, COMMENTER, VIEWER.\n\n" +
          "Роль OWNER через этот метод не назначается.",
        security: true,
        params: workspaceMemberParamSchema,
        body: workspaceMemberRoleSchema,
        response: { 200: jsonObject, 403: errorResponse },
      }),
    },
    async (request) => {
      const { workspaceId, userId: targetUserId } = parseBody(
        workspaceMemberParamSchema,
        request.params,
      );
      const { role } = parseBody(workspaceMemberRoleSchema, request.body);
      return updateMemberRole(workspaceId, targetUserId, request.user.id, role);
    },
  );

  app.post<{ Params: { workspaceId: string } }>(
    "/workspaces/:workspaceId/members/leave",
    {
      schema: routeSchema({
        tags: ["Участники"],
        summary: "Покинуть проект",
        description: "Текущий пользователь выходит из shared-проекта.",
        security: true,
        params: workspaceLeaveParamSchema,
        response: { 200: jsonObject, 403: errorResponse },
      }),
    },
    async (request) => {
      const { workspaceId } = parseBody(
        workspaceLeaveParamSchema,
        request.params,
      );
      return leaveWorkspace(workspaceId, request.user.id);
    },
  );

  app.get(
    "/invites/incoming",
    {
      schema: routeSchema({
        tags: ["Участники"],
        summary: "Входящие приглашения",
        description: "Список pending-приглашений в проекты для текущего пользователя.",
        security: true,
        response: { 200: incomingInvitesResponse },
      }),
    },
    async (request) => {
      return getIncomingInvites(request.user.id);
    },
  );

  app.post<{ Params: { id: string } }>(
    "/invites/:id/accept",
    {
      schema: routeSchema({
        tags: ["Участники"],
        summary: "Принять приглашение",
        security: true,
        params: inviteIdParamSchema,
        response: { 200: jsonObject, 404: errorResponse },
      }),
    },
    async (request) => {
      const { id } = parseBody(inviteIdParamSchema, request.params);
      return acceptInvite(id, request.user.id);
    },
  );

  app.post<{ Params: { id: string } }>(
    "/invites/:id/decline",
    {
      schema: routeSchema({
        tags: ["Участники"],
        summary: "Отклонить приглашение",
        security: true,
        params: inviteIdParamSchema,
        response: { 200: jsonObject, 404: errorResponse },
      }),
    },
    async (request) => {
      const { id } = parseBody(inviteIdParamSchema, request.params);
      return declineInvite(id, request.user.id);
    },
  );
};

export default workspaceMembersRoutes;
