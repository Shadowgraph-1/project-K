import { useAuthStore } from "@/features/auth/model/useAuthStore"

function ProfileSummarySection() {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return null
  }

  const initials = user.name.slice(0, 2).toUpperCase()

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-400">
          Аккаунт
        </p>
        <h2 className="mt-2 text-3xl font-bold text-neutral-950">
          Профиль пользователя
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-500">
          Здесь собрана основная информация о вашем аккаунте и текущем прогрессе.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-neutral-950 text-2xl font-bold text-white">
              {initials}
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-neutral-950">
                {user.name}
              </h3>
              <p className="mt-1 text-sm text-neutral-500">{user.email}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-sm text-neutral-500">Статус</p>
              <p className="mt-1 text-lg font-semibold text-emerald-600">
                Активен
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-sm text-neutral-500">Режим</p>
              <p className="mt-1 text-lg font-semibold text-neutral-950">
                Focus with me
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-neutral-500">
            Быстрый обзор
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Заполнение профиля</span>
                <span className="font-semibold text-neutral-950">65%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-neutral-100">
                <div className="h-2 w-2/3 rounded-full bg-neutral-950" />
              </div>
            </div>

            <div className="rounded-2xl bg-neutral-50 p-4">
              <p className="text-sm text-neutral-500">Совет</p>
              <p className="mt-1 text-sm font-medium text-neutral-800">
                Добавьте компаньона, чтобы отслеживать совместные фокус-сессии.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSummarySection
