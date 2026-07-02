import { z } from "zod";

export const searchQuerySchema = z.object({
    q: z.string().trim().min(1).max(50),
    limit: z.coerce.number().int().min(1).max(30).optional().default(20),
});