import { prisma } from "../db/prisma.js";

export const FEATURE_FLAG_KEYS = [
  "assistant_enabled",
  "registration_open",
  "workspace_creation",
  "llm_user_keys",
] as const;

export type FeatureFlagKey = (typeof FEATURE_FLAG_KEYS)[number];

export type FeatureFlag = {
  key: FeatureFlagKey;
  label: string;
  description: string;
  enabled: boolean;
};

const FLAG_META: Record<
  FeatureFlagKey,
  Pick<FeatureFlag, "label" | "description">
> = {
  assistant_enabled: {
    label: "Kono AI",
    description: "Чат-ассистент в задачах",
  },
  registration_open: {
    label: "Регистрация",
    description: "Новые пользователи могут создавать аккаунт",
  },
  workspace_creation: {
    label: "Новые проекты",
    description: "Создание workspace",
  },
  llm_user_keys: {
    label: "API ключи пользователей",
    description: "Личные ключи LLM в настройках",
  },
};

const DEFAULTS: Record<FeatureFlagKey, boolean> = {
  assistant_enabled: true,
  registration_open: true,
  workspace_creation: true,
  llm_user_keys: true,
};

let cache: Map<FeatureFlagKey, boolean> | null = null;

function resolveFlag(key: FeatureFlagKey): boolean {
  if (cache?.has(key)) return cache.get(key)!;
  return DEFAULTS[key];
}

export async function initFeatureFlagsCache(): Promise<void> {
  const rows = await prisma.feature_flags.findMany({
    select: { key: true, enabled: true },
  });
  const byKey = new Map(rows.map((row) => [row.key, row.enabled]));
  const next = new Map<FeatureFlagKey, boolean>();

  for (const key of FEATURE_FLAG_KEYS) {
    if (!byKey.has(key)) {
      await prisma.feature_flags.create({
        data: { key, enabled: DEFAULTS[key] },
      });
      next.set(key, DEFAULTS[key]);
      continue;
    }

    next.set(key, byKey.get(key)!);
  }

  cache = next;
}

export function isFeatureEnabled(key: FeatureFlagKey): boolean {
  return resolveFlag(key);
}

export function listFeatureFlags(): FeatureFlag[] {
  return FEATURE_FLAG_KEYS.map((key) => ({
    key,
    ...FLAG_META[key],
    enabled: resolveFlag(key),
  }));
}

export async function setFeatureFlag(
  key: FeatureFlagKey,
  enabled: boolean,
): Promise<FeatureFlag> {
  await prisma.feature_flags.upsert({
    where: { key },
    create: { key, enabled },
    update: { enabled },
  });

  if (!cache) {
    cache = new Map<FeatureFlagKey, boolean>();
  }
  cache.set(key, enabled);

  return {
    key,
    ...FLAG_META[key],
    enabled,
  };
}