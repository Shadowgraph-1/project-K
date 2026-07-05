import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import { HomePage } from "@/pages/home/HomePage";
import { DocsLayout } from "@/pages/docs/DocsLayout";
import { LegacyDocsRedirect } from "@/pages/docs/LegacyDocsRedirect";
import { Toaster } from "@/shared/ui/sonner";
import { RequireAdmin } from "@/shared/lib/require-admin";
import SubscribePage from "@/pages/subscribe/SubscribePage";

const AuthPage = lazy(() =>
  import("@/pages/auth/AuthPage").then((m) => ({ default: m.AuthPage })),
);
const NotFoundPage = lazy(() => import("@/pages/not-found/NotFoundPage"));
const SessionPage = lazy(() => import("@/pages/session/SessionPage"));
const McpDocsPage = lazy(() =>
  import("@/pages/session/ui/settings/McpDocsPage").then((m) => ({
    default: m.McpDocsPage,
  })),
);
const ConnectorsDocsPage = lazy(() =>
  import("@/pages/session/ui/connectors/ConnectorsDocsPage").then((m) => ({
    default: m.ConnectorsDocsPage,
  })),
);
const LlmKeysDocsPage = lazy(() =>
  import("@/pages/session/ui/settings/LlmKeysDocsPage").then((m) => ({
    default: m.LlmKeysDocsPage,
  })),
);

function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background font-sans text-foreground antialiased">
      <Outlet />
      <Toaster />
    </div>
  );
}

function RouteFallback() {
  return (
    <div
      className="flex min-h-svh items-center justify-center bg-background"
      aria-hidden
    >
      <div className="size-5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground/70" />
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <AuthPage mode="login" /> },
      { path: "/register", element: <AuthPage mode="register" /> },
      { path: "/subscribe", element: <SubscribePage /> },
      {
        path: "/docs",
        element: <DocsLayout />,
        children: [
          {
            path: "mcp",
            element: (
              <Suspense fallback={<RouteFallback />}>
                <McpDocsPage />
              </Suspense>
            ),
          },
          {
            path: "connectors",
            element: (
              <Suspense fallback={<RouteFallback />}>
                <ConnectorsDocsPage />
              </Suspense>
            ),
          },
          {
            path: "api-keys",
            element: (
              <Suspense fallback={<RouteFallback />}>
                <LlmKeysDocsPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/projects/mcp/docs",
        element: <LegacyDocsRedirect />,
      },
      {
        path: "/projects/connectors/docs",
        element: <LegacyDocsRedirect />,
      },
      {
        path: "/projects/api-keys/docs",
        element: <LegacyDocsRedirect />,
      },
      {
        path: "/projects/admin",
        element: (
          <Suspense fallback={<RouteFallback />}>
            <RequireAdmin>
              <SessionPage />
            </RequireAdmin>
          </Suspense>
        ),
      },
      {
        path: "/projects/*",
        element: (
          <Suspense fallback={<RouteFallback />}>
            <SessionPage />
          </Suspense>
        ),
      },
      {
        path: "/workspaces/*",
        element: (
          <Suspense fallback={<RouteFallback />}>
            <SessionPage />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<RouteFallback />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
