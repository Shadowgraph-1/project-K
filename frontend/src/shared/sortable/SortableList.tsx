import type { ElementType, ReactNode } from "react";

import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";

export type SortableListProps<T extends { id: string }> = {
  items: T[];
  onReorder: (next: T[]) => void;
  as?: ElementType;
  className?: string;
  /** Обёртка вокруг списка (например flex-1 для растягивания сетки по высоте). */
  wrapperClassName?: string;
  children: (item: T, index: number) => ReactNode;
};

export function SortableList<T extends { id: string }>({
  items,
  onReorder,
  as: List = "ul",
  className,
  wrapperClassName,
  children,
}: SortableListProps<T>) {
  const list = (
    <List className={className}>
      {items.map((item, index) => children(item, index))}
    </List>
  );

  return (
    <DragDropProvider
      onDragEnd={(event) => onReorder(move(items, event) as T[])}
    >
      {wrapperClassName ? (
        <div className={wrapperClassName}>{list}</div>
      ) : (
        list
      )}
    </DragDropProvider>
  );
}
