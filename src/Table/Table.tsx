import { createContext, ReactNode, useContext, useRef } from "react";
import { Selection } from "../Browser/Selection.js";
import { Color } from "../Primitives/Color.jsx";

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
  }: {
    children?: ReactNode;
    rows?: T[];
    selection?: Selection<T>;
  }) {
    const inContext = (ctx: TableContext) => (
      <TableContext.Provider value={ctx}>{children}</TableContext.Provider>
    );

    return (
      <table
        css={{
          borderCollapse: "collapse",
          "--highlight-bg": Color.Gray[300],
          "--highlight-fg": Color.Black,
          ":focus-within": {
            "--highlight-bg": Color.Blue[500],
            "--highlight-fg": Color.White,
          },
        }}
      >
        <thead>
          <tr>{inContext({ position: Position.InHeader })}</tr>
        </thead>
        <tbody>
          {rows?.map((row, i) => (
            <tr
              key={row.id}
              tabIndex={0}
              css={{
                outline: 0,
              }}
              onKeyDown={(e) => {
                switch (e.key) {
                  case "ArrowUp":
                    (
                      e.currentTarget
                        .previousElementSibling as HTMLElement | null
                    )?.focus();
                    if (rows[i - 1]) {
                      selection?.selectWithKey(rows[i - 1], e.nativeEvent);
                    }
                    break;

                  case "ArrowDown":
                    (
                      e.currentTarget.nextElementSibling as HTMLElement | null
                    )?.focus();
                    if (rows[i + 1]) {
                      selection?.selectWithKey(rows[i + 1], e.nativeEvent);
                    }
                    break;

                  case "a":
                    if (!e.shiftKey && !e.altKey && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      selection?.selectAll();
                    }
                    break;
                }
              }}
              onMouseDown={(e) => {
                e.currentTarget.focus();
                selection?.selectWithClick(row, e.nativeEvent);
              }}
            >
              {inContext({ position: Position.InBody, row, selection })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  function Column({
    header,
    children,
  }: {
    header?: ReactNode;
    children: (row: T) => ReactNode;
  }) {
    const ctx = useContext(TableContext);
    if (ctx == null) {
      return null;
    }

    switch (ctx.position) {
      case Position.InHeader:
        return <th>{header}</th>;

      case Position.InBody:
        const isSelected = ctx.selection?.isSelected(ctx.row) || false;

        return (
          <td
            css={{
              background: isSelected ? "var(--highlight-bg)" : "transparent",
              color: isSelected ? "var(--highlight-fg)" : "inherit",
              cursor: "default",
              padding: 8,

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
