import bcrypt from "bcrypt";
import { prisma } from "../db/prisma.js";
import { apiErr, type ApiError } from "../utils/api-errors.js";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<AuthUser | ApiError> {
  const existing = await prisma.users.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existing) {
    return apiErr("email_taken");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  return prisma.users.create({
    data: {
      name,
      email,
      password_hash: passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthUser | ApiError> {
  const user = await prisma.users.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password_hash: true,
    },
  });

  if (!user) {
    return apiErr("invalid_credentials");
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return apiErr("invalid_credentials");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}
