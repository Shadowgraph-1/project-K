import fp from "fastify-plugin";
import { replyApiError } from "../utils/api-errors.js";

export default fp(async (app) => {
  app.decorate("authenticate", async function (req, rep) {
    try {
      await req.jwtVerify();
    } catch {
      return replyApiError(rep, "unauthorized");
    }
  });
});
