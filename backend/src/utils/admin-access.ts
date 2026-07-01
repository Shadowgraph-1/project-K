import { prisma } from "../db/prisma.js";
import { env } from "../config/env.js";

function parseAdminEmails(): Set<string> {
  const raw = env.ADMIN_EMAILS?.trim();
  if (!raw) return new Set();

  return new Set(
    raw
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

function parseAdminUserIds(): Set<number> {
  const raw = env.ADMIN_USER_IDS?.trim();
  if (!raw) return new Set();

  return new Set(
    raw
      .split(",")
      .map((id) => Number.parseInt(id.trim(), 10))
      .filter((id) => Number.isFinite(id) && id > 0),
  );
}

const ADMIN_EMAILS = parseAdminEmails();
const ADMIN_USER_IDS = parseAdminUserIds();

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.has(email.trim().toLowerCase());
}

export function isAdminUserId(userId: number | undefined | null): boolean {
  if (!userId) return false;
  return ADMIN_USER_IDS.has(userId);
}

export async function isAdminUser(user: {
  id: number;
  email?: string;
}): Promise<boolean> {
  if (isAdminUserId(user.id)) return true;

  if (ADMIN_EMAILS.size === 0) return false;

  const jwtEmail = user.email?.trim().toLowerCase();
  if (jwtEmail && ADMIN_EMAILS.has(jwtEmail)) return true;

  const row = await prisma.users.findUnique({
    where: { id: user.id },
    select: { email: true },
  });

  if (!row?.email) return false;
  return ADMIN_EMAILS.has(row.email.trim().toLowerCase());
}
