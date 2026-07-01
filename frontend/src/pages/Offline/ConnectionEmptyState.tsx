import { useState } from "react";
import { WifiOff, ServerOff} from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/shared/ui/empty";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";

const MIN_SPINNER_MS = 500;

export function ConnectionEmptyState({
  online,
  onRetry,
}: {
  online: boolean;
  onRetry: () => Promise<void>;
}) {
  const [isRetrying, setIsRetrying] = useState(false);

  async function handleRetry() {
    if (isRetrying) return;

    setIsRetrying(true);
    const started = Date.now();

    try {
      await onRetry();
    } catch {
      const remaining = MIN_SPINNER_MS - (Date.now() - started);
      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }
      setIsRetrying(false);
    }
  }

  const title = !online ? "Нет интернета" : "Сервер недоступен";
  const description = !online
    ? "Проверьте подключение. Когда сеть вернётся, страница обновится автоматически."
    : "Не удаётся связаться с сервером. Убедитесь, что бэкенд запущен.";

  return (
    <Empty className="h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {!online ? <WifiOff /> : <ServerOff />}
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <Button
        variant="outline"
        size="sm"
        disabled={isRetrying}
        onClick={handleRetry}
      >
        {isRetrying && (
          <Spinner className="size-3.5" />)}
        Повторить
      </Button>
    </Empty>
  );
}
