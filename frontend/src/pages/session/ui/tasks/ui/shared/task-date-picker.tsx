import {
  ContextMenuSub,
  ContextMenuSubContent,
} from "@/shared/ui/context-menu";
import { Calendar } from "@/shared/ui/calendar";
import { cn } from "@/shared/lib/utils";
import {
  TaskDateFieldIcon,
  TaskDueDateIcon,
  TaskStartDateIcon,
} from "./task-date-icons";
import {
  ContextMenuFieldSubTrigger,
  linearContextMenuContentClass,
} from "./task-context-menu";

export type TaskDateField = "startDate" | "dueDate";

type TaskDatePickerProps = {
  value?: string;
  onChange: (iso: string) => void;
  className?: string;
};

export function TaskDatePicker({ value, onChange, className }: TaskDatePickerProps) {
  return (
    <div
      className={cn(className)}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <Calendar
        mode="single"
        selected={value ? new Date(value) : undefined}
        onSelect={(date) => {
          if (!date) return;
          onChange(date.toISOString());
        }}
      />
    </div>
  );
}

type TaskDateContextMenuFieldsProps = {
  startDate?: string;
  dueDate?: string;
  onDateChange: (field: TaskDateField, iso: string) => void;
};

export function TaskDateContextMenuFields({
  startDate,
  dueDate,
  onDateChange,
}: TaskDateContextMenuFieldsProps) {
  return (
    <ContextMenuSub>
      <ContextMenuFieldSubTrigger
        icon={<TaskDateFieldIcon className="size-4" />}
        label="Дата"
      />
      <ContextMenuSubContent className={linearContextMenuContentClass}>
        <ContextMenuSub>
          <ContextMenuFieldSubTrigger
            icon={<TaskStartDateIcon className="size-3.5" />}
            label="Дата начала"
          />
          <ContextMenuSubContent className="p-0" sideOffset={4}>
            <TaskDatePicker
              value={startDate}
              onChange={(iso) => onDateChange("startDate", iso)}
            />
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuFieldSubTrigger
            icon={<TaskDueDateIcon className="size-3.5" />}
            label="Дата окончания"
          />
          <ContextMenuSubContent className="p-0" sideOffset={4}>
            <TaskDatePicker
              value={dueDate}
              onChange={(iso) => onDateChange("dueDate", iso)}
            />
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
}