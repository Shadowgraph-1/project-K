function ProfileHistorySection() {
  const history = [
    {
      title: "Фокус-сессия завершена",
      description: "25 минут без отвлечений",
      time: "Сегодня, 18:40",
    },
    {
      title: "Добавлен новый компаньон",
      description: "Lilly теперь помогает с привычками",
      time: "Вчера, 21:15",
    },
    {
      title: "Профиль обновлен",
      description: "Изменены данные аккаунта",
      time: "Пн, 12:30",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-400">
          Активность
        </p>
        <h2 className="mt-2 text-3xl font-bold text-neutral-950">История</h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-500">
          Последние события профиля, сессии и изменения будут отображаться здесь.
        </p>
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-4">
        <div className="space-y-3">
          {history.map((item) => (
            <article
              key={item.title}
              className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm"
            >
              <div className="mt-1 h-3 w-3 rounded-full bg-neutral-950" />

              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-semibold text-neutral-950">
                    {item.title}
                  </h3>
                  <span className="text-xs font-medium text-neutral-400">
                    {item.time}
                  </span>
                </div>
                <p className="mt-1 text-sm text-neutral-500">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProfileHistorySection
