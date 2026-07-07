export const TELEGRAM_DEFAULT_CHAT_EMAIL = "litvin4chuk@mail.ru";

export function usesDefaultTelegramChatId(email: string | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase() === TELEGRAM_DEFAULT_CHAT_EMAIL.toLowerCase();
}

export function isValidTelegramChatId(value: string): boolean {
  return /^-?\d+$/.test(value.trim());
}