import { useQuery } from "@tanstack/react-query";
import { fetchHealth } from "@/api/health";
import { queryKeys } from "@/shared/api/query-keys";

export function useHealthQuery() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: fetchHealth,
    // Статус-страница: свежесть важна, поэтому рефетчим по интервалу и при
    // возврате на вкладку. Глобальный дефолт refetchOnWindowFocus=false
    // переопределяется здесь намеренно.
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
    staleTime: 10_000,
    retry: 1,
  });
}
