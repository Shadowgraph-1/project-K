import type { FastifyPluginAsync } from "fastify";
import { WorkspaceRole } from "../generated/prisma/client.js";
import {
  ASSIGNABLE_ROLES,
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
  isApiError,
  replyApiError,
  sendServiceResult,
} from "../utils/api-errors.js";

const workspaceMembersRoutes: FastifyPluginAsync = async (app) => {
  app.get("/workspaces/:id/members", async (request, reply) => {
    const { id: workspaceId } = request.params as { id: string };

    const result = sendServiceResult(
      reply,
      await getMembers(workspaceId, request.user.id),
      "workspace_not_found",
    );
    if (!result) return;
    return result;
  });

  app.get("/workspaces/:id/members/search", async (request, reply) => {
    const { id: workspaceId } = request.params as { id: string };
    const { q = "", limit: limitRaw, offset: offsetRaw } = request.query as {
      q?: string;
      limit?: string;
      offset?: string;
    };

    const query = q.trim();
    const offset = Math.max(Number(offsetRaw) || 0, 0);
    const limit = Math.min(Math.max(Number(limitRaw) || 30, 1), 50);

    const result = sendServiceResult(
      reply,
      await searchUsersToInvite(
        workspaceId,
        request.user.id,
        query,
        limit,
        offset,
      ),
      "workspace_not_found",
    );
    if (!result) return;
    return result;
  });

  app.post("/workspaces/:id/members", async (request, reply) => {
    const { id: workspaceId } = request.params as { id: string };
    const body = request.body as { userId?: number };

    if (typeof body?.userId !== "number" || !Number.isInteger(body.userId)) {
      return replyApiError(reply, "missing_user_id");
    }

    const result = await inviteUser(workspaceId, body.userId, request.user.id);
    if (isApiError(result)) {
      return replyApiError(reply, result.error);
    }
    return result;
  });

  app.delete("/workspaces/:workspaceId/members/:userId", async (request, reply) => {
    const { workspaceId, userId: targetUserIdRaw } = request.params as {
      workspaceId: string;
      userId: string;
    };

    const targetUserId = Number(targetUserIdRaw);
    if (!Number.isInteger(targetUserId)) {
      return replyApiError(reply, "invalid_user_id");
    }

    const result = await removeMember(workspaceId, targetUserId, request.user.id);
    if (isApiError(result)) {
      return replyApiError(reply, result.error);
    }
    return result;
  });

  app.patch("/workspaces/:workspaceId/members/:userId", async (request, reply) => {
    const { workspaceId, userId: targetUserIdRaw } = request.params as {
      workspaceId: string;
      userId: string;
    };

    const targetUserId = Number(targetUserIdRaw);
    if (!Number.isInteger(targetUserId)) {
      return replyApiError(reply, "invalid_user_id");
    }

    const { role } = request.body as { role?: WorkspaceRole };
    if (!role || !ASSIGNABLE_ROLES.includes(role)) {
      return replyApiError(reply, "invalid_role");
    }

    const result = await updateMemberRole(
      workspaceId,
      targetUserId,
      request.user.id,
      role,
    );
    if (isApiError(result)) {
      return replyApiError(reply, result.error);
    }
    return result;
  });

  app.post("/workspaces/:workspaceId/members/leave", async (request, reply) => {
    const { workspaceId } = request.params as { workspaceId: string };

    const result = await leaveWorkspace(workspaceId, request.user.id);
    if (isApiError(result)) {
      return replyApiError(reply, result.error);
    }
    return result;
  });

  app.get("/invites/incoming", async (request) => {
    return getIncomingInvites(request.user.id);
  });

  app.post("/invites/:id/accept", async (request, reply) => {
    const { id } = request.params as { id: string };

    const result = await acceptInvite(id, request.user.id);
    if (isApiError(result)) {
      return replyApiError(reply, result.error);
    }
    return result;
  });

  app.post("/invites/:id/decline", async (request, reply) => {
    const { id } = request.params as { id: string };

    const result = await declineInvite(id, request.user.id);
    if (isApiError(result)) {
      return replyApiError(reply, result.error);
    }
    return result;
  });
};

export default workspaceMembersRoutes;
