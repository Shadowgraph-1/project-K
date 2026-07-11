import { Trash2 } from "lucide-react";

import { AdminUsersTableSkeleton } from "@/pages/session/ui/skeletons/session-skeletons";
import { notifyConfirm } from "@/shared/lib/notifyConfirm";
import { Button } from "@/shared/ui/button";

import {
  adminSectionHeader,
  adminSectionTitle,
  adminSurface,
  formatDateTime,
} from "./admin-page-shared";

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
    <section className={adminSurface}>
      <div className={adminSectionHeader}>
        <h2 className={adminSectionTitle}>Пользователи</h2>
        {total != null ? (
          <span className="text-[11px] tabular-nums text-muted-foreground">
            {total}
          </span>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border/40 text-[11px] text-muted-foreground">
              <th className="px-4 py-2 font-normal">ID</th>
              <th className="px-4 py-2 font-normal">Имя</th>
              <th className="px-4 py-2 font-normal">Email</th>
              <th className="px-4 py-2 font-normal">Проекты</th>
              <th className="px-4 py-2 font-normal">Участник</th>
              <th className="px-4 py-2 font-normal">Регистрация</th>
              <th className="px-4 py-2 font-normal" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
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
                    className="transition-colors hover:bg-muted/25"
                  >
                    <td className="px-4 py-2.5 tabular-nums text-[12px] text-muted-foreground/70">
                      {row.id}
                    </td>
                    <td className="px-4 py-2.5 text-[13px] font-medium text-foreground">
                      {row.name}
                      {isSelf ? (
                        <span className="ml-1.5 text-[11px] font-normal text-muted-foreground/55">
                          вы
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-2.5 text-[12px] text-muted-foreground">
                      {row.email}
                    </td>
                    <td className="px-4 py-2.5 tabular-nums text-[13px] text-foreground/85">
                      {row.ownedWorkspaces}
                    </td>
                    <td className="px-4 py-2.5 tabular-nums text-[13px] text-foreground/85">
                      {row.memberships}
                    </td>
                    <td className="px-4 py-2.5 text-[12px] tabular-nums text-muted-foreground/55">
                      {formatDateTime(row.createdAt)}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {isSelf || !onDeleteUser ? (
                        <span className="text-[11px] text-muted-foreground/40">
                          —
                        </span>
                      ) : (
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          className="size-7 text-muted-foreground hover:text-destructive"
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
                  className="px-4 py-8 text-center text-[13px] text-muted-foreground"
                >
                  Нет пользователей
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
