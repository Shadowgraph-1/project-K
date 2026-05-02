import { SESSION_HISTORY } from "@/const/sessionHistory"
  
  function DemoHistory() {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {SESSION_HISTORY.map((session) => {
          const total = session.completed + session.notCompleted;
          const progress =
            total === 0 ? 0 : Math.round((session.completed / total) * 100);
  
          return (
            <div
              key={session.id}
              className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-950">
                    {session.title}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-500">
                    {session.date} · {session.timeStart} - {session.timeEnd}
                  </p>
                </div>
  
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                  {progress}%
                </span>
              </div>
  
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-neutral-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Выполнено
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-neutral-950">
                    {session.completed}
                  </p>
                </div>
  
                <div className="rounded-xl bg-neutral-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                    Не закончено
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-neutral-950">
                    {session.notCompleted}
                  </p>
                </div>
              </div>
  
              <div className="mt-5 flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm text-neutral-500 bg-neutral-50 p-1 rounded-md">
                  <span>Прогресс сессии</span>
                  <span>
                    {session.completed}/{total}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-neutral-500 bg-neutral-50 p-1 rounded-md">
                    <div>Опыт</div>
                    <div>
                        {session.experience}
                    </div>
                </div>
                <div className="flex items-center justify-between text-sm text-neutral-500 bg-neutral-50 p-1 rounded-md">
                    <div>Потеряно опыта</div>
                    <div>
                        {session.experienceLoss}
                    </div>
                </div>
  
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-neutral-950 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  
  export default DemoHistory;