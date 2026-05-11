import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { AuthModalContent } from "@/features/auth/ui/AuthModalContent";
import { HomePage } from "@/pages/home/HomePage";
import { useModalStore } from "@/shared/model/useModalStore";
import { Modal } from "@/shared/ui/Modal";
import ProfilePage from "@/pages/profile/ProfilePage";
import NotFoundPage from "@/pages/not-found/NotFoundPage";
import SessionPage from "@/pages/session/SessionPage";

function RootLayout() {
  const authModalMode = useModalStore((state) => state.authModalMode);
  const closeAuthModal = useModalStore((state) => state.closeAuthModal);

  return (
    <div className="flex min-h-dvh flex-col bg-white font-sans text-neutral-900 antialiased">
      <Outlet />
      <Modal open={authModalMode !== null} onClose={closeAuthModal}>
        {authModalMode && <AuthModalContent mode={authModalMode} />}
      </Modal>
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/session/workspace/new", element: <SessionPage /> },
      { path: "/session/workspace/:cardId", element: <SessionPage /> },
      { path: "/session/tasks", element: <SessionPage /> },
      { path: "/session/projects", element: <SessionPage /> },
      { path: "/session/kanban", element: <SessionPage /> },
      { path: "/session/team/members", element: <SessionPage /> },
      { path: "/session/team/sprints", element: <SessionPage /> },
      { path: "/session", element: <SessionPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}