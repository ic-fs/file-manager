import { useState } from "react";
import { createBrowser } from "../../Browser/Browser.jsx";
import { DirectoryView } from "../../Browser/DirectoryView.js";
import { Txt } from "../../Primitives/Txt.jsx";

interface Box {
  id: string;
  name: string;
}

const { Browser, TableColumn, GridEntry } = createBrowser<Box>();

export function BoxesPage() {
  const [view, setView] = useState<DirectoryView>(() => DirectoryView.Grid);

  return (
    <Browser
      view={view}
      onChangeView={(v) => setView(() => v)}
      entries={[
        { id: "1", name: "One" },
        { id: "2", name: "Two" },
        { id: "3", name: "Three" },
        { id: "4", name: "Four" },
        { id: "5", name: "Five" },
        { id: "6", name: "Six" },
        { id: "7", name: "Seven" },
      ]}
    >
      <GridEntry>{(entry) => <Txt.Body>{entry.name}</Txt.Body>}</GridEntry>

      <TableColumn header={<Txt.H6>Name</Txt.H6>}>
        {(box) => <Txt.Body>{box.name}</Txt.Body>}
      </TableColumn>
    </Browser>
  );
}
