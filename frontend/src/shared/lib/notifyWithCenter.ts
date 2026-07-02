import { useNotifys } from "@/entities/notification/model/useNotifys";
import { useNotificationPrefsStore } from "@/shared/model/useNotificationPrefsStore";

import { notify } from "./notify";
import type { NotifyOptions } from "./notify";

export type NotifyWithCenterOptions = NotifyOptions & {
  toCenter?: boolean;
};

export function notifyWithCenter(opts: NotifyWithCenterOptions) {
  const { toCenter = true, ...toastOpts } = opts;
  notify(toastOpts);

  if (!toCenter) return;
  if (!useNotificationPrefsStore.getState().taskHistoryEnabled) return;

  const id = crypto.randomUUID();
  const { title, description = "", variant = "default" } = toastOpts;
  useNotifys.getState().addNotify(id, title, description, variant);
}
