import { ReactNode } from "react";
import { createGrid } from "../Grid/Grid.jsx";
import { createTable } from "../Table/Table.jsx";
import { DirectoryView } from "./DirectoryView.js";
import { DirectoryViewInput } from "./DirectoryViewInput.jsx";
import { useSelection, Selection } from "./Selection.js";

export function createBrowser<T extends { id: string }>() {
  const { Table, Column } = createTable<T>();
  const { Grid, Entry } = createGrid<T>();

  function Browser({
    view,
    onChangeView,
    children,
    entries,
  }: {
    view: DirectoryView;
    onChangeView?: (view: DirectoryView) => void;
    children?: ReactNode;
    entries?: T[];
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

        <Body entries={entries} view={view} selection={selection}>
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
  }: {
    view: DirectoryView;
    entries?: T[];
    children?: ReactNode;
    selection: Selection<T>;
  }) {
    switch (view) {
      case DirectoryView.Grid:
        return <Grid entries={entries} selection={selection}>{children}</Grid>;

      case DirectoryView.Table:
        return <Table rows={entries} selection={selection}>{children}</Table>;
    }
  }

  return { Browser, TableColumn: Column, GridEntry: Entry };
}
