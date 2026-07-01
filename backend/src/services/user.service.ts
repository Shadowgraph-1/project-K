import bcrypt from "bcrypt";
import { prisma } from "../db/prisma.js";
import { ApiHttpError } from "../utils/api-errors.js";

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
