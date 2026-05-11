import type { ReactElement } from "react";

import { useSortable } from "@dnd-kit/react/sortable";

export type SortableItemHandleProps = {
  ref: (element: HTMLElement | null) => void;
  handleRef: (element: HTMLElement | null) => void;
};

export type SortableItemProps = {
  id: string;
  index: number;
  children: (handles: SortableItemHandleProps) => ReactElement;
};


export function SortableItem({ id, index, children }: SortableItemProps) {
  const { ref, handleRef } = useSortable({ id, index });
  return children({ ref, handleRef });
}
