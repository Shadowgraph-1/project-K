import { useLocation } from "react-router-dom";
import { cn } from "@/shared/lib/utils";
import Session from "./Session";
import NewWorkspace from "./NewWorkspace";
import SessionWorkspace from "./SessionWorkspace";
import { SessionRoutePlaceholder } from "./SessionRoutePlaceholder";
import { SESSION_ROUTE_PLACEHOLDERS } from "../model/sessionPaths";

type SessionMainAreaProps = {
  inWorkspaceFlow: boolean;
  isNewWorkspace: boolean;
  modelIndex: number;
  character: string;
  onCharacterChange: (id: string) => void;
};

export function SessionMainArea({
  inWorkspaceFlow,
  isNewWorkspace,
  modelIndex,
  character,
  onCharacterChange,
}: SessionMainAreaProps) {
  const location = useLocation();
  const path = location.pathname;
  const placeholder = SESSION_ROUTE_PLACEHOLDERS[path];

  if (placeholder) {
    return (
      <div
        className={cn(
          "relative flex min-h-0 flex-1 flex-col p-6 [scrollbar-gutter:stable]",
          "overflow-auto",
        )}
      >
        <SessionRoutePlaceholder
          title={placeholder.title}
          description={placeholder.description}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex min-h-0 flex-1 flex-col p-6 [scrollbar-gutter:stable]",
        inWorkspaceFlow ? "overflow-y-auto" : "overflow-auto",
      )}
    >
      <div className="pointer-events-none absolute top-4 right-5 z-20 flex justify-end" />
      {inWorkspaceFlow ? (
        isNewWorkspace ? (
          <NewWorkspace />
        ) : (
          <SessionWorkspace
            modelIndex={modelIndex}
            character={character}
            onCharacterChange={onCharacterChange}
          />
        )
      ) : (
        <Session />
      )}
    </div>
  );
}
