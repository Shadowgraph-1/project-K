import { KonoApiError } from "./errors.js";

type RequestOptions = {
  query?: Record<string, string | undefined>;
  body?: unknown;
};

export type WorkspaceDto = {
  id: string;
  name: string;
  publicKey: string;
  kind?: "owned" | "shared";
  myRole?: string;
};

export type TaskDto = {
  id: string;
  title: string;
  description?: string;
  tags?: string | null;
  startDate?: string | null;
  dueDate?: string | null;
  creator?: string | null;
  status: string;
  workspaceId: string;
  createdAt?: string;
};

export type SubtaskDto = {
  id: string;
  taskId: string;
  userId?: number | null;
  title: string;
  status: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type ActivityDto = {
  id: string;
  taskId: string;
  body: string;
  title: string;
  type: string;
  createdAt?: string;
};

export class KonoApiClient {
  constructor(
    private readonly baseUrl: string,
    private readonly apiKey: string,
  ) {}

  private buildUrl(path: string, query?: Record<string, string | undefined>) {
    const url = new URL(
      `${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`,
    );

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== "") {
          url.searchParams.set(key, value);
        }
      }
    }

    return url;
  }

  async request<T>(
    method: string,
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const response = await fetch(this.buildUrl(path, options.query), {
      method,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: "application/json",
        ...(options.body !== undefined
          ? { "Content-Type": "application/json" }
          : {}),
      },
      body:
        options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });

    const text = await response.text();
    let payload: unknown = null;

    if (text) {
      try {
        payload = JSON.parse(text) as unknown;
      } catch {
        payload = text;
      }
    }

    if (!response.ok) {
      const code =
        typeof payload === "object" &&
        payload !== null &&
        "error" in payload &&
        typeof (payload as { error: unknown }).error === "string"
          ? (payload as { error: string }).error
          : undefined;

      const message =
        typeof payload === "object" &&
        payload !== null &&
        "message" in payload &&
        typeof (payload as { message: unknown }).message === "string"
          ? (payload as { message: string }).message
          : `Kono API ${response.status}`;

      throw new KonoApiError(message, response.status, code);
    }

    return payload as T;
  }

  listWorkspaces() {
    return this.request<WorkspaceDto[]>("GET", "/workspaces");
  }

  createWorkspace(name: string) {
    return this.request<WorkspaceDto>("POST", "/workspaces", {
      body: { name },
    });
  }

  listTasks(workspaceId: string, status?: string) {
    return this.request<TaskDto[]>("GET", "/tasks", {
      query: { workspaceId, status },
    });
  }

  createTask(input: {
    workspaceId: string;
    title: string;
    creator?: string;
  }) {
    return this.request<TaskDto>("POST", "/tasks", { body: input });
  }

  updateTask(taskId: string, patch: Record<string, unknown>) {
    return this.request<TaskDto>("PATCH", `/tasks/${taskId}`, { body: patch });
  }

  deleteTask(taskId: string) {
    return this.request<{ ok: true }>("DELETE", `/tasks/${taskId}`);
  }

  listSubtasks(taskId: string) {
    return this.request<SubtaskDto[]>("GET", `/tasks/${taskId}/subtasks`);
  }

  createSubtask(taskId: string, title: string) {
    return this.request<SubtaskDto>("POST", `/tasks/${taskId}/subtasks`, {
      body: { title },
    });
  }

  updateSubtask(subtaskId: string, patch: Record<string, unknown>) {
    return this.request<SubtaskDto>("PATCH", `/subtasks/${subtaskId}`, {
      body: patch,
    });
  }

  deleteSubtask(subtaskId: string) {
    return this.request<{ ok: true }>("DELETE", `/subtasks/${subtaskId}`);
  }

  addTaskComment(
    taskId: string,
    body: string,
    parentActivityId?: string,
  ) {
    return this.request<ActivityDto>("POST", `/tasks/${taskId}/activity`, {
      body: { body, parentActivityId },
    });
  }

  search(query: string, limit = 20) {
    return this.request<unknown>("GET", "/search", {
      query: { q: query, limit: String(limit) },
    });
  }
}