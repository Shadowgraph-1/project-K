import { Outlet } from "react-router-dom";

import { Header } from "@/widgets/header/ui/Header";
import Footer from "@/widgets/footer/ui/Footer";

import "../home/home.css";
import "./docs.css";

export function DocsLayout() {
  return (
    <div className="docs-page dark flex min-h-svh flex-col bg-black text-white">
      <Header />
      <div className="flex flex-1 flex-col pt-16">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}