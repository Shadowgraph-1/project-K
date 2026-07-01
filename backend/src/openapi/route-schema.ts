import type { FastifySchema } from "fastify";
import { z, type ZodType } from "zod";

type JsonSchema = Record<string, unknown>;

type RouteSchemaOptions = {
  tags: string[];
  description?: string;
  summary?: string;
  /** Требует JWT (кнопка Authorize в Swagger UI). */
  security?: boolean;
  body?: ZodType;
  querystring?: ZodType;
  params?: ZodType;
  response?: Record<number, JsonSchema>;
};

function fromZod(schema: ZodType): JsonSchema {
  const json = z.toJSONSchema(schema) as JsonSchema;
  delete json.$schema;
  return json;
}

/** Собирает Fastify `schema` для Swagger из Zod-схем проекта. */
export function routeSchema(options: RouteSchemaOptions): FastifySchema {
  const schema: FastifySchema = {
    tags: options.tags,
    description: options.description,
    summary: options.summary,
  };

  if (options.security) {
    schema.security = [{ bearerAuth: [] }];
  }

  if (options.body) {
    schema.body = fromZod(options.body);
  }

  if (options.querystring) {
    schema.querystring = fromZod(options.querystring);
  }

  if (options.params) {
    schema.params = fromZod(options.params);
  }

  if (options.response) {
    schema.response = options.response;
  }

  return schema;
}
