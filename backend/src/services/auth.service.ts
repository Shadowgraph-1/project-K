import { prisma } from "../db/prisma.js";
import { ApiHttpError } from "../utils/api-errors.js";
import { isFeatureEnabled } from "./feature-flags.service.js";
import { hashPassword, verifyPassword } from "../utils/passwordHash.js";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<AuthUser> {
  if (!isFeatureEnabled("registration_open")) {
    throw new ApiHttpError("forbidden");
  }

  const existing = await prisma.users.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existing) {
    throw new ApiHttpError("email_taken");
  }

  const passwordHash = await hashPassword(password);

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
): Promise<AuthUser> {
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
    throw new ApiHttpError("invalid_credentials");
  }

  const valid = await verifyPassword(password, user.password_hash);
  
  if (!valid) {
    throw new ApiHttpError("invalid_credentials");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}
