import { useMemo, useState } from "react";

import type { SubtaskStatus } from "@/api/subtasks";
import type { TaskActivity } from "@/api/task-activity";
import {
  useCreateSubtaskMutation,
  useDeleteSubtaskMutation,
  useSubtasksQuery,
  useUpdateSubtaskMutation,
} from "@/entities/subtask/model/use-subtasks-query";
import type { Task } from "@/entities/task/model/types";
import {
  useClearTaskActivityMutation,
  useCreateTaskActivityMutation,
  useTaskActivityQuery,
} from "@/entities/task/model/use-task-activity-query";
import { ActivitySection } from "../task-activity/ActivitySection";
import type { ActivityInlineReplyState } from "../task-activity/ActivityInlineReply";
import { TaskDescription } from "./TaskDescription";
import { TaskStatusHistoryTimeline } from "./TaskStatusHistoryTimeline";
import { TaskSubtaskSection } from "./TaskSubtaskSection";

type TaskDetailsMainProps = {
  task: Task;
};

export function TaskDetailsMain({ task }: TaskDetailsMainProps) {
  const [commentText, setCommentText] = useState("");
  const [inlineReplyTarget, setInlineReplyTarget] =
    useState<TaskActivity | null>(null);
  const [inlineReplyText, setInlineReplyText] = useState("");

  const { data: subtasks = [], isLoading: subtasksLoading } = useSubtasksQuery(
    task.id,
  );
  const createSubtask = useCreateSubtaskMutation();
  const updateSubtask = useUpdateSubtaskMutation();
  const deleteSubtask = useDeleteSubtaskMutation();

  const { data: activity = [], isLoading: activityLoading } =
    useTaskActivityQuery(task.id);

  const feedItems = useMemo(
    () => activity.filter((item) => item.type !== "task.created"),
    [activity],
  );

  const createCommentMutation = useCreateTaskActivityMutation();
  const clearActivityMutation = useClearTaskActivityMutation();

  const handleSubmitComment = () => {
    const body = commentText.trim();
    if (!body || createCommentMutation.isPending) return;

    createCommentMutation.mutate(
      {
        taskId: task.id,
        body,
      },
      {
        onSuccess: () => setCommentText(""),
      },
    );
  };

  const handleSubmitInlineReply = () => {
    const body = inlineReplyText.trim();
    if (!body || !inlineReplyTarget || createCommentMutation.isPending) return;

    createCommentMutation.mutate(
      {
        taskId: task.id,
        body,
        parentActivityId: inlineReplyTarget.id,
      },
      {
        onSuccess: () => {
          setInlineReplyText("");
          setInlineReplyTarget(null);
        },
      },
    );
  };

  const handleReply = (item: TaskActivity) => {
    if (inlineReplyTarget?.id === item.id) {
      setInlineReplyTarget(null);
      setInlineReplyText("");
      return;
    }

    setInlineReplyTarget(item);
    setInlineReplyText("");
  };

  const handleCancelInlineReply = () => {
    setInlineReplyTarget(null);
    setInlineReplyText("");
  };

  const isInlineSending =
    createCommentMutation.isPending &&
    Boolean(createCommentMutation.variables?.parentActivityId);
  const isRootSending =
    createCommentMutation.isPending &&
    !createCommentMutation.variables?.parentActivityId;

  const inlineReply: ActivityInlineReplyState = {
    targetId: inlineReplyTarget?.id ?? null,
    text: inlineReplyText,
    sending: isInlineSending,
    onTextChange: setInlineReplyText,
    onSubmit: handleSubmitInlineReply,
    onCancel: handleCancelInlineReply,
  };

  const description = task.description?.trim();

  return (
    <div className="task-details-layout flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <main className="session-panel-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain bg-background">
        <div className="mx-auto w-full max-w-3xl px-6 py-6 lg:px-8 lg:py-8">
          <div className="flex flex-col gap-8 pb-4">
            {description ? (
              <section className="space-y-2">
                <h2 className="text-sm font-medium text-foreground">
                  Описание
                </h2>
                <TaskDescription text={description} />
              </section>
            ) : null}
            <TaskStatusHistoryTimeline taskId={task.id} />
            <TaskSubtaskSection
              subtasks={subtasks}
              loading={subtasksLoading}
              onCreate={(title) =>
                void createSubtask.mutateAsync({ taskId: task.id, title })
              }
              onStatusChange={(id, status: SubtaskStatus) =>
                void updateSubtask.mutateAsync({
                  id,
                  taskId: task.id,
                  patch: { status },
                })
              }
              onDelete={(id) =>
                void deleteSubtask.mutateAsync({ id, taskId: task.id })
              }
            />
            <ActivitySection
              activity={feedItems}
              activityLoading={activityLoading}
              onClear={() => void clearActivityMutation.mutateAsync(task.id)}
              onReply={handleReply}
              commentText={commentText}
              onCommentTextChange={setCommentText}
              onSubmitComment={handleSubmitComment}
              sending={isRootSending}
              inlineReply={inlineReply}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
