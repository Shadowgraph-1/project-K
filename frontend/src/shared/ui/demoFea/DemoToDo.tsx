import { CheckCircle2, Circle } from "lucide-react";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

type DemoToDoProps = {
  todos: Todo[];
  onToggleTodo: (id: number) => void;
  locked: boolean;
};

function DemoToDo({ todos, onToggleTodo, locked }: DemoToDoProps) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {todos.map((todo) => {
        const isCompleted = todo.completed;

        return (
          <button
            key={todo.id}
            type="button"
            disabled={locked}
            onClick={() => onToggleTodo(todo.id)}
            className={`flex w-full items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-5 text-left shadow-sm ${
              locked ? "cursor-not-allowed opacity-70" : "hover:bg-neutral-50"
            }`}
          >
            <span
              className={`text-sm font-medium ${
                isCompleted
                  ? "text-neutral-400 line-through"
                  : "text-neutral-950"
              }`}
            >
              {todo.title}
            </span>

            {isCompleted ? (
              <CheckCircle2
                className="shrink-0 text-green-600"
                size={20}
                aria-hidden
              />
            ) : (
              <Circle
                className="shrink-0 text-neutral-400"
                size={20}
                aria-hidden
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default DemoToDo;
