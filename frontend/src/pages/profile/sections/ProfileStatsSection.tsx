function ProfileStatsSection() {
  const stats = [
    {
      label: "Фокус-сессии",
      value: "12",
      description: "за последние 7 дней",
    },
    {
      label: "Время в фокусе",
      value: "5ч 20м",
      description: "общая длительность",
    },
    {
      label: "Серия",
      value: "4 дня",
      description: "без пропусков",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-400">
          Прогресс
        </p>
        <h2 className="mt-2 text-3xl font-bold text-neutral-950">
          Статистика
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-500">
          Следите за фокусом, сериями и временем, которое вы провели за задачами.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5"
          >
            <p className="text-sm font-medium text-neutral-500">{stat.label}</p>
            <p className="mt-3 text-3xl font-bold text-neutral-950">
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-neutral-500">{stat.description}</p>
          </article>
        ))}
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-neutral-950">
              Недельная цель
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              Выполнено 8 из 10 запланированных сессий.
            </p>
          </div>
          <span className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white">
            80%
          </span>
        </div>

        <div className="mt-5 h-3 rounded-full bg-neutral-100">
          <div className="h-3 w-4/5 rounded-full bg-neutral-950" />
        </div>
      </div>
    </div>
  )
}

export default ProfileStatsSection
