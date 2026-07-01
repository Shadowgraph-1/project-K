import { api } from "../client";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export async function createUserOnApi(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/register", payload);
  return data;
}

export async function loginUserOnApi(
  payload: LoginPayload,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", payload);
  return data;
}

export async function deleteAccountOnApi(password: string): Promise<void> {
  await api.delete("/users/me", {
    data: { password },
  });
}
