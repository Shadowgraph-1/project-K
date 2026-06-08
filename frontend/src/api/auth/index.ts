import { api } from "../client";

export async function createUserOnApi(payload: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string
}) {
    const { data } = await api.post("/auth/register", payload);
    return data
}

export async function loginUserOnApi(payload: {
    email: string,
    password: string,
}) {
    const { data } = await api.post(`/auth/login`, payload);
    return data;
}

export async function deleteAccountOnApi(password: string) {
    await api.delete("/users/me", {
        data: { password },
    });
}