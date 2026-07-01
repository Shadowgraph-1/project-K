import { memo } from "react";

import type { Task } from "@/entities/task/model/types";
import { TaskDetailsMain } from "./task-details/TaskDetailsMain";

type TaskDetailsPageProps = {
  task: Task;
};

function TaskDetailsPage({ task }: TaskDetailsPageProps) {
  return (
    <article className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background">
      <TaskDetailsMain task={task} />
    </article>
  );
}

export default memo(TaskDetailsPage);
