import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthModalContent } from "@/features/auth/ui/AuthModalContent";
import { HomePage } from "@/pages/home/HomePage";
import { useModalStore } from "@/shared/stores/useModalStore";
import { Modal } from "@/shared/ui/Modal";
import ProfilePage from "@/pages/profile/ProfilePage";
import NotFoundPage from "@/pages/notFound/NotFoundPage";

export function App() {
  const authModalMode = useModalStore((state) => state.authModalMode);
  const closeAuthModal = useModalStore((state) => state.closeAuthModal);

  return (
    <BrowserRouter>
      <div className="flex min-h-dvh flex-col bg-white font-sans text-neutral-900 antialiased">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
  
        <Modal open={authModalMode !== null} onClose={closeAuthModal}>
          {authModalMode && <AuthModalContent mode={authModalMode} />}
        </Modal>
      </div>
    </BrowserRouter>
  );
}
