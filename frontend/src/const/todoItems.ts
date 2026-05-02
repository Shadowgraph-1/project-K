export type TodoItem = {
  id: number
  title: string
  completed: boolean
}

export const TODO_ITEMS: TodoItem[] = [
  { id: 1, title: "Купить продукты", completed: false },
  { id: 2, title: "Сделать зарядку", completed: false },
  { id: 3, title: "Почитать книгу", completed: false },
]
