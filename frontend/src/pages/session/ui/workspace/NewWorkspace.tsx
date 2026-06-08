import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { SESSION_PATHS } from "../../model/sessionPaths";
import { notify } from "../widgets/SonnerWidget";
import { Spinner } from "@/shared/ui/spinner";
import { useCreateWorkspaceMutation } from "@/entities/workspace/model/useWorkspaceStoreQuery";

function NewWorkspace() {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const createWorkspace = useCreateWorkspaceMutation();

  async function handleCreate() {
    const trimmed = title.trim();
    if (!trimmed || createWorkspace.isPending) return;

    try {
      await createWorkspace.mutateAsync(trimmed);
      navigate(SESSION_PATHS.sessionRoot);
    } catch {
      notify({
        title: "Неудалось создать проект",
        variant: "error",
      });
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-none border border-border bg-card p-6 text-card-foreground">
      <div className="space-y-1 border-b border-border pb-4">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Новый проект
        </p>
        <h2 className="text-lg font-semibold tracking-tight">Создание проекта</h2>
        <p className="text-sm text-muted-foreground">
          Проект объединяет задачи и команду.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="workspace-title">Название</Label>
        <Input
          id="workspace-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Диплом, Работа, Проект"
          className="rounded-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCreate();
          }}
        />
      </div>
      <Button        type="button"
        className="rounded-none"
        disabled={!title.trim() || createWorkspace.isPending}
        onClick={() => void handleCreate()}
      >
        {createWorkspace.isPending ? <Spinner /> : "Создать"}
      </Button>
    </div>
  );
}

export default NewWorkspace;
