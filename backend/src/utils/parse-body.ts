import type { ZodType } from "zod";

export function parseBody<T>(schema: ZodType<T>, body: unknown): T {
    const result = schema.safeParse(body);
    if (!result.success) {
        throw result.error;
    }
    return result.data;
}