import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../db/prisma.js", () => ({
  prisma: {
    users: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { prisma } from "../db/prisma.js";
import {
  changePassword,
  deleteAccount,
  updateProfile,
} from "./user.service.js";
import { hashPassword } from "../utils/passwordHash.js";

function mockUser<T>(value: T) {
  return value as Awaited<ReturnType<typeof prisma.users.findUnique>>;
}

function mockUpdatedUser<T>(value: T) {
  return value as Awaited<ReturnType<typeof prisma.users.update>>;
}

function mockDeletedUser<T>(value: T) {
  return value as Awaited<ReturnType<typeof prisma.users.delete>>;
}

describe("user.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updateProfile обновляет имя без смены email", async () => {
    vi.mocked(prisma.users.findUnique).mockResolvedValue(
      mockUser({ id: 1, email: "user@example.com" }),
    );
    vi.mocked(prisma.users.update).mockResolvedValue(
      mockUpdatedUser({
        id: 1,
        name: "Новое имя",
        email: "user@example.com",
      }),
    );

    const result = await updateProfile(1, "Новое имя", "user@example.com");

    expect(result).toEqual({
      user: { id: 1, name: "Новое имя", email: "user@example.com" },
      emailChanged: false,
    });
  });

  it("updateProfile помечает emailChanged при смене email", async () => {
    vi.mocked(prisma.users.findUnique)
      .mockResolvedValueOnce(mockUser({ id: 1, email: "old@example.com" }))
      .mockResolvedValueOnce(null);
    vi.mocked(prisma.users.update).mockResolvedValue(
      mockUpdatedUser({
        id: 1,
        name: "Олег",
        email: "new@example.com",
      }),
    );

    const result = await updateProfile(1, "Олег", "new@example.com");

    expect(result.emailChanged).toBe(true);
    expect(result.user.email).toBe("new@example.com");
  });

  it("updateProfile возвращает email_taken", async () => {
    vi.mocked(prisma.users.findUnique)
      .mockResolvedValueOnce(mockUser({ id: 1, email: "old@example.com" }))
      .mockResolvedValueOnce(mockUser({ id: 2 }));

    await expect(
      updateProfile(1, "Олег", "busy@example.com"),
    ).rejects.toMatchObject({ code: "email_taken" });
  });

  it("updateProfile возвращает user_not_found", async () => {
    vi.mocked(prisma.users.findUnique).mockResolvedValue(null);

    await expect(
      updateProfile(99, "Олег", "user@example.com"),
    ).rejects.toMatchObject({ code: "user_not_found" });
  });

  it("changePassword обновляет хэш при верном текущем пароле", async () => {
    const passwordHash = await hashPassword("old-pass");
    vi.mocked(prisma.users.findUnique).mockResolvedValue(
      mockUser({ id: 1, password_hash: passwordHash }),
    );
    vi.mocked(prisma.users.update).mockResolvedValue(
      mockUpdatedUser({ id: 1, password_hash: "new-hash" }),
    );

    await changePassword(1, "old-pass", "new-pass-12");

    expect(prisma.users.update).toHaveBeenCalledOnce();
    const updateArgs = vi.mocked(prisma.users.update).mock.calls[0]?.[0];
    expect(updateArgs?.where).toEqual({ id: 1 });
    expect(updateArgs?.data?.password_hash).toEqual(expect.any(String));
  });

  it("changePassword возвращает invalid_password", async () => {
    const passwordHash = await hashPassword("old-pass");
    vi.mocked(prisma.users.findUnique).mockResolvedValue(
      mockUser({ id: 1, password_hash: passwordHash }),
    );

    await expect(
      changePassword(1, "wrong-pass", "new-pass-12"),
    ).rejects.toMatchObject({ code: "invalid_password" });
  });

  it("deleteAccount удаляет пользователя при верном пароле", async () => {
    const passwordHash = await hashPassword("secret12");
    vi.mocked(prisma.users.findUnique).mockResolvedValue(
      mockUser({ id: 1, password_hash: passwordHash }),
    );
    vi.mocked(prisma.users.delete).mockResolvedValue(
      mockDeletedUser({
        id: 1,
        name: "Олег",
        email: "user@example.com",
        password_hash: passwordHash,
        created_at: new Date(),
      }),
    );

    const result = await deleteAccount(1, "secret12");

    expect(result).toEqual({ ok: true });
    expect(prisma.users.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("deleteAccount возвращает invalid_password", async () => {
    const passwordHash = await hashPassword("secret12");
    vi.mocked(prisma.users.findUnique).mockResolvedValue(
      mockUser({ id: 1, password_hash: passwordHash }),
    );

    await expect(deleteAccount(1, "wrong-pass")).rejects.toMatchObject({
      code: "invalid_password",
    });
  });
});