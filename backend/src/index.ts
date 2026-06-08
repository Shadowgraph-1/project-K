import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import aiRoutes from "./routes/ai.routes.js";
import taskRoutes from "./routes/tasks.routes.js";
import subtaskRoutes from "./routes/subtasks.routes.js";
import taskActivityRoutes from "./routes/task-activity.routes.js";
import authRoutes from "./routes/auth.routes.js";
import workspacesRoutes from "./routes/workspaces.routes.js";
import authPlugin from "./plugins/auth.plugin.js";
import errorHandler from "./plugins/error-handler.plugin.js";
import workspaceMembersRoutes from "./routes/workspace-members.routes.js";
import usersRoutes from "./routes/users.routes.js";

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
  ],
  methods: ["*"],
});

await app.register(jwt, {
  secret: process.env.JWT_SECRET ?? "dev-secret",
});
await app.register(authPlugin);

await app.register(errorHandler);

await app.register(authRoutes, { prefix: '/api'});

await app.register(
  async (protectedApp) => {
    protectedApp.addHook("preHandler", app.authenticate);

    await protectedApp.register(aiRoutes);
    await protectedApp.register(usersRoutes);
    await protectedApp.register(workspacesRoutes);
    await protectedApp.register(workspaceMembersRoutes);
    await protectedApp.register(taskRoutes);
    await protectedApp.register(subtaskRoutes);
    await protectedApp.register(taskActivityRoutes);
  },
  { prefix: "/api" },
);

await app.listen({ port: 3000, host: "0.0.0.0" });
