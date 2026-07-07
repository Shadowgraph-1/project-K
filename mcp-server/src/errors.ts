export class KonoApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = "KonoApiError";
  }
}

export function formatToolError(error: unknown): string {
  if (error instanceof KonoApiError) {
    return error.code
      ? `Ошибка Kono (${error.code}): ${error.message}`
      : error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Неизвестная ошибка";
}
