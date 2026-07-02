import { useEffect, useRef, useState } from "react";

import { cn } from "@/shared/lib/utils";

type DemoVideoPlayerProps = {
  src: string;
  title: string;
  className?: string;
  playback?: "viewport";
  onVideoRef?: (node: HTMLVideoElement | null) => void;
};

export function DemoVideoPlayer({
  src,
  title,
  className,
  playback = "viewport",
  onVideoRef,
}: DemoVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (playback !== "viewport") return;

    const frame = frameRef.current;
    const video = videoRef.current;
    if (!frame || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(frame);
    return () => observer.disconnect();
  }, [playback]);

  function handleVideoRef(node: HTMLVideoElement | null) {
    videoRef.current = node;
    onVideoRef?.(node);
  }

  return (
    <div
      ref={frameRef}
      className={cn(
        "overflow-hidden rounded-2xl border border-white/8 bg-[#0a0a0a]",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_24px_48px_-28px_rgba(0,0,0,0.85),0_0_80px_-40px_rgba(99,102,241,0.22)]",
        className,
      )}
    >
      <div
        className="flex items-center border-b border-white/6 bg-white/2 px-3.5 py-2.5"
        aria-hidden
      >
        <span className="ml-auto font-mono text-[11px] uppercase tracking-wider text-white/30">
          Kono
        </span>
      </div>

      <div className="relative w-full bg-[#080808]">
        {!ready ? (
          <div
            className="aspect-video w-full animate-pulse bg-linear-to-r from-white/3 via-white/[0.07] to-white/3"
            aria-hidden
          />
        ) : null}

        <video
          ref={handleVideoRef}
          className={cn(
            "block w-full h-auto transition-opacity duration-500",
            ready ? "relative opacity-100" : "absolute inset-0 size-full opacity-0",
          )}
          src={src}
          aria-label={title}
          title={title}
          muted
          loop
          playsInline
          preload="metadata"
          onLoadStart={() => setReady(false)}
          onLoadedMetadata={() => setReady(true)}
        />
      </div>
    </div>
  );
}
