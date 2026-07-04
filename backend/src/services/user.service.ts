import bcrypt from "bcrypt";
import { prisma } from "../db/prisma.js";
import { ApiHttpError } from "../utils/api-errors.js";
import type { AuthUser } from "./auth.service.js";

export async function updateProfile(
  userId: number,
  name: string,
  email: string,
): Promise<{ user: AuthUser; emailChanged: boolean }> {
  const current = await prisma.users.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });

  if (!current) {
    throw new ApiHttpError("user_not_found");
  }

  if (email !== current.email) {
    const existing = await prisma.users.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing && existing.id !== userId) {
      throw new ApiHttpError("email_taken");
    }
  }

  const user = await prisma.users.update({
    where: { id: userId },
    data: { name, email },
    select: { id: true, name: true, email: true },
  });

  return {
    user,
    emailChanged: email !== current.email,
  };
}

export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { id: true, password_hash: true },
  });

  if (!user) {
    throw new ApiHttpError("user_not_found");
  }

  const valid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!valid) {
    throw new ApiHttpError("invalid_password");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.users.update({
    where: { id: userId },
    data: { password_hash: passwordHash },
  });
}

export async function deleteAccount(
  userId: number,
  password: string,
): Promise<{ ok: true }> {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { id: true, password_hash: true },
  });

  if (!user) {
    throw new ApiHttpError("user_not_found");
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new ApiHttpError("invalid_password");
  }

  await prisma.users.delete({ where: { id: userId } });
  return { ok: true };
}