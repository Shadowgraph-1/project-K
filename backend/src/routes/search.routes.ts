import type { FastifyPluginAsync } from "fastify";
import * as searchService from "../services/search.service.js";
import { searchQuerySchema } from "../schemas/search.schema.js";
import { parseBody } from "../utils/parse-body.js";
import { routeSchema } from "../openapi/route-schema.js";

const searchRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/search",
    {
      schema: routeSchema({
        tags: ["Поиск"],
        summary: "Поиск проектов и задач",
        description: "Поиск по названию среди доступных проектов и задач.",
        security: true,
        querystring: searchQuerySchema,
      }),
    },
    async (request) => {
      const { q, limit } = parseBody(searchQuerySchema, request.query);
      return searchService.search(request.user.id, q, limit);
    },
  );
};

export default searchRoutes;