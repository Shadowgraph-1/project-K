/**
 * Ссылка «Сессия» в сайдбаре: сохраняем открытый воркспейс, если мы на его странице.
 */
export function sessionHomeHref(cardId: string | undefined) {
  if (cardId) {
    return `/session/workspace/${cardId}`;
  }
  return "/session";
}
