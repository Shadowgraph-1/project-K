import { useEffect, useRef } from "react";

import type {
  Live2DFollowPointerTarget,
  Live2DLookAtPointer,
} from "./live2dPointerFollow";
import { LAppDelegate } from "./sample/lappdelegate";

type Live2DCanvasProps = {
  className?: string;
  lookAtPointer?: Live2DLookAtPointer;
  followPointerTarget?: Live2DFollowPointerTarget;
  modelIndex?: number;
  showModel?: boolean;
};

function Live2DCanvas({
  className,
  lookAtPointer = "whilePressed",
  followPointerTarget = "canvas",
  modelIndex = 0,
  showModel,
}: Live2DCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const delegate = LAppDelegate.getInstance();

    if (!delegate.initialize(container)) {
      return;
    }

    delegate.setPointerFollow(lookAtPointer, followPointerTarget);
    delegate.run();

    return () => {
      LAppDelegate.releaseInstance();
      container.replaceChildren();
    };
  }, [showModel, lookAtPointer, followPointerTarget]);

  useEffect(() => {
    LAppDelegate.getInstance().setPointerFollow(
      lookAtPointer,
      followPointerTarget,
    );
  }, [lookAtPointer, followPointerTarget]);

  useEffect(() => {
    LAppDelegate.getInstance().setModelSceneIndex(modelIndex);
  }, [modelIndex]);

  return showModel ? (
    <div
      ref={containerRef}
      className={className}
    />
  ) : null;
}

export default Live2DCanvas;
