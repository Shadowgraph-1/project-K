import type { ExternalToast } from "sonner";
import { toast } from "sonner";

export type NotifyOptions = {
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning" | "info";
  action?: ExternalToast["action"];
  cancel?: ExternalToast["cancel"];
  duration?: ExternalToast["duration"];
};

function toastOptions(
  o: Pick<NotifyOptions, "description" | "action" | "cancel" | "duration">,
): ExternalToast {
  return {
    ...(o.description !== undefined ? { description: o.description } : {}),
    ...(o.action ? { action: o.action } : {}),
    ...(o.cancel ? { cancel: o.cancel } : {}),
    ...(o.duration !== undefined ? { duration: o.duration } : {}),
  };
}

export function notify(opts: NotifyOptions) {
  const { title, variant = "default", ...rest } = opts;
  const extra = toastOptions(rest);

  switch (variant) {
    case "success":
      return toast.success(title, extra);
    case "error":
      return toast.error(title, extra);
    case "warning":
      return toast.warning(title, extra);
    case "info":
      return toast.info(title, extra);
    default:
      return toast(title, extra);
  }
}
