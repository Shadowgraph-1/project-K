import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { setRouterNavigate } from "@/shared/lib/router-navigation";

export function RouterNavigation() {
  const navigate = useNavigate();

  useEffect(() => {
    setRouterNavigate(navigate);
  }, [navigate]);

  return null;
}