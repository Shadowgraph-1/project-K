export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? '',
  isDev: import.meta.env.DEV,
} as const
