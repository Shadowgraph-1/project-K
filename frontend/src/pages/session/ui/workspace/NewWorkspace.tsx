import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Briefcase,
  FolderKanban,
  GraduationCap,
} from "lucide-react";

import { useCreateWorkspaceMutation } from "@/entities/workspace/model/use-workspace-query";
import { sessionPillOutline } from "@/pages/session/lib/session-styles";
import { FIELD_LIMITS } from "@/shared/constants/field-limits";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { notify } from "@/shared/lib/notify";
import { Spinner } from "@/shared/ui/spinner";
import { cn } from "@/shared/lib/utils";
import { SESSION_PATHS } from "../../model/sessionPaths";

const PRESETS = [
  {
    title: "Диплом",
    description: "Курсовая, ВКР или исследование",
    icon: <GraduationCap />,
    iconClassName:
      "bg-[#E6F0FC] text-[#296BD6] dark:bg-blue-500/15 dark:text-blue-400",
  },
  {
    title: "Работа",
    description: "Команда, задачи и сроки",
    icon: <Briefcase />,
    iconClassName:
      "bg-[#FFF6F2] text-[#E38656] dark:bg-orange-500/15 dark:text-orange-400",
  },
  {
    title: "Личное",
    description: "Свои задачи и планы",
    icon: <FolderKanban />,
    iconClassName:
      "bg-[#E3F5E8] text-[#1A854D] dark:bg-emerald-500/15 dark:text-emerald-400",
  },
] as const;

function PresetRow({
  title,
  description,
  icon,
  iconClassName,
  active,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconClassName: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={title}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "group flex w-full cursor-pointer items-center gap-3 py-3 pl-2 pr-3 text-left",
        "transition-colors duration-150 hover:bg-muted/45",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        active && "bg-muted/35",
      )}
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full [&_svg]:size-4",
          iconClassName,
        )}
      >
        {icon}
      </span>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <p className="shrink-0 text-sm font-medium tracking-[-0.3px] text-foreground">
          {title}
        </p>
        <p className="min-w-0 truncate text-sm font-medium tracking-[-0.3px] text-muted-foreground">
          {description}
        </p>
        <span
          aria-hidden
          className={cn(
            "ml-auto flex shrink-0 items-center gap-1.5 text-sm font-medium tracking-[-0.3px] text-muted-foreground",
            "opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100",
            active && "opacity-100",
          )}
        >
          Выбрать
          <ArrowRight className="size-3.5" />
        </span>
      </div>
    </button>
  );
}

function NewWorkspace() {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const createWorkspace = useCreateWorkspaceMutation();

  const trimmed = title.trim();
  const canCreate = trimmed.length > 0 && !createWorkspace.isPending;

  async function handleCreate() {
    if (!canCreate) return;

    try {
      const created = await createWorkspace.mutateAsync(trimmed);
      navigate(SESSION_PATHS.workspace(created.publicKey));
    } catch {
      notify({
        title: "Не удалось создать проект",
        variant: "error",
      });
    }
  }

  function pickPreset(name: string) {
    setTitle(name);
    requestAnimationFrame(() => {
      document.getElementById("workspace-title")?.focus();
    });
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <section className="flex flex-col items-center gap-6">
          <div className="space-y-1 text-center">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Создайте проект
            </h2>
            <p className="text-sm text-muted-foreground">
              Выберите шаблон или введите своё название
            </p>
          </div>

          <section className="w-full">
            <div className="flex w-full flex-col divide-y divide-border/50">
              {PRESETS.map(({ title, description, icon, iconClassName }) => (
                <PresetRow
                  key={title}
                  title={title}
                  description={description}
                  icon={icon}
                  iconClassName={iconClassName}
                  active={trimmed === title}
                  onClick={() => pickPreset(title)}
                />
              ))}
            </div>
          </section>

          <div className="flex w-full max-w-md flex-col gap-3">
            <div className="flex items-center gap-2 rounded-full bg-transparent p-1.5 pl-4 ring-1 ring-border/35 focus-within:ring-2 focus-within:ring-foreground/10">
              <div className="min-w-0 flex-1">
                <Input
                  id="workspace-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Название проекта"
                  maxLength={FIELD_LIMITS.workspaceName}
                  className="h-9 w-full border-0 bg-transparent px-0 shadow-none ring-0 focus-visible:border-transparent focus-visible:ring-0 dark:bg-transparent"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void handleCreate();
                  }}
                />
              </div>
              <Button
                type="button"
                className="h-9 shrink-0 rounded-full px-4"
                disabled={!canCreate}
                onClick={() => void handleCreate()}
              >
                {createWorkspace.isPending ? <Spinner /> : "Создать"}
              </Button>
            </div>

            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                className={cn(sessionPillOutline, "h-9 gap-1.5 rounded-full px-4")}
                onClick={() => navigate(SESSION_PATHS.sessionRoot)}
              >
                <ArrowLeft className="size-4" />
                К проектам
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default NewWorkspace;
