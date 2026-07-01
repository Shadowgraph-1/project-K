import { QueryClient } from "@tanstack/react-query";

/**
 * Глобальные дефолты для React Query.
 *
 * - `refetchOnWindowFocus: false` — переключение вкладок не должно
 *   рефетчить всё подряд. Точки, где свежесть критична (admin, health,
 *   members), переопределяют это per-query через `refetchOnWindowFocus: true`.
 * - `refetchOnMount: true` — при монтировании компонента данные всегда
 *   подтягиваются, даже если уже есть кэш (но запрос пойдёт только если
 *   кэш `stale` — см. `staleTime`).
 * - `gcTime` — сколько хранить неиспользуемые данные в кэше после
 *   размонтирования последнего наблюдателя. 5 минут — баланс между
 *   отзывчивостью «вернулся на страницу — данные ещё тёплые» и памятью.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: "offlineFirst",
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  },
});
