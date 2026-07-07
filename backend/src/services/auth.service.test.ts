import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../db/prisma.js", () => ({
  prisma: {
    users: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("./feature-flags.service.js", () => ({
  isFeatureEnabled: vi.fn(() => true),
}));

import { prisma } from "../db/prisma.js";
import { isFeatureEnabled } from "./feature-flags.service.js";
import { loginUser, registerUser } from "./auth.service.js";
import { hashPassword } from "../utils/passwordHash.js";

function mockUser<T>(value: T) {
  return value as Awaited<ReturnType<typeof prisma.users.findUnique>>;
}

function mockCreatedUser<T>(value: T) {
  return value as Awaited<ReturnType<typeof prisma.users.create>>;
}

describe("auth.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(isFeatureEnabled).mockReturnValue(true);
  });

  it("registerUser создаёт пользователя при свободном email", async () => {
    vi.mocked(prisma.users.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.users.create).mockResolvedValue(
      mockCreatedUser({
        id: 1,
        name: "Олег",
        email: "user@example.com",
      }),
    );

    const user = await registerUser("Олег", "user@example.com", "secret12");

    expect(user).toEqual({
      id: 1,
      name: "Олег",
      email: "user@example.com",
    });
    expect(prisma.users.create).toHaveBeenCalledOnce();
  });

  it("registerUser возвращает email_taken", async () => {
    vi.mocked(prisma.users.findUnique).mockResolvedValue(mockUser({ id: 2 }));

    await expect(
      registerUser("Олег", "user@example.com", "secret12"),
    ).rejects.toMatchObject({ code: "email_taken" });
  });

  it("registerUser возвращает forbidden при закрытой регистрации", async () => {
    vi.mocked(isFeatureEnabled).mockReturnValue(false);

    await expect(
      registerUser("Олег", "user@example.com", "secret12"),
    ).rejects.toMatchObject({ code: "forbidden" });
  });

  it("loginUser возвращает пользователя при верном пароле", async () => {
    const passwordHash = await hashPassword("secret12");
    vi.mocked(prisma.users.findUnique).mockResolvedValue(
      mockUser({
        id: 3,
        name: "Олег",
        email: "user@example.com",
        password_hash: passwordHash,
      }),
    );

    const user = await loginUser("user@example.com", "secret12");

    expect(user).toEqual({
      id: 3,
      name: "Олег",
      email: "user@example.com",
    });
  });

  it("loginUser возвращает invalid_credentials при неверном пароле", async () => {
    const passwordHash = await hashPassword("secret12");
    vi.mocked(prisma.users.findUnique).mockResolvedValue(
      mockUser({
        id: 3,
        name: "Олег",
        email: "user@example.com",
        password_hash: passwordHash,
      }),
    );

    await expect(loginUser("user@example.com", "wrong-pass")).rejects.toMatchObject(
      { code: "invalid_credentials" },
    );
  });

  it("loginUser возвращает invalid_credentials если пользователь не найден", async () => {
    vi.mocked(prisma.users.findUnique).mockResolvedValue(null);

    await expect(loginUser("missing@example.com", "secret12")).rejects.toMatchObject(
      { code: "invalid_credentials" },
    );
  });
});