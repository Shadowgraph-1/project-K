import type { FastifyPluginAsync } from "fastify";
import {
  connectorIdParamSchema,
  patchConnectorSchema,
} from "../schemas/connectors.schema.js";
import * as connectorsService from "../services/connectors.service.js";
import { parseBody } from "../utils/parse-body.js";
import { routeSchema } from "../openapi/route-schema.js";
import { connectorsListResponse, connectorDto, errorResponse } from "../openapi/responses.js";

const connectorsRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/connectors",
    {
      schema: routeSchema({
        tags: ["Коннекторы"],
        summary: "Состояние коннекторов",
        description:
          "Список поддерживаемых коннекторов для текущего пользователя: включён ли и настроен ли на сервере.",
        security: true,
        response: { 200: connectorsListResponse, 401: errorResponse },
      }),
    },
    async (request) => {
      const connectors = await connectorsService.listUserConnectors(
        request.user.id,
      );
      return { connectors };
    },
  );

  app.patch<{ Params: { id: string } }>(
    "/connectors/:id",
    {
      schema: routeSchema({
        tags: ["Коннекторы"],
        summary: "Включить или выключить коннектор",
        description:
          "Подключение (`enabled: true`) или отключение (`enabled: false`) коннектора для текущего пользователя.",
        security: true,
        params: connectorIdParamSchema,
        body: patchConnectorSchema,
        response: {
          200: connectorDto,
          401: errorResponse,
          404: errorResponse,
          503: errorResponse,
        },
      }),
    },
    async (request) => {
      const { id } = parseBody(connectorIdParamSchema, request.params);
      const { enabled, telegramChatId } = parseBody(
        patchConnectorSchema,
        request.body,
      );
      return connectorsService.setConnectorEnabled(
        request.user.id,
        id,
        enabled,
        telegramChatId,
      );
    },
  );

  app.delete<{ Params: { id: string } }>(
    "/connectors/:id",
    {
      schema: routeSchema({
        tags: ["Коннекторы"],
        summary: "Удалить подключение коннектора",
        description:
          "Удаляет подключение коннектора у текущего пользователя. После этого его можно подключить заново.",
        security: true,
        params: connectorIdParamSchema,
        response: {
          200: connectorDto,
          401: errorResponse,
          404: errorResponse,
        },
      }),
    },
    async (request) => {
      const { id } = parseBody(connectorIdParamSchema, request.params);
      return connectorsService.removeConnector(request.user.id, id);
    },
  );
};

export default connectorsRoutes;
