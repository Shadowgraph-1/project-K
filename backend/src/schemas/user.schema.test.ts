import { describe, expect, it } from "vitest";

import {
  changePasswordSchema,
  deleteAccountSchema,
  updateProfileSchema,
} from "./user.schema.js";

describe("user.schema", () => {
  it("updateProfileSchema принимает валидный профиль", () => {
    const result = updateProfileSchema.safeParse({
      name: "Олег",
      email: "user@example.com",
    });

    expect(result.success).toBe(true);
  });

  it("updateProfileSchema отклоняет пустое имя", () => {
    const result = updateProfileSchema.safeParse({
      name: "",
      email: "user@example.com",
    });

    expect(result.success).toBe(false);
  });

  it("changePasswordSchema требует совпадения паролей", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "old-pass",
      newPassword: "new-pass",
      confirmPassword: "other-pass",
    });

    expect(result.success).toBe(false);
  });

  it("changePasswordSchema принимает совпадающие пароли", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "old-pass",
      newPassword: "new-pass",
      confirmPassword: "new-pass",
    });

    expect(result.success).toBe(true);
  });

  it("deleteAccountSchema требует пароль", () => {
    const result = deleteAccountSchema.safeParse({ password: "" });

    expect(result.success).toBe(false);
  });
});