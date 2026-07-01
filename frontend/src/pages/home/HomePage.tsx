import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "@/widgets/header/ui/Header";
import AboutKonoSection from "./ui/sections/AboutKonoSection";
import MainSection from "./ui/sections/MainSection";
import GetStartedSection from "./ui/sections/GetStartedSection";
import FeaturesSection from "./ui/sections/FeaturesSection";
import Footer from "@/widgets/footer/ui/Footer";
import { refreshHomeAos, useHomeAos } from "@/hooks/use-home-aos";
import "./home.css";

export function HomePage() {
  const location = useLocation();
  useHomeAos();

  useEffect(() => {
    if (location.pathname !== "/") return;
    const id = location.hash.replace(/^#/, "");
    if (!id) return;
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      refreshHomeAos();
    }, 80);
    return () => window.clearTimeout(t);
  }, [location.pathname, location.hash]);

  return (
    <main className="min-h-0 flex flex-1 flex-col bg-black">
      <Header />
      <MainSection />
      <AboutKonoSection />
      <FeaturesSection />
      <GetStartedSection />
      <Footer />
    </main>
  );
}
