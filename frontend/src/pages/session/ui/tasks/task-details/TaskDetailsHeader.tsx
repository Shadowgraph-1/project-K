import type { Task } from "@/entities/task/model/types";
import { TaskDescription } from "./TaskDescription";

export function TaskDetailsHeader({ task }: { task: Task }) {
  if (!task.description?.trim()) {
    return (
      <p className="text-[15px] leading-relaxed text-muted-foreground/45">
        Добавьте описание…
      </p>
    );
  }

  return <TaskDescription text={task.description} />;
}
