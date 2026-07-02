import { prisma } from "../db/prisma.js";
import { listWorkspaces } from "./workspaces.service.js";

export async function search(
    userId: number,
    q: string,
    limit = 20,
) {
    const workspaces = await listWorkspaces(userId);
    const workspaceIds = workspaces.map((w) => w.id);
    
    const [matchedWorkspaces, matchedTasks] = await Promise.all([
        prisma.workspaces.findMany({
            where: {
                id: { in: workspaceIds},
                name: { contains: q, mode: "insensitive"},
            },
            take: limit,
            select: {
                id: true,
                publicKey: true,
                name: true,
            },
        }),
        prisma.tasks.findMany({
            where: {
                workspace_id: { in: workspaceIds },
                title: { contains: q, mode: 'insensitive'},
            },
            take: limit,
            orderBy: { created_at: "desc"},
            select: {
                id: true,
                title: true,
                workspace_id: true,
                workspaces: {
                    select: {
                        publicKey: true, name: true,
                    },
                },
            },
        }),
    ]);

    return { workspaces: matchedWorkspaces, tasks: matchedTasks};
}