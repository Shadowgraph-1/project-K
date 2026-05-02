import { TIMER_FEATURES } from "@/const/timerFeatures"
import DemoTimer from "@/shared/ui/demoFea/DemoTimer"

function TimerSection() {
    return (
        <section id="timer" className="scroll-mt-20 bg-white px-4 py-20 md:py-24">
            <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
                <div>
                    <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
                        Pomodoro-таймер
                    </p>
                    <h2 className="mt-3 text-4xl font-bold tracking-tight text-neutral-950">
                        Работай в понятном ритме
                    </h2>
                    <p className="mt-5 text-lg leading-8 text-neutral-600">
                        Запускай фокус-сессии, делай короткие перерывы и следи за текущим этапом работы.
                    </p>

                    <div className="mt-8 grid gap-4">
                        {TIMER_FEATURES.map((feature) => (
                            <div
                                key={feature.title}
                                className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5"
                            >
                                <h3 className="text-sm font-semibold text-neutral-950">
                                    {feature.title}
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-neutral-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <DemoTimer />
                </div>
            </div>
        </section>
    )
}

export default TimerSection
