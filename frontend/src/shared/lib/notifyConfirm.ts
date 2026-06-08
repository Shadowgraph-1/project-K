import { toast } from "sonner";

export type NotifyConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

/** Подтверждение через Sonner: кнопки «Удалить» / «Отмена», без window.confirm. */
export function notifyConfirm(options: NotifyConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (value: boolean) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    const id = toast.warning(options.title, {
      description: options.description,
      duration: Number.POSITIVE_INFINITY,
      action: {
        label: options.confirmLabel ?? "Удалить",
        onClick: () => {
          toast.dismiss(id);
          finish(true);
        },
      },
      cancel: {
        label: options.cancelLabel ?? "Отмена",
        onClick: () => finish(false),
      },
      onDismiss: () => finish(false),
    });
  });
}
