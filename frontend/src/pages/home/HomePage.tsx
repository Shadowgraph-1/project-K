import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "@/widgets/header/ui/Header";
import MainSection from "./ui/sections/MainSection";
import HowItWorksSection from "./ui/sections/HowItWorksSection";
import FeaturesSection from "./ui/sections/FeaturesSection";
import Footer from "@/widgets/footer/ui/Footer";

export function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/") return;
    const id = location.hash.replace(/^#/, "");
    if (!id) return;
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
    return () => window.clearTimeout(t);
  }, [location.pathname, location.hash]);

  return (
    <main className="min-h-0 flex flex-1 flex-col bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(0,0,0,0.06),transparent)] from-transparent to-white">
      <Header />
      <MainSection />
      <FeaturesSection />
      <HowItWorksSection />
      <Footer />
    </main>
  );
}
