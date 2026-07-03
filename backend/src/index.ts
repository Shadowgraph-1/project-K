import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import rateLimit from "@fastify/rate-limit";
import aiRoutes from "./routes/ai.routes.js";
import taskStatusHistoryRoutes from "./routes/task-status-history.routes.js";
import taskRoutes from "./routes/tasks.routes.js";
import subtaskRoutes from "./routes/subtasks.routes.js";
import taskActivityRoutes from "./routes/task-activity.routes.js";
import authRoutes from "./routes/auth.routes.js";
import workspacesRoutes from "./routes/workspaces.routes.js";
import authPlugin from "./plugins/auth.plugin.js";
import errorHandler from "./plugins/error-handler.plugin.js";
import workspaceMembersRoutes from "./routes/workspace-members.routes.js";
import usersRoutes from "./routes/users.routes.js";
import healthRoutes from "./routes/health.routes.js";
import llmSettingsRoutes from "./routes/llm-settings.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import adminAccessRoutes from "./routes/admin-access.routes.js";
import connectorsRoutes from "./routes/connectors.routes.js";
import searchRoutes from "./routes/search.routes.js";
import { API_DESCRIPTION, OPENAPI_TAGS } from "./openapi/description.js";
import { env } from "./config/env.js";
import { prisma } from "./db/prisma.js";

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
  ],
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
});

await app.register(swagger, {
  openapi: {
    openapi: "3.1.0",
    info: {
      title: "Kono API",
      description: API_DESCRIPTION,
      version: env.VERSION,
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "Локальный сервер. Все методы с префиксом /api",
      },
    ],
    tags: [...OPENAPI_TAGS],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "JWT из POST /auth/login или POST /auth/register. В Swagger UI: Authorize → Bearer <token>",
        },
      },
    },
  },
});
await app.register(swaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "list",
    deepLinking: true,
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true,
  },
  staticCSP: true,
});

await app.register(jwt, {
  secret: env.JWT_SECRET,
});

await app.register(rateLimit, {
  global: false,
});

await app.register(authPlugin);
await app.register(errorHandler);

await app.register(authRoutes, { prefix: "/api" });
await app.register(healthRoutes, { prefix: "/api" });

await app.register(
  async (protectedApp) => {
    protectedApp.addHook("preHandler", app.authenticate);

    await protectedApp.register(adminAccessRoutes);
    await protectedApp.register(adminRoutes);
    await protectedApp.register(aiRoutes);
    await protectedApp.register(llmSettingsRoutes);
    await protectedApp.register(usersRoutes);
    await protectedApp.register(workspacesRoutes);
    await protectedApp.register(workspaceMembersRoutes);
    await protectedApp.register(taskRoutes);
    await protectedApp.register(taskStatusHistoryRoutes);
    await protectedApp.register(subtaskRoutes);
    await protectedApp.register(taskActivityRoutes);
    await protectedApp.register(searchRoutes);
    await protectedApp.register(connectorsRoutes);
  },
  { prefix: "/api" },
);

await app.listen({ port: env.PORT, host: "0.0.0.0" });

const shutdown = async (signal: string) => {
  app.log.info({ signal }, "received signal, shutting down");
  await app.close();
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
