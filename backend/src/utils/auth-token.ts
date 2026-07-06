import { createHash, randomBytes } from "node:crypto";
import type { FastifyInstance, FastifyReply } from "fastify";

import { env } from "../config/env.js";
import { prisma } from "../db/prisma.js";

type AccessPayload = {
  id: number;
  email: string;
  type: "access";
};

export function signAccessToken(
  app: FastifyInstance,
  user: { id: number; email: string },
) {
  return app.jwt.sign(
    { id: user.id, email: user.email, type: "access" } satisfies AccessPayload,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN },
  );
}

export function createRefreshTokenPlain() {
  return randomBytes(48).toString("base64url");
}

export function hashRefreshToken(plain: string) {
  return createHash("sha256").update(plain).digest("hex");
}

export async function persistRefreshToken(userId: number, plain: string) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + env.JWT_REFRESH_EXPIRES_DAYS);

  await prisma.refresh_tokens.create({
    data: {
      user_id: userId,
      token_hash: hashRefreshToken(plain),
      expires_at: expiresAt,
    },
  });
}

export function setRefreshCookie(reply: FastifyReply, plain: string) {
  reply.setCookie("refresh_token", plain, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
    maxAge: env.JWT_REFRESH_EXPIRES_DAYS * 24 * 60 * 60,
  });
}

export function clearRefreshCookie(reply: FastifyReply) {
  reply.clearCookie("refresh_token", { path: "/api/auth" });
}

export async function issueAuthSession(
  app: FastifyInstance,
  reply: FastifyReply,
  user: { id: number; email: string },
) {
  const accessToken = signAccessToken(app, user);
  const refreshPlain = createRefreshTokenPlain();

  await persistRefreshToken(user.id, refreshPlain);
  setRefreshCookie(reply, refreshPlain);

  return { accessToken, user };
}

export async function rotateRefreshSession(
  app: FastifyInstance,
  reply: FastifyReply,
  user: { id: number; email: string },
  oldRefreshId: string,
) {
  await prisma.refresh_tokens.delete({ where: { id: oldRefreshId } });
  return issueAuthSession(app, reply, user);
}