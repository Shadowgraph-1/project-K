import fp from "fastify-plugin";
import type { FastifyError } from "fastify";
import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/client.js";
import {
  ApiHttpError,
  replyApiError,
} from "../utils/api-errors.js";

function getStatusCode(error: unknown): number {
  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof (error as FastifyError).statusCode === "number"
  ) {
    return (error as FastifyError).statusCode!;
  }
  return 500;
}

export default fp(async (app) => {
  app.setErrorHandler((error, request, reply) => {
    if (reply.sent) return;

    if (error instanceof ApiHttpError) {
      return replyApiError(reply, error.code);
    }

    if (error instanceof ZodError) {
      return replyApiError(reply, "validation_failed", {
        fields: error.flatten().fieldErrors,
      });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return replyApiError(reply, "duplicate_record");
      }
      if (error.code === "P2025") {
        return replyApiError(reply, "record_not_found");
      }
    }

    const fastifyError = error as FastifyError;
    if (fastifyError.validation) {
      return replyApiError(reply, "validation_failed");
    }

    if (getStatusCode(error) === 401) {
      return replyApiError(reply, "unauthorized");
    }

    request.log.error(error);
    const status = getStatusCode(error);
    if (status >= 500) {
      return replyApiError(reply, "internal_server_error");
    }

    return reply.status(status).send({
      error:
        error instanceof Error ? error.message : "Внутренняя ошибка сервера",
    });
  });

  app.setNotFoundHandler((_request, reply) => {
    replyApiError(reply, "route_not_found");
  });
});
