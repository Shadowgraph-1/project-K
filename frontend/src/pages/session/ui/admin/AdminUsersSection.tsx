import { Trash2, Users } from "lucide-react";

import { AdminUsersTableSkeleton } from "@/pages/session/ui/skeletons/session-skeletons";
import { cn } from "@/shared/lib/utils";
import { notifyConfirm } from "@/shared/lib/notifyConfirm";

import { adminSurface, formatDateTime } from "./admin-page-shared";
import { Button } from "@/shared/ui/button";

export type AdminUserRow = {
  id: number;
  name: string;
  email: string;
  ownedWorkspaces: number;
  memberships: number;
  createdAt: string;
};

type AdminUsersSectionProps = {
  loading: boolean;
  total?: number;
  items?: AdminUserRow[];
  currentUserId?: number;
  deletingUserId?: number | null;
  onDeleteUser?: (user: AdminUserRow) => void | Promise<void>;
};

const COLUMN_COUNT = 7;

export function AdminUsersSection({
  loading,
  total,
  items,
  currentUserId,
  deletingUserId,
  onDeleteUser,
}: AdminUsersSectionProps) {
  async function handleDeleteClick(row: AdminUserRow) {
    if (!onDeleteUser || row.id === currentUserId) return;

    const projectHint =
      row.ownedWorkspaces > 0
        ? ` Его проекты (${row.ownedWorkspaces}) и все задачи в них будут удалены.`
        : "";

    const confirmed = await notifyConfirm({
      title: "Удалить пользователя?",
      description: `«${row.name}» (${row.email}) будет удалён без возможности восстановления.${projectHint}`,
      confirmLabel: "Удалить",
      cancelLabel: "Отмена",
    });

    if (confirmed) {
      await onDeleteUser(row);
    }
  }

  return (
    <div className="pt-2">
      <div className="flex min-h-12 items-center justify-between gap-2 px-3 pb-2">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-muted-foreground" />
          <h4 className="text-base font-medium text-foreground/75">
            Пользователи
          </h4>
        </div>
        {total != null ? (
          <p className="text-sm font-medium text-muted-foreground">
            Всего {total}
          </p>
        ) : null}
      </div>

      <div className={cn(adminSurface, "overflow-hidden")}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border/20 text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Имя</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Проекты</th>
                <th className="px-4 py-3 font-medium">Участник в</th>
                <th className="px-4 py-3 font-medium">Регистрация</th>
                <th className="px-4 py-3 font-medium">Управление</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={COLUMN_COUNT} className="p-0">
                    <AdminUsersTableSkeleton />
                  </td>
                </tr>
              ) : items?.length ? (
                items.map((row) => {
                  const isSelf = row.id === currentUserId;
                  const isDeleting = deletingUserId === row.id;

                  return (
                    <tr
                      key={row.id}
                      className="border-b border-border/10 transition-colors last:border-0 hover:bg-primary/3"
                    >
                      <td className="px-4 py-2.5 tabular-nums text-muted-foreground">
                        {row.id}
                      </td>
                      <td className="px-4 py-2.5 font-medium">{row.name}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {row.email}
                      </td>
                      <td className="px-4 py-2.5 tabular-nums">
                        {row.ownedWorkspaces}
                      </td>
                      <td className="px-4 py-2.5 tabular-nums">
                        {row.memberships}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {formatDateTime(row.createdAt)}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {isSelf || !onDeleteUser ? (
                          <span className="text-xs text-muted-foreground/50">
                            {isSelf ? "Вы" : "—"}
                          </span>
                        ) : (
                          <Button
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            className="text-muted-foreground hover:text-destructive"
                            aria-label={`Удалить пользователя ${row.name}`}
                            disabled={isDeleting}
                            onClick={() => void handleDeleteClick(row)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={COLUMN_COUNT}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    Нет пользователей
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
