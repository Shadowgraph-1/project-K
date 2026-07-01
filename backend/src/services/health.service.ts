import { prisma } from "../db/prisma.js";
import { llm } from "../llm/client.js";

type CheckResult = {
  status: "ok" | "down";
  latencyMs: number;
  message?: string;
};

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
