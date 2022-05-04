import { useState } from "react";
import { createBrowser } from "../../Browser/Browser.jsx";
import { DirectoryView } from "../../Browser/DirectoryView.js";
import { ContextMenu } from "../../ContextMenu.jsx";
import { Txt } from "../../Primitives/Txt.jsx";

interface Box {
  id: string;
  name: string;
  otherField: number;
}

const { Browser, TableColumn, GridEntry } = createBrowser<Box>();

export function BoxesPage() {
  const [view, setView] = useState<DirectoryView>(() => DirectoryView.Grid);

  return (
    <Browser
      view={view}
      onChangeView={(v) => setView(() => v)}
      onActivate={console.log}
      entries={[
        { id: "1", name: "One", otherField: 123 },
        { id: "2", name: "Two", otherField: 534 },
        { id: "3", name: "Three", otherField: 654 },
        { id: "4", name: "Four", otherField: 144 },
        { id: "5", name: "Five", otherField: 674 },
        { id: "6", name: "Six", otherField: 911 },
        { id: "7", name: "Seven", otherField: 1446 },
      ]}
      onContextMenu={entries => <ContextMenu>
      {entries.length}
      </ContextMenu>}
    >
      <GridEntry>{(entry) => <Txt.Body>{entry.name}</Txt.Body>}</GridEntry>

      <TableColumn header={<Txt.H6>Name</Txt.H6>}>
        {(box) => <Txt.Body>{box.name}</Txt.Body>}
      </TableColumn>

      <TableColumn header={<Txt.H6>Some Value</Txt.H6>}>
        {(box) => <Txt.Body>{box.otherField}</Txt.Body>}
      </TableColumn>
    </Browser>
  );
}
