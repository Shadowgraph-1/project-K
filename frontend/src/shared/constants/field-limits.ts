/** Лимиты полей ввода — синхронизированы с backend-схемами где возможно. */
export const FIELD_LIMITS = {
  userName: 20,
  workspaceName: 100,
  taskTitle: 200,
  llmKeyLabel: 64,
  activityComment: 2000,
  assistantMessage: 4000,
} as const;
