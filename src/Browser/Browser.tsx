import { ReactNode } from "react";
import { ContextMenu } from "../ContextMenu.jsx";
import { createGrid } from "../Grid/Grid.jsx";
import { createTable } from "../Table/Table.jsx";
import { DirectoryView } from "./DirectoryView.js";
import { DirectoryViewInput } from "./DirectoryViewInput.jsx";
import { useSelection, Selection } from "./Selection.js";

export function createBrowser<T extends { id: string }>() {
  const { Table, Column } = createTable<T>();
  const { Grid, Field } = createGrid<T>();

  function Browser({
    view,
    onChangeView,
    children,
    entries,
    onActivate,
    onContextMenu,
  }: {
    view: DirectoryView;
    children?: ReactNode;
    entries?: T[];
    onActivate?: (entry: T) => void;
    onChangeView?: (view: DirectoryView) => void;
    onContextMenu?: (entries: T[]) => ContextMenu;
  }) {
    const selection = useSelection(entries);

    return (
      <div>
        <div css={{ flexDirection: "row", padding: 10 }}>
          <div css={{ flex: "1 1 auto" }} />

          {onChangeView && (
            <DirectoryViewInput value={view} onChange={onChangeView} />
          )}
        </div>

        <Body entries={entries} view={view} selection={selection} onActivate={onActivate} onContextMenu={onContextMenu}>
          {children}
        </Body>
      </div>
    );
  }

  function Body({
    view,
    entries,
    children,
    selection,
    onActivate,
    onContextMenu,
  }: {
    view: DirectoryView;
    entries?: T[];
    children?: ReactNode;
    selection: Selection<T>;
    onActivate?: (entry: T) => void;
    onContextMenu?: (entries: T[]) => ContextMenu;
  }) {
    switch (view) {
      case DirectoryView.Grid:
        return <Grid onActivate={onActivate} entries={entries} selection={selection} onContextMenu={onContextMenu}>{children}</Grid>;

      case DirectoryView.Table:
        return <Table onActivate={onActivate} rows={entries} selection={selection} onContextMenu={onContextMenu}>{children}</Table>;
    }
  }

  return { Browser, TableColumn: Column, GridField: Field };
}
