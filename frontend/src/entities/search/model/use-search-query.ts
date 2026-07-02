import { searchOnApi } from "@/api/search";
import { queryKeys } from "@/shared/api/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useSearchQuery(q: string, enabled: boolean) {
    return useQuery({
        queryKey: queryKeys.search(q),
        queryFn: () => searchOnApi(q),
        enabled: enabled && q.trim().length >= 2,
        staleTime: 30_000,
    });
}