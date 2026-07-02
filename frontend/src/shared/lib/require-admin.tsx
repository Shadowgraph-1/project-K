import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAdminAccessQuery } from "@/hooks/use-admin-query";
import { RequireAdminSkeleton } from "@/pages/session/ui/skeletons/session-skeletons";

type RequireAdminProps = {
  children: ReactNode;
};

export function RequireAdmin({ children }: RequireAdminProps) {
  const { data, isLoading, isError } = useAdminAccessQuery();
  const location = useLocation();

  if (isLoading) {
    return <RequireAdminSkeleton />;
  }

  if (isError || !data?.isAdmin) {
    return (
      <Navigate
        to="/projects"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <>{children}</>;
}
