function ProfileCompanionSection() {
  const companions = [
    {
      name: "Kaguya",
      role: "Фокус-компаньон",
      status: "Готова к сессии",
    },
    {
      name: "Lilly",
      role: "Помощник по привычкам",
      status: "Отдыхает",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-400">
          Команда
        </p>
        <h2 className="mt-2 text-3xl font-bold text-neutral-950">
          Компаньоны
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-500">
          Выбирайте помощника для фокус-сессий, отслеживания привычек и поддержки
          во время работы.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {companions.map((companion) => (
          <article
            key={companion.name}
            className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-neutral-950">
                  {companion.name}
                </h3>
                <p className="mt-1 text-sm text-neutral-500">
                  {companion.role}
                </p>
              </div>

              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-600 shadow-sm">
                {companion.status}
              </span>
            </div>

            <div className="mt-6 rounded-2xl bg-white p-4">
              <p className="text-sm text-neutral-500">Следующая цель</p>
              <p className="mt-1 font-medium text-neutral-900">
                Провести 3 фокус-сессии на этой неделе.
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default ProfileCompanionSection
