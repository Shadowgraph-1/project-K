import { api } from "../client";

export type SearchResult = {
  workspaces: Array<{ id: string; publicKey: string; name: string }>;
  tasks: Array<{
    id: string;
    title: string;
    workspaceId: string;
    workspacePublicKey: string;
    workspaceName: string;
  }>;
};

type SearchApiResponse = {
  workspaces: SearchResult["workspaces"];
  tasks: Array<{
    id: string;
    title: string;
    workspace_id: string;
    workspaces: { publicKey: string; name: string };
  }>;
};

export async function searchOnApi(q: string, limit = 20): Promise<SearchResult> {
  const { data } = await api.get<SearchApiResponse>("/search", {
    params: { q, limit },
  });

  return {
    workspaces: data.workspaces,
    tasks: data.tasks.map((task) => ({
      id: task.id,
      title: task.title,
      workspaceId: task.workspace_id,
      workspacePublicKey: task.workspaces.publicKey,
      workspaceName: task.workspaces.name,
    })),
  };
}
