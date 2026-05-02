import { BREAK_TIME, POMODORO_TIME } from "@/const/pomodoroTimer"
import { useState, useEffect, useRef } from "react"

function PomodoroTimer() {
  const [seconds, setSeconds] = useState(POMODORO_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!)
            setIsRunning(false)
            setIsBreak(b => !b)
            return isBreak ? POMODORO_TIME : BREAK_TIME
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(intervalRef.current!)
  }, [isRunning, isBreak])

  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0")
  const secs = (seconds % 60).toString().padStart(2, "0")
  const currentDuration = isBreak ? BREAK_TIME : POMODORO_TIME
  const progress = ((currentDuration - seconds) / currentDuration) * 100

  const reset = () => {
    clearInterval(intervalRef.current!)
    setIsRunning(false)
    setIsBreak(false)
    setSeconds(POMODORO_TIME)
  }

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
            Текущий этап
          </p>
          <h3 className="mt-1 text-2xl font-bold tracking-tight text-neutral-950">
            {isBreak ? "Короткий перерыв" : "Фокус-сессия"}
          </h3>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isRunning
              ? "bg-green-50 text-green-700"
              : "bg-neutral-100 text-neutral-600"
          }`}
        >
          {isRunning ? "Запущен" : "На паузе"}
        </span>
      </div>

      <div className="mt-10 text-center font-mono text-7xl font-bold tracking-tight text-neutral-950">
        {minutes}:{secs}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between text-xs font-medium text-neutral-500">
          <span>{isBreak ? "Перерыв" : "Фокус"}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-100">
          <div
            className="h-full rounded-full bg-neutral-950 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setIsRunning(r => !r)}
          className="rounded-xl bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          {isRunning ? "Пауза" : "Старт"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-xl border border-neutral-200 px-6 py-3 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100"
        >
          Сброс
        </button>
      </div>

      <p className="mt-6 rounded-2xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-600">
        Следующий этап: {isBreak ? "новая фокус-сессия на 25 минут" : "короткий перерыв на 5 минут"}.
      </p>
    </div>
  )
}

export default PomodoroTimer