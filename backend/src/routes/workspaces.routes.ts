import type { FastifyPluginAsync } from "fastify";
import * as workspacesService from "../services/workspaces.service.js";
import { sendServiceResult } from "../utils/api-errors.js";

const workspacesRoutes: FastifyPluginAsync = async (app) => {
  app.get("/workspaces", async (request) => {
    return workspacesService.listWorkspaces(request.user.id);
  });

  app.get("/workspaces/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const workspace = sendServiceResult(
      reply,
      await workspacesService.getWorkspace(id, request.user.id),
      "workspace_not_found",
    );
    if (!workspace) return;
    return workspace;
  });

  app.post(
    "/workspaces",
    {
      schema: {
        body: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", minLength: 1, maxLength: 100 },
          },
        },
      },
    },
    async (request) => {
      const { name } = request.body as { name: string };
      return workspacesService.createWorkspace(request.user.id, name);
    },
  );

  app.delete("/workspaces/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const result = sendServiceResult(
      reply,
      await workspacesService.deleteWorkspace(id, request.user.id),
      "workspace_not_found",
    );
    if (!result) return;
    return result;
  });
};

export default workspacesRoutes;
