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

const overrides = new Map<FeatureFlagKey, boolean>();

function resolveFlag(key: FeatureFlagKey): boolean {
  if (overrides.has(key)) return overrides.get(key)!;
  return DEFAULTS[key];
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

export function setFeatureFlag(
  key: FeatureFlagKey,
  enabled: boolean,
): FeatureFlag {
  overrides.set(key, enabled);
  return {
    key,
    ...FLAG_META[key],
    enabled,
  };
}
