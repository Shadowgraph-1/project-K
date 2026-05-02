import { COMPANIONS, HOW_IT_WORKS_STEPS } from "@/const/howItWorksContent";
import { useState } from "react";

function HowItWorksSection() {
  const [activeCharacterIndex, setActiveCharacterIndex] = useState(0);

  const activeCharacter = COMPANIONS[activeCharacterIndex];

  const showPreviousCharacter = () => {
    setActiveCharacterIndex((currentIndex) =>
      currentIndex === 0 ? COMPANIONS.length - 1 : currentIndex - 1,
    );
  };

  const showNextCharacter = () => {
    setActiveCharacterIndex((currentIndex) =>
      currentIndex === COMPANIONS.length - 1 ? 0 : currentIndex + 1,
    );
  };

  return (
    <section
      id="how-it-works"
      className="flex min-h-dvh scroll-mt-20 flex-col justify-center bg-white px-4 py-20"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
            <img
              src={activeCharacter.image}
              alt={activeCharacter.label}
              className="h-full w-full object-cover"
            />

            <button
              type="button"
              onClick={showPreviousCharacter}
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-xl shadow-sm backdrop-blur transition hover:bg-white"
              aria-label="Показать предыдущего компаньона"
            >
              ←
            </button>

            <button
              type="button"
              onClick={showNextCharacter}
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-xl shadow-sm backdrop-blur transition hover:bg-white"
              aria-label="Показать следующего компаньона"
            >
              →
            </button>
          </div>

          <div className="mt-5 flex items-start justify-between gap-6">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
                Компаньон
              </p>
              <h3 className="mt-1 text-2xl font-bold tracking-tight text-neutral-950">
                {activeCharacter.label}
              </h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                {activeCharacter.description}
              </p>
            </div>

            <div className="flex gap-1 pt-2">
              {COMPANIONS.map((character, index) => (
                <button
                  key={character.name}
                  type="button"
                  onClick={() => setActiveCharacterIndex(index)}
                  className={`h-2.5 rounded-full transition ${
                    index === activeCharacterIndex
                      ? "w-7 bg-neutral-950"
                      : "w-2.5 bg-neutral-300 hover:bg-neutral-400"
                  }`}
                  aria-label={`Показать персонажа ${character.label}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
            Как это работает
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-neutral-950">
            Выбирай компаньона и запускай фокус-сессию
          </h2>
          <p className="mt-5 text-lg leading-8 text-neutral-600">
            Focus With Me превращает обычный таймер в совместную работу: рядом
            есть персонаж, понятные этапы и видимый прогресс.
          </p>

          <div className="mt-8 space-y-4">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-semibold text-neutral-950">
                  {String(index + 1).padStart(2, "0")}. {step.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-neutral-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
