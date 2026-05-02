import { ArrowDown } from "lucide-react";
import avatar from "../../assets/hero-duo.png";
import { SECTION_ID } from "@/const/sectionIds"

function MainSection() {
    
    const sectionScroll = (id: string) => {
        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        })
    }

    return (
        <section className="relative flex min-h-dvh flex-col justify-center px-4 pb-20 md:pb-24">
        <div className="mx-auto flex w-full max-w-6xl flex-row items-center justify-between">
          <div className="max-w-xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-wide">
              Focus With Me
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-950">
              Работай не в одиночку — фокусируйся вместе с компаньоном
            </h1>
            <p className="mt-5 text-lg leading-8 text-neutral-600">
              Запускай Pomodoro*-сессии, получай поддержку от виртуального
              компаньона и отслеживай прогресс без скучных таймеров.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <button className="rounded-xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800">
                Начать сессию
              </button>
              <button 
              type="button"
              onClick={() => sectionScroll(SECTION_ID.FEATURES)}
              className="rounded-xl border border-neutral-200 px-5 py-3 text-sm font-medium text-neutral-800 hover:bg-neutral-100">
                Узнать больше
              </button>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
              <div className="border-l pl-4 border-neutral-500/50">
                <p className="text-2xl font-semibold">25 мин</p>
                <p className="text-neutral-500">фокус-сессия</p>
              </div>
              <div className="border-l pl-4 border-neutral-500/50">
                <p className="text-2xl font-semibold">2</p>
                <p className="text-neutral-500">ИИ-компаньона</p>
              </div>
              <div className="border-l pl-4 border-neutral-500/50">
                <p className="text-2xl font-semibold">XP</p>
                <p className="text-neutral-500">за прогресс</p>
              </div>
            </div>
            <span className="flex text-sm text-neutral-500 mt-4 bg-neutral-50 p-1 rounded-md">*Помодоро таймер — техника с 25-минутными интервалами работы и 5-минутными перерывами.</span>
          </div>
          <div className="border border-neutral-500/50 rounded-md w-100 h-100">
            <img
              src={avatar}
              alt="hero-duo"
              className="rounded-md w-fit h-fit"
            />
            <span className="text-sm text-neutral-500 items-center p-1 mt-1 rounded-md bg-neutral-50 justify-center flex">
              Ваши фокус-компаньоны: Кагуя и Лилли
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => sectionScroll(SECTION_ID.FEATURES)}
          className="absolute bottom-14 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 rounded-xl px-4 py-2 text-neutral-500 transition hover:text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 md:bottom-20"
          aria-label="Прокрутить к блоку «Преимущества»"
        >
          <span className="text-xs font-medium uppercase tracking-[0.2em]">
            Листай вниз
          </span>
          <ArrowDown
            className="h-6 w-6 animate-bounce"
            aria-hidden
          />
        </button>
      </section>
    )
}

export default MainSection;