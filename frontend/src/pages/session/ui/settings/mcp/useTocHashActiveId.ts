import { useCallback, useEffect, useMemo, useState } from "react";

/** Активный пункт TOC только по hash (клик по якорю), без scroll-spy. */
export function useTocHashActiveId(sectionIds: readonly string[]) {
  const idSet = useMemo(() => new Set(sectionIds), [sectionIds]);

  const readHash = useCallback(() => {
    const hash = window.location.hash.slice(1);
    return idSet.has(hash) ? hash : "";
  }, [idSet]);

  const [activeId, setActiveId] = useState(readHash);

  useEffect(() => {
    const sync = () => setActiveId(readHash());
    window.addEventListener("hashchange", sync);
    sync();
    return () => window.removeEventListener("hashchange", sync);
  }, [readHash]);

  return activeId;
}
