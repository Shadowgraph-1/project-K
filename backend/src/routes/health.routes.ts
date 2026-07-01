import type { FastifyPluginAsync } from "fastify";
import { checkDatabase, checkLlm } from "../services/health.service.js";
import { env } from "../config/env.js";
import { routeSchema } from "../openapi/route-schema.js";
import { healthResponse } from "../openapi/responses.js";

const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/health",
    {
      schema: routeSchema({
        tags: ["Состояние сервисов"],
        summary: "Health-check",
        description:
          "Проверяет API, PostgreSQL и доступность LLM (LM Studio / OpenAI-compatible).\n\n" +
          "**JWT не требуется.**\n\n" +
          "**503** — если база данных недоступна (при этом тело ответа всё равно содержит детали checks).",
        response: {
          200: healthResponse,
          503: healthResponse,
        },
      }),
    },
    async (_req, reply) => {
      const startedAt = Date.now();

      const [database, ai] = await Promise.all([checkDatabase(), checkLlm()]);

      const checks = {
        api: {
          status: "ok" as const,
          latencyMs: Date.now() - startedAt,
        },
        database,
        ai,
      };

      const allOk = Object.values(checks).every((c) => c.status === "ok");
      const anyDown = Object.values(checks).some((c) => c.status === "down");

      const status = allOk ? "healthy" : anyDown ? "degraded" : "unhealthy";

      return reply.status(database.status === "down" ? 503 : 200).send({
        status,
        timestamp: new Date().toISOString(),
        version: env.VERSION,
        checks,
      });
    },
  );
};

export default healthRoutes;
