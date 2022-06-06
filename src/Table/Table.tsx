import { createContext, ReactNode, useContext, useRef, useState } from "react";
import { Selection } from "../Browser/Selection.js";
import { ContextMenu } from "../ContextMenu.jsx";
import { useDropZone } from "../DropZone.jsx";
import { Color } from "../Primitives/Color.jsx";

let isFocusingProgrammatically = false;

export function createTable<T extends { id: string }>() {
  enum Position {
    InHeader,
    InBody,
  }

  type TableContext =
    | {
        position: Position.InHeader;
      }
    | {
        position: Position.InBody;
        row: T;
        selection?: Selection<T>;
      };

  const TableContext = createContext<TableContext | null>(null);

  function Table({
    children,
    rows,
    selection,
    onActivate,
    onPreview,
    onContextMenu,
    onAcceptDrop,
    onDrop,
  }: {
    children?: ReactNode;
    rows?: T[];
    selection?: Selection<T>;
    onActivate?: (row: T) => void;
    onPreview?: (entries: T[]) => void;
    onContextMenu?: (rows: T[]) => ContextMenu;
    onAcceptDrop?: (dataTransfer: DataTransfer) => boolean;
    onDrop?: (dataTransfer: DataTransfer) => void;
  }) {
    const inContext = (ctx: TableContext) => (
      <TableContext.Provider value={ctx}>{children}</TableContext.Provider>
    );
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
          "--highlight-fg": Color.Black,
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
          switch (e.key) {
            case "Escape":
              selection?.clear();
              break;

            case "ArrowUp":
              selection?.selectPreviousWithKey(e.nativeEvent);
              break;

            case "ArrowDown":
              selection?.selectNextWithKey(e.nativeEvent);
              break;

            case "a":
              if (!e.shiftKey && !e.altKey && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                selection?.selectAll();
              }
              break;

            case " ":
              onPreview?.(selection?.selected() ?? []);
              break;
          }
        }}
      >
        <table
          css={{
            borderCollapse: "collapse",
          }}
          onMouseDown={() => selection?.clear()}
        >
          <thead>
            <tr>{inContext({ position: Position.InHeader })}</tr>
          </thead>
          <tbody>
            {rows?.map((row) => (
              <tr
                css={{
                  ":nth-of-type(2n - 1)": {
                    background: Color.Gray[200],
                  },
                }}
                key={row.id}
                onDoubleClick={() => onActivate?.(row)}
                onFocus={(e) =>
                  !isFocusingProgrammatically &&
                  selection?.selectWithFocus(row, e.nativeEvent)
                }
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  isFocusingProgrammatically = true;
                  containerRef.current?.focus();
                  isFocusingProgrammatically = false;
                  selection?.selectWithClick(row, e.nativeEvent);
                }}
              >
                {inContext({ position: Position.InBody, row, selection })}
              </tr>
            ))}
          </tbody>
        </table>
        {contextMenu}
      </div>
    );
  }

  function Column({
    header,
    children,
    width,
  }: {
    header?: ReactNode;
    children: (row: T) => ReactNode;
    width?: number | string;
  }) {
    const ctx = useContext(TableContext);
    if (ctx == null) {
      return null;
    }

    switch (ctx.position) {
      case Position.InHeader:
        return (
          <th
            css={{
              textAlign: "left",
              padding: 8,
              boxSizing: "content-box",
              width,

              ":first-of-type": {
                paddingLeft: 18,
              },
            }}
          >
            {header}
          </th>
        );

      case Position.InBody:
        const isSelected = ctx.selection?.isSelected(ctx.row) || false;

        return (
          <td
            css={{
              background: isSelected ? "var(--highlight-bg)" : "transparent",
              color: isSelected ? "var(--highlight-fg)" : "inherit",
              cursor: "default",
              padding: 8,
              boxSizing: "content-box",
              width,

              ":first-of-type": {
                paddingLeft: 18,
              },
            }}
          >
            {children(ctx.row)}
          </td>
        );
    }
  }

  return { Table, Column };
}
