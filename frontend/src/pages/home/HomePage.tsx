import { Header } from "@/shared/ui/Header";
import MainSection from "../section/MainSection";
import HowItWorksSection from "../section/HowItWorksSection";
import FeaturesSection from "../section/FeaturesSection";
import RewardsSection from "../section/RewardsSection";
import TimerSection from "../section/TimerSection";
import HistorySection from "../section/HistorySection";
import Footer from "@/shared/ui/Footer";
import Assistant from "@/shared/ui/Assistant";

export function HomePage() {
  return (
    <main className="min-h-0 flex flex-1 flex-col bg-white">
      <Header />
      <MainSection />
      <FeaturesSection />
      <HowItWorksSection />
      <RewardsSection />
      <TimerSection />
      <HistorySection />
      <Assistant />
      <Footer />
    </main>
  );
}
