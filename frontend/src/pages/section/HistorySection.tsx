import DemoHistory from "@/shared/ui/demoFea/DemoHistory"

function HistorySection() {
    return (
        <section id="history" className="scroll-mt-20 bg-neutral-50 px-4 py-20 md:py-24">
            <div className="mx-auto w-full max-w-6xl">
                <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
                    История и серии
                </p>
                <h2 className="mt-3 text-4xl font-bold tracking-tight text-neutral-950">
                    Следи за сессиями и сохраняй прогресс
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-600">
                    Смотри результаты прошлых сессий, заработанный опыт и задания, которые остались незавершенными.
                </p>
                <div className="mt-10">
                    <DemoHistory />
                </div>
            </div>
        </section>
    )
}

export default HistorySection
