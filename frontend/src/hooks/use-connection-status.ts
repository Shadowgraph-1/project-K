import { useState, useEffect, useCallback } from "react";
import { api } from "@/api/client";
import { fetchHealth } from "@/api/health";
import { queryClient } from "@/shared/api/query-client";

export function useConnectionStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  const [serverDown, setServerDown] = useState(false);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (res) => {
        setServerDown(false);
        return res;
      },
      (error) => {
        if (!error.response) setServerDown(true);
        return Promise.reject(error);
      },
    );
    return () => api.interceptors.response.eject(interceptor);
  }, []);

  const retryConnection = useCallback(async () => {
    const isOnline = navigator.onLine;
    setOnline(isOnline);
    if (!isOnline) throw new Error("offline");

    await fetchHealth();
    setServerDown(false);
    await queryClient.invalidateQueries();
  }, []);

  return {
    online,
    serverDown,
    anyDown: !online || serverDown,
    retryConnection,
  };
}
