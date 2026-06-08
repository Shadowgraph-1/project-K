import type { FastifyPluginAsync } from "fastify";
import { deleteAccountSchema } from "../schemas/user.schema.js";
import {
  deleteAccount,
} from "../services/user.service.js";
import { parseBody } from "../utils/parse-body.js";

const usersRoutes: FastifyPluginAsync = async (app) => {
  app.delete("/users/me", async (request, reply) => {
    const { password } = parseBody(deleteAccountSchema, request.body);

    await deleteAccount(request.user.id, password);
    return reply.status(204).send();
  });
};

export default usersRoutes;
