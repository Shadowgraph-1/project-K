import type { Prisma } from "../generated/prisma/client.js";
import { isActivityType, type ActivityType } from "../constants/activity-types.js";

export type TaskActivityCreateInput = {
  task_id: string;
  user_id: number;
  type: ActivityType;
  title: string;
  body?: string | null;
  metadata?: Prisma.InputJsonValue;
};

export function createTaskActivityData(
  input: TaskActivityCreateInput,
): Prisma.task_activityUncheckedCreateInput {
  if (!isActivityType(input.type)) {
    throw new Error(`Invalid activity type: ${input.type}`);
  }

  return input;
}
