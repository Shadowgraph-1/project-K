import fp from "fastify-plugin";
import { replyApiError } from "../utils/api-errors.js";

export default fp(async (app) => {
  app.decorate("authenticate", async function (req, rep) {
    try {
      const payload = await req.jwtVerify<{
        id: number;
        email: string;
        type?: string;
      }>();

      if (payload.type !== "access") {
        return replyApiError(rep, "unauthorized");
      }
    } catch {
      return replyApiError(rep, "unauthorized");
    }
  });
});