import { useEffect, useRef, useState } from "react";

import { cn } from "@/shared/lib/utils";

type DemoVideoPlayerProps = {
  src: string;
  title: string;
  className?: string;
  playback?: "viewport" | "controlled";
  isActive?: boolean;
  restartOnActivate?: boolean;
};

export function DemoVideoPlayer({
  src,
  title,
  className,
  playback = "viewport",
  isActive = false,
  restartOnActivate = false,
}: DemoVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
  }, [src]);

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

  useEffect(() => {
    if (playback !== "controlled") return;

    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      if (restartOnActivate) video.currentTime = 0;
      void video.play().catch(() => undefined);
      return;
    }

    video.pause();
  }, [playback, isActive, src, restartOnActivate]);

  return (
    <div
      ref={frameRef}
      className={cn("demo-video-frame", ready && "demo-video-frame--ready", className)}
    >
      <div className="demo-video-frame__chrome" aria-hidden>
        <span className="demo-video-frame__label">Kono</span>
      </div>

      <div className="demo-video-frame__screen">
        <video
          ref={videoRef}
          className="demo-video-frame__video"
          src={src}
          title={title}
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setReady(true)}
        />
        {!ready ? <div className="demo-video-frame__loader" aria-hidden /> : null}
      </div>
    </div>
  );
}
