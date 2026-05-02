import { TODO_ITEMS } from "@/const/todoItems"
import DemoRewards from "@/shared/ui/demoFea/DemoRewards"
import DemoToDo from "@/shared/ui/demoFea/DemoToDo"
import DemoMotivation from "@/shared/ui/demoFea/DemoMotivation"
import { useState } from "react"

function RewardsSection() {
    const [todos, setTodos] = useState(TODO_ITEMS)
    const [todoRewardClaimed, setTodoRewardClaimed] = useState(false)

    const toggleTodo = (id: number) => {
        setTodos((currentTodos) =>
            currentTodos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo,
            ),
        )
    }

    const completedTodoCount = todos.filter((todo) => todo.completed).length

    return (
        <section id="rewards" className="scroll-mt-20 bg-neutral-50 px-4 py-20 md:py-24">
            <div className="mx-auto w-full max-w-6xl">
                <div className="max-w-2xl">
                    <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
                        Награды и мотивация
                    </p>
                    <h2 className="mt-3 text-4xl font-bold tracking-tight text-neutral-950">
                        Собирай XP за каждую фокус-сессию
                    </h2>
                    <p className="mt-5 text-lg leading-8 text-neutral-600">
                        Выполняй задачи, забирай награды и следи за прогрессом в одном месте.
                    </p>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-3">
                    <div>
                        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
                            Награды
                        </p>
                        <DemoRewards
                            completedTodoCount={completedTodoCount}
                            todoRewardClaimed={todoRewardClaimed}
                            onClaimTodoReward={() => setTodoRewardClaimed(true)}
                        />
                    </div>

                    <div>
                        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
                            Задачи
                        </p>
                        <DemoToDo
                            todos={todos}
                            onToggleTodo={toggleTodo}
                            locked={todoRewardClaimed}
                        />
                    </div>

                    <div>
                        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
                            Прогресс
                        </p>
                        <DemoMotivation
                            completedTodoCount={completedTodoCount}
                            totalTodosCount={todos.length}
                        />
                    </div>
                </div>
            </div>

        </section>
    )
}

export default RewardsSection
