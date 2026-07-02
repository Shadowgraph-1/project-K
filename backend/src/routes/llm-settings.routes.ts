import type { FastifyPluginAsync } from "fastify";
import {
  createLlmKeySchema,
  listLlmQuerySchema,
  llmKeyIdParamSchema,
} from "../schemas/llm-settings.schema.js";
import * as llmSettingsService from "../services/llm-settings.service.js";
import { isFeatureEnabled } from "../services/feature-flags.service.js";
import { replyApiError } from "../utils/api-errors.js";
import { parseBody } from "../utils/parse-body.js";
import { routeSchema } from "../openapi/route-schema.js";
import {
  errorResponse,
  llmKeysResponse,
  noContentResponse,
} from "../openapi/responses.js";

const llmSettingsRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", async (request, reply) => {
    if (!isFeatureEnabled("llm_user_keys")) {
      return replyApiError(reply, "forbidden");
    }
  });

  app.get(
    "/llm-keys",
    {
      schema: routeSchema({
        tags: ["LLM-ключи"],
        summary: "Список ключей",
        description:
          "LLM-ключи текущего пользователя. В ответе — маска ключа (`hint`), не полный apiKey.\n\n" +
          "Требует feature flag `llm_user_keys`.",
        security: true,
        querystring: listLlmQuerySchema,
        response: { 200: llmKeysResponse, 403: errorResponse },
      }),
    },
    async (request) => {
      const query = parseBody(listLlmQuerySchema, request.query);
      return llmSettingsService.listLlmKeys(request.user.id, query);
    },
  );

  app.post(
    "/llm-keys",
    {
      schema: routeSchema({
        tags: ["LLM-ключи"],
        summary: "Добавить ключ",
        description: "Сохраняет OpenAI-compatible API key. Новый ключ не активируется автоматически.",
        security: true,
        body: createLlmKeySchema,
        response: { 200: llmKeysResponse, 403: errorResponse },
      }),
    },
    async (request) => {
      const { apiKey, label } = parseBody(createLlmKeySchema, request.body);
      return llmSettingsService.createLlmKey(request.user.id, apiKey, label);
    },
  );

  app.patch(
    "/llm-keys/use-default",
    {
      schema: routeSchema({
        tags: ["LLM-ключи"],
        summary: "Системный LLM",
        description:
          "Отключает пользовательские ключи и переключает чат на системный LM из env.",
        security: true,
        response: { 200: llmKeysResponse, 403: errorResponse },
      }),
    },
    async (request) => {
      return llmSettingsService.useDefaultLlm(request.user.id);
    },
  );

  app.patch<{ Params: { id: string } }>(
    "/llm-keys/:id/activate",
    {
      schema: routeSchema({
        tags: ["LLM-ключи"],
        summary: "Активировать ключ",
        description: "Делает указанный ключ активным для AI-чата (остальные деактивируются).",
        security: true,
        params: llmKeyIdParamSchema,
        response: { 200: llmKeysResponse, 403: errorResponse, 404: errorResponse },
      }),
    },
    async (request) => {
      const { id } = parseBody(llmKeyIdParamSchema, request.params);
      return llmSettingsService.activateLlmKey(request.user.id, id);
    },
  );

  app.delete<{ Params: { id: string } }>(
    "/llm-keys/:id",
    {
      schema: routeSchema({
        tags: ["LLM-ключи"],
        summary: "Удалить ключ",
        security: true,
        params: llmKeyIdParamSchema,
        response: {
          204: noContentResponse,
          403: errorResponse,
          404: errorResponse,
        },
      }),
    },
    async (request, reply) => {
      const { id } = parseBody(llmKeyIdParamSchema, request.params);
      await llmSettingsService.deleteLlmKey(request.user.id, id);
      return reply.status(204).send();
    },
  );

  app.delete(
    "/llm-keys",
    {
      schema: routeSchema({
        tags: ["LLM-ключи"],
        summary: "Удалить все ключи",
        security: true,
        response: {
          204: noContentResponse,
          403: errorResponse,
        },
      }),
    },
    async (request, reply) => {
      await llmSettingsService.deleteAllLlmKeys(request.user.id);
      return reply.status(204).send();
    },
  );
};

export default llmSettingsRoutes;
