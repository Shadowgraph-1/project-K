import { prisma } from "../db/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import { ApiHttpError } from "../utils/api-errors.js";

function maskApiKey(plain: string): string {
  const key = plain.trim();
  if (key.length === 0) return "apiKey-...";

  const tail = key.length <= 4 ? key : key.slice(-4);
  return `apiKey-...${tail}`;
}

export type LlmKeyDto = {
  id: string;
  label: string | null;
  hint: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdByName: string;
};

export type LlmKeysListResponse = {
  useDefault: boolean;
  keys: LlmKeyDto[];
};

export type LlmKeysSortOptions = {
  sorting?: "name" | "created";
  ordering?: "asc" | "desc";
};

function resolveOrderBy({
  sorting = "name",
  ordering = "asc",
}: LlmKeysSortOptions):
  | Prisma.user_llm_keysOrderByWithRelationInput
  | Prisma.user_llm_keysOrderByWithRelationInput[] {
  const dir = ordering === "desc" ? "desc" : "asc";

  if (sorting === "created") {
    return {
      created_at: dir,
    };
  }

  return [
    {
      label: dir,
    },
    {
      id: "asc",
    },
  ];
}

function mapKeyRow(row: {
  id: string;
  label: string | null;
  api_key: string;
  key_hint: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  user: { name: string };
}): LlmKeyDto {
  return {
    id: row.id,
    label: row.label,
    hint: maskApiKey(row.api_key),
    isActive: row.is_active,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    createdByName: row.user.name,
  };
}

async function buildListResponse(
  userId: number,
  options?: LlmKeysSortOptions,
): Promise<LlmKeysListResponse> {
  const rows = await prisma.user_llm_keys.findMany({
    where: { user_id: userId },
    orderBy: resolveOrderBy(options ?? {}),
    select: {
      id: true,
      label: true,
      api_key: true,
      key_hint: true,
      is_active: true,
      created_at: true,
      updated_at: true,
      user: { select: { name: true } },
    },
  });

  const keys = rows.map(mapKeyRow);

  return {
    useDefault: keys.length === 0 || !keys.some((key) => key.isActive),
    keys,
  };
}

export async function listLlmKeys(
  userId: number,
  options?: LlmKeysSortOptions,
): Promise<LlmKeysListResponse> {
  return buildListResponse(userId, options);
}

export async function createLlmKey(
  userId: number,
  apiKey: string,
  label?: string,
): Promise<LlmKeysListResponse> {
  const hint = maskApiKey(apiKey);
  const trimmedLabel = label?.trim() || null;

  const existing = await prisma.user_llm_keys.findMany({
    where: { user_id: userId },
    select: { is_active: true },
  });

  const shouldActivate =
    existing.length === 0 || !existing.some((key) => key.is_active);

  await prisma.$transaction(async (tx) => {
    if (shouldActivate) {
      await tx.user_llm_keys.updateMany({
        where: { user_id: userId },
        data: { is_active: false },
      });
    }

    await tx.user_llm_keys.create({
      data: {
        user_id: userId,
        api_key: apiKey,
        key_hint: hint,
        label: trimmedLabel,
        is_active: shouldActivate,
      },
    });
  });

  return buildListResponse(userId);
}

export async function activateLlmKey(
  userId: number,
  keyId: string,
): Promise<LlmKeysListResponse> {
  const key = await prisma.user_llm_keys.findFirst({
    where: { id: keyId, user_id: userId },
    select: { id: true },
  });

  if (!key) throw new ApiHttpError("record_not_found");

  await prisma.$transaction([
    prisma.user_llm_keys.updateMany({
      where: { user_id: userId },
      data: { is_active: false },
    }),
    prisma.user_llm_keys.update({
      where: { id: keyId },
      data: { is_active: true },
    }),
  ]);

  return buildListResponse(userId);
}

export async function useDefaultLlm(
  userId: number,
): Promise<LlmKeysListResponse> {
  await prisma.user_llm_keys.updateMany({
    where: { user_id: userId },
    data: { is_active: false },
  });

  return buildListResponse(userId);
}

export async function deleteLlmKey(
  userId: number,
  keyId: string,
): Promise<LlmKeysListResponse> {
  const key = await prisma.user_llm_keys.findFirst({
    where: { id: keyId, user_id: userId },
    select: { id: true, is_active: true },
  });

  if (!key) throw new ApiHttpError("record_not_found");

  await prisma.user_llm_keys.delete({ where: { id: keyId } });

  if (key.is_active) {
    const next = await prisma.user_llm_keys.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
      select: { id: true },
    });

    if (next) {
      await prisma.user_llm_keys.update({
        where: { id: next.id },
        data: { is_active: true },
      });
    }
  }

  return buildListResponse(userId);
}

export async function deleteAllLlmKeys(
  userId: number,
): Promise<LlmKeysListResponse> {
  await prisma.user_llm_keys.deleteMany({
    where: { user_id: userId },
  });

  return buildListResponse(userId);
}

export async function resolveUserApiKey(
  userId: number,
): Promise<string | null> {
  const row = await prisma.user_llm_keys.findFirst({
    where: { user_id: userId, is_active: true },
    select: { api_key: true },
  });

  return row?.api_key ?? null;
}
