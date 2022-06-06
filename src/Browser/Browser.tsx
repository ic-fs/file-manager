import { createContext, ReactNode, useContext } from "react";
import { ContextMenu } from "../ContextMenu.jsx";
import { createGrid } from "../Grid/Grid.jsx";
import { createTable } from "../Table/Table.jsx";
import { DirectoryView } from "./DirectoryView.js";
import { DirectoryViewInput } from "./DirectoryViewInput.jsx";
import { useSelection, Selection } from "./Selection.js";

export function createBrowser<T extends { id: string }>() {
  const { Table, Column, IfEmpty: IfTableEmpty } = createTable<T>();
  const { Grid, Field, IfEmpty: IfGridEmpty } = createGrid<T>();

  const BrowserContext = createContext(false);

  function Browser({
    view,
    onChangeView,
    children,
    entries,
    onActivate,
    onPreview,
    onContextMenu,
    onAcceptDrop,
    onDrop,
  }: {
    view: DirectoryView;
    children?: ReactNode;
    entries?: T[];
    onActivate?: (entry: T) => void;
    onPreview?: (entries: T[]) => void;
    onChangeView?: (view: DirectoryView) => void;
    onContextMenu?: (entries: T[]) => ContextMenu;
    onAcceptDrop?: (dataTransfer: DataTransfer) => boolean;
    onDrop?: (dataTransfer: DataTransfer) => void;
  }) {
    const selection = useSelection(entries);

    return (
      <div>
        <div css={{ flexDirection: "row", padding: 10, gap: 10 }}>
          <div css={{ flex: "1 1 auto" }} />

          <BrowserContext.Provider value>{children}</BrowserContext.Provider>

          {onChangeView && (
            <DirectoryViewInput value={view} onChange={onChangeView} />
          )}
        </div>

        <Body
          entries={entries}
          view={view}
          selection={selection}
          onActivate={onActivate}
          onContextMenu={onContextMenu}
          onAcceptDrop={onAcceptDrop}
          onDrop={onDrop}
          onPreview={onPreview}
        >
          {children}
        </Body>
      </div>
    );
  }

  function ToolbarItem({ children }: { children?: ReactNode }) {
    if (!useContext(BrowserContext)) {
      return null;
    }

    return <>{children}</>;
  }

  function IfEmpty({ children }: { children?: ReactNode }) {
    return (
      <>
        <IfTableEmpty>{children}</IfTableEmpty>
        <IfGridEmpty>{children}</IfGridEmpty>
      </>
    );
  }

  function Body({
    view,
    entries,
    children,
    selection,
    onActivate,
    onPreview,
    onContextMenu,
    onAcceptDrop,
    onDrop,
  }: {
    view: DirectoryView;
    entries?: T[];
    children?: ReactNode;
    selection: Selection<T>;
    onActivate?: (entry: T) => void;
    onPreview?: (entries: T[]) => void;
    onContextMenu?: (entries: T[]) => ContextMenu;
    onAcceptDrop?: (dataTransfer: DataTransfer) => boolean;
    onDrop?: (dataTransfer: DataTransfer) => void;
  }) {
    switch (view) {
      case DirectoryView.Grid:
        return (
          <Grid
            onActivate={onActivate}
            onPreview={onPreview}
            entries={entries}
            selection={selection}
            onContextMenu={onContextMenu}
            onAcceptDrop={onAcceptDrop}
            onDrop={onDrop}
          >
            {children}
          </Grid>
        );

      case DirectoryView.Table:
        return (
          <Table
            onActivate={onActivate}
            onPreview={onPreview}
            rows={entries}
            selection={selection}
            onContextMenu={onContextMenu}
            onAcceptDrop={onAcceptDrop}
            onDrop={onDrop}
          >
            {children}
          </Table>
        );
    }
  }

  return {
    Browser,
    TableColumn: Column,
    GridField: Field,
    ToolbarItem,
    IfEmpty,
  };
}
