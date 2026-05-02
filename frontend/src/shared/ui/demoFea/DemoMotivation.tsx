import { MOTIVATION_ITEMS } from "@/const/motivationItems"

type DemoMotivationProps = {
  completedTodoCount: number;
  totalTodosCount: number;
}

const ProgressBar = ({ current, total }: { current: number; total: number }) => {
  const percent = total === 0 ? 0 : Math.round((current / total) * 100)

  return (
    <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-100">
      <div
        className="h-full rounded-full bg-neutral-950 transition-all duration-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

function DemoMotivation({ completedTodoCount, totalTodosCount }: DemoMotivationProps) {
    const todoMotivation = {
      id: 1,
      name: "Выполни ToDo-задачи",
      description:
        completedTodoCount === totalTodosCount
          ? "цель выполнена, забери награду"
          : `осталось ${totalTodosCount - completedTodoCount} задания для достижения цели`,
      current: completedTodoCount,
      total: totalTodosCount,
    }
    const motivationItems = [todoMotivation, ...MOTIVATION_ITEMS]

    return (
      <div className="space-y-4">
        {motivationItems.map((m) => (
          <div key={m.id} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-base font-semibold text-neutral-950">{m.name}</h3>
              <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600">
                {m.current}/{m.total}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-neutral-600">{m.description}</p>
            <ProgressBar current={m.current} total={m.total} />
          </div>
        ))}
      </div>
    )
  }

export default DemoMotivation;
