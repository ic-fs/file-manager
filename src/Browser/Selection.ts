import { useRef, useState } from "react";

export interface Selection<T> {
  selectWithClick(item: T, event: MouseEvent): void;
  selectWithKey(item: T, event: KeyboardEvent): void;
  selectWithFocus(item: T, event: FocusEvent): void;
  selectAll(): void;
  clear(): void;
  isSelected(item: T): boolean;
  selected(): T[];
}

export function useSelection<T extends { id: string }>(
  items: T[] = []
): Selection<T> {
  const [selectedIds, setSelectedIds] = useState(new Set<string>());

  const lastIndex = useRef<number>(-1);

  function selectWithKey(item: T, event: KeyboardEvent) {
    event.preventDefault();
    setSelectedIds((set) => {
      const newSet = new Set(set);

      const index = items.findIndex((i) => i.id === item.id);

      if (event.metaKey || event.ctrlKey) {
        newSet.add(item.id);
        lastIndex.current = index;
      } else if (event.shiftKey && lastIndex.current >= 0) {
        newSet.clear();
        const start = Math.min(index, lastIndex.current);
        const end = Math.max(index, lastIndex.current);

        for (let i = start; i <= end; i++) {
          newSet.add(items[i].id);
        }
      } else {
        newSet.clear();
        newSet.add(item.id);
        lastIndex.current = index;
      }
      return newSet;
    });
  }

  function selectWithClick(item: T, event: MouseEvent) {
    event.preventDefault();
    if (event.button !== 0 && selectedIds.has(item.id)) {
      return;
    }
    setSelectedIds((set) => {
      const newSet = new Set(set);

      const index = items.findIndex((i) => i.id === item.id);

      if (event.metaKey || event.ctrlKey) {
        if (newSet.has(item.id)) {
          newSet.delete(item.id);
        } else {
          newSet.add(item.id);
        }
      } else if (event.shiftKey && lastIndex.current >= 0) {
        const start = Math.min(index, lastIndex.current);
        const end = Math.max(index, lastIndex.current);

        for (let i = start; i <= end; i++) {
          newSet.add(items[i].id);
        }
      } else {
        newSet.clear();
        newSet.add(item.id);
      }

      lastIndex.current = index;

      return newSet;
    });
  }

  function selectWithFocus(item: T, _event: FocusEvent) {
    setSelectedIds(new Set([item.id]));
  }

  function isSelected(item: T) {
    return selectedIds.has(item.id);
  }

  function selectAll() {
    setSelectedIds(new Set(items.map((i) => i.id)));
  }

  function clear() {
    setSelectedIds(new Set());
  }

  function selected() {
    return items.filter((i) => selectedIds.has(i.id));
  }

  return {
    selectWithClick,
    selectWithKey,
    selectAll,
    selectWithFocus,
    isSelected,
    clear,
    selected,
  };
}
