import { env } from "../config/env.js";
import { prisma } from "../db/prisma.js";
import { llm } from "../llm/client.js";

type CheckResult = {
  status: "ok" | "down";
  latencyMs: number;
  message?: string;
};

export async function getHealth() {
  const startedAt = Date.now();

  const [database, ai] = await Promise.all([
    checkDatabase(),
    checkLlm(),
  ]);

  const checks = {
    api: {
      status: "ok" as const,
      latencyMs: Date.now() - startedAt,
    },
    database,
    ai
  };

  const allOk = Object.values(checks).every((c) => c.status === 'ok');
  const anyDown = Object.values(checks).some((c) => c.status === 'down');
  const status = allOk ? "healthy" : anyDown ? "degraded" : "unhealthy";

  return { 
    status,
    timestamp: new Date().toISOString(),
    version: env.VERSION,
    checks,
    httpStatus: database.status === "down" ? 503 : 200,
  };
}

async function timed<T>(
  fn: () => Promise<T>,
): Promise<{ ms: number; value: T }> {
  const start = Date.now();
  const value = await fn();
  return { ms: Date.now() - start, value };
}

function withTimeout<T>(promise: Promise<T>, ms = 5000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), ms),
    ),
  ]);
}

export async function checkDatabase(): Promise<CheckResult> {
  try {
    const { ms } = await timed(() => prisma.$queryRaw`SELECT 1`);
    return { status: "ok", latencyMs: ms };
  } catch (e) {
    return {
      status: "down",
      latencyMs: 0,
      message: e instanceof Error ? e.message : "DB unreachable",
    };
  }
}

export async function checkLlm(): Promise<CheckResult> {
  try {
    const { ms } = await timed(() =>
      withTimeout(llm.client.models.list(), 5000),
    );
    return { status: "ok", latencyMs: ms, message: llm.model };
  } catch {
    return {
      status: "down",
      latencyMs: 0,
      message: "AI недоступен. Проверь LM Studio и LM_BASE_URL",
    };
  }
}
