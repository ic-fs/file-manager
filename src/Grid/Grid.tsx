import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Selection } from "../Browser/Selection.js";
import { ContextMenu } from "../ContextMenu.jsx";
import { useDropZone } from "../DropZone.jsx";
import { Color } from "../Primitives/Color.jsx";

let isFocusingProgrammatically = false;

export function createGrid<T extends { id: string }>() {
  interface GridContext {
    entry: T;
  }

  const GridContext = createContext<GridContext | null>(null);

  function Grid({
    children,
    entries,
    selection,
    columnWidth = 100,
    columnGap = 10,
    fieldGap = 4,
    onActivate,
    onPreview,
    onContextMenu,
    onAcceptDrop,
    onDrop,
  }: {
    children?: ReactNode;
    entries?: T[];
    selection?: Selection<T>;
    columnWidth?: number;
    columnGap?: number;
    fieldGap?: number;
    onActivate?: (entry: T) => void;
    onPreview?: (entries: T[]) => void;
    onContextMenu?: (entries: T[]) => ContextMenu;
    onAcceptDrop?: (dataTransfer: DataTransfer) => boolean;
    onDrop?: (dataTransfer: DataTransfer) => void;
  }) {
    const gridRef = useRef<HTMLDivElement | null>(null);

    const [columns, setColumns] = useState(5);

    useEffect(() => {
      if (gridRef.current == null) {
        return;
      }

      const ro = new ResizeObserver(() => {
        if (gridRef.current == null) {
          return;
        }
        const { width } = gridRef.current.getBoundingClientRect();
        setColumns(
          Math.floor((width - columnWidth) / (columnWidth + columnGap) + 1)
        );
      });
      ro.observe(gridRef.current);
      return () => ro.disconnect();
    }, []);

    const [contextMenuPosition, setContextMenuPosition] =
      useState<{ clientX: number; clientY: number }>();

    const containerRef = useRef<HTMLDivElement | null>(null);

    const contextMenu =
      contextMenuPosition &&
      onContextMenu &&
      selection &&
      ContextMenu.at(
        onContextMenu(selection.selected()),
        contextMenuPosition,
        () => setContextMenuPosition(undefined)
      );

    useDropZone(containerRef, onDrop, onAcceptDrop);

    return (
      <div
        ref={containerRef}
        css={{
          outline: 0,
          "--highlight-bg": Color.Gray[300],
          ":focus": {
            outlineColor: Color.Blue[500],
            outlineStyle: "solid",
            outlineOffset: 2,
            outlineWidth: 2,
          },
          ":focus, :focus-within": {
            "--highlight-bg": Color.Blue[500],
            "--highlight-fg": Color.White,
          },
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenuPosition(e);
        }}
        tabIndex={0}
        onKeyDown={(e) => {
          const index = selection?.lastIndex ?? -1;
          let x = index % columns;
          let y = Math.floor(index / columns);

          switch (e.key) {
            case "Escape":
              selection?.clear();
              return;

            case "ArrowUp":
              y -= 1;
              break;

            case "ArrowDown":
              y += 1;
              break;

            case "ArrowLeft":
              x -= 1;
              break;

            case "ArrowRight":
              x += 1;
              break;

            case "a":
              if (!e.shiftKey && !e.altKey && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                selection?.selectAll();
              }
              return;

            case " ":
              onPreview?.(selection?.selected() ?? []);
              return;

            default:
              return;
          }

          if (x < 0 || x >= columns) {
            return;
          }

          const newIndex = y * columns + x;
          (
            e.currentTarget.parentElement?.children.item(
              newIndex
            ) as HTMLElement | null
          )?.focus();

          const item = entries?.[newIndex];
          if (item) {
            selection?.selectWithKey(item, e.nativeEvent);
          }
        }}
      >
        <div
          css={{
            padding: 10,
          }}
          onMouseDown={() => selection?.clear()}
        >
          <div
            ref={gridRef}
            css={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: columnGap,
            }}
          >
            {entries?.map((entry) => {
              const isSelected = selection?.isSelected(entry) || false;

              return (
                <GridContext.Provider
                  key={entry.id}
                  value={{
                    entry,
                  }}
                >
                  <div
                    onFocus={(e) =>
                      !isFocusingProgrammatically &&
                      selection?.selectWithFocus(entry, e.nativeEvent)
                    }
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      containerRef.current?.focus();
                      selection?.selectWithClick(entry, e.nativeEvent);
                    }}
                    onDoubleClick={() => onActivate?.(entry)}
                    css={{
                      flexBasis: columnWidth,
                      flexGrow: 0,
                      flexShrink: 0,
                      background: isSelected
                        ? "var(--highlight-bg)"
                        : "transparent",
                      color: isSelected ? "var(--highlight-fg)" : "inherit",
                      cursor: "default",
                      outline: 0,
                      padding: 8,
                      borderRadius: 4,
                      gap: fieldGap,
                    }}
                  >
                    {children}
                  </div>
                </GridContext.Provider>
              );
            })}
          </div>
        </div>
        {contextMenu}
      </div>
    );
  }

  function Field({ children }: { children: (entry: T) => ReactNode }) {
    const ctx = useContext(GridContext);
    if (ctx == null) {
      return null;
    }

    return <div>{children(ctx.entry)}</div>;
  }

  return { Grid, Field };
}
