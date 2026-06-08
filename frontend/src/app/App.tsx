import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import { LoginForm } from "@/features/auth/ui/login-form";
import { HomePage } from "@/pages/home/HomePage";
import NotFoundPage from "@/pages/not-found/NotFoundPage";
import SessionPage from "@/pages/session/SessionPage";
import { useModalStore } from "@/shared/model/useModalStore";
import {
  Dialog,
  DialogContent,
} from "@/shared/ui/dialog";
import { Toaster } from "@/shared/ui/sonner";

function RootLayout() {
  const authModalMode = useModalStore((state) => state.authModalMode);
  const closeAuthModal = useModalStore((state) => state.closeAuthModal);

  return (
    <div className="flex min-h-svh flex-col bg-background font-sans text-foreground antialiased">
      <Outlet />
      <Toaster />
      <Dialog
        open={authModalMode !== null}
        onOpenChange={(open) => {
          if (!open) closeAuthModal();
        }}
      >
        <DialogContent
          showCloseButton
          className={
            authModalMode === "login"
              ? "max-h-[min(90dvh,900px)] max-w-[calc(100%-2rem)] gap-0 overflow-y-auto p-0 sm:max-w-3xl"
              : "max-h-[min(90dvh,900px)] max-w-[calc(100%-2rem)] gap-0 overflow-y-auto p-0 sm:max-w-md"
          }
        >
          {authModalMode ? (
            <LoginForm mode={authModalMode} />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/projects/workspace/new", element: <SessionPage /> },
      { path: "/project/:workspaceId/members", element: <SessionPage /> },
      { path: "/project/:workspaceId/:taskId", element: <SessionPage /> },
      { path: "/project/:workspaceId", element: <SessionPage /> },
      { path: "/projects/members", element: <SessionPage /> },
      { path: "/projects/tasks", element: <SessionPage /> },
      { path: "/projects", element: <SessionPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
