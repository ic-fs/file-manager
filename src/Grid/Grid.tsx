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
import { Color } from "../Primitives/Color.jsx";

let isFocusingProgrammatically = false;

export function createGrid<T extends { id: string }>() {
  interface GridContext {
    entry: T;
    selection?: Selection<T>;
    size: number;
    columns: number;
    index: number;
    entries: T[];
    activate(): void;
    focus(): void;
  }

  const GridContext = createContext<GridContext | null>(null);

  function Grid({
    children,
    entries,
    selection,
    columnWidth = 100,
    columnGap = 10,
    onActivate,
    onContextMenu,
  }: {
    children?: ReactNode;
    entries?: T[];
    selection?: Selection<T>;
    columnWidth?: number;
    columnGap?: number;
    onActivate?: (entry: T) => void;
    onContextMenu?: (entries: T[]) => ContextMenu;
  }) {
    const gridRef = useRef<HTMLDivElement | null>(null);

    const [columns, setColumns] = useState(5);

    useEffect(() => {
      if (gridRef.current == null) {
        return;
      }

      const ro = new ResizeObserver(() => {
        const { width } = gridRef.current!.getBoundingClientRect();
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

    return (
      <div
        ref={containerRef}
        css={{
          outline: 0,
          "--highlight-bg": Color.Gray[300],
          ":focus, :focus-within": {
            outlineColor: Color.Blue[500],
            outlineStyle: "solid",
            outlineOffset: 2,
            outlineWidth: 2,
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
            {entries?.map((entry, index) => (
              <GridContext.Provider
                key={entry.id}
                value={{
                  entry,
                  selection,
                  size: columnWidth,
                  columns,
                  index,
                  entries,
                  activate: () => onActivate?.(entry),
                  focus: () => containerRef.current?.focus(),
                }}
              >
                {children}
              </GridContext.Provider>
            ))}
          </div>
        </div>
        {contextMenu}
      </div>
    );
  }

  function Entry({ children }: { children: (entry: T) => ReactNode }) {
    const ctx = useContext(GridContext);
    if (ctx == null) {
      return null;
    }

    const isSelected = ctx.selection?.isSelected(ctx.entry) || false;

    return (
      <div
        onFocus={(e) =>
          !isFocusingProgrammatically &&
          ctx.selection?.selectWithFocus(ctx.entry, e.nativeEvent)
        }
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          ctx.focus();
          ctx.selection?.selectWithClick(ctx.entry, e.nativeEvent);
        }}
        onDoubleClick={ctx.activate}
        css={{
          flexBasis: ctx.size,
          flexGrow: 0,
          flexShrink: 0,
          background: isSelected ? "var(--highlight-bg)" : "transparent",
          color: isSelected ? "var(--highlight-fg)" : "inherit",
          cursor: "default",
          outline: 0,
          padding: 8,
          borderRadius: 4,
        }}
      >
        {children(ctx.entry)}
      </div>
    );
  }

  return { Grid, Entry };
}
