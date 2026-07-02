import { Cpu, Plug2, Plus, Waypoints } from "lucide-react";

import EmptySession from "@/pages/session/ui/placeholders/EmptySession";

type LlmKeysEmptyStateProps = {
  onCreate: (presetLabel?: string) => void;
};

export function LlmKeysEmptyState({ onCreate }: LlmKeysEmptyStateProps) {
  return (
    <EmptySession
      titleName="Подключите API-ключ"
      descriptionName="Выберите провайдера или добавьте свой ключ"
      suggestions={[
        {
          title: "OpenRouter",
          description: "Один ключ для разных моделей",
          icon: <Waypoints />,
          iconClassName:
            "bg-[#E6F0FC] text-[#296BD6] dark:bg-blue-500/15 dark:text-blue-400",
          onClick: () => onCreate("OpenRouter"),
        },
        {
          title: "OpenAI",
          description: "GPT и совместимые модели",
          icon: <Cpu />,
          iconClassName:
            "bg-[#E3F5E8] text-[#1A854D] dark:bg-emerald-500/15 dark:text-emerald-400",
          onClick: () => onCreate("OpenAI"),
        },
        {
          title: "Свой провайдер",
          description: "Любой совместимый OpenAI API ключ",
          icon: <Plug2 />,
          iconClassName:
            "bg-[#EBEDFC] text-[#525CD1] dark:bg-indigo-500/15 dark:text-indigo-400",
          onClick: () => onCreate(),
        },
      ]}
      footerAction={{
        label: "Создать с нуля",
        onClick: () => onCreate(),
        icon: <Plus className="size-4" />,
      }}
    />
  );
}
