import type { FastifyPluginAsync } from "fastify";
import { routeSchema } from "../openapi/route-schema.js";
import { healthResponse } from "../openapi/responses.js";
import { getHealth } from "../services/health.service.js";

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
      const health = await getHealth();
      return reply.status(health.httpStatus).send({
        status: health.status,
        timestamp: health.timestamp,
        version: health.version,
        checks: health.checks,
      })
    }
  );
};

export default healthRoutes;
