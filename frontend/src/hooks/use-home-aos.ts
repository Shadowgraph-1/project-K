import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const AOS_OPTIONS = {
  duration: 700,
  easing: "ease-out-cubic",
  once: true,
  offset: 64,
  anchorPlacement: "top-bottom" as const,
};

export function useHomeAos() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    AOS.init({
      ...AOS_OPTIONS,
      disable: reducedMotion,
    });

    refreshHomeAos();

    return () => {
      document.querySelectorAll(".aos-animate").forEach((el) => {
        el.classList.remove("aos-animate");
      });
    };
  }, []);
}

export function refreshHomeAos() {
  window.requestAnimationFrame(() => {
    AOS.refresh();
  });
}
