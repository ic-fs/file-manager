import { cloneElement, ReactElement, useState } from "react";
import { createBrowser } from "../../Browser/Browser.jsx";
import { DirectoryView } from "../../Browser/DirectoryView.js";
import { ContextMenu } from "../../ContextMenu.jsx";
import { Txt } from "../../Primitives/Txt.jsx";
import * as Feather from "react-feather";

interface Box {
  id: string;
  name: string;
  otherField: number;
  icon: ReactElement<Feather.IconProps, Feather.Icon>;
}

const { Browser, TableColumn, GridField } = createBrowser<Box>();

export function BoxesPage() {
  const [view, setView] = useState<DirectoryView>(() => DirectoryView.Grid);

  return (
    <Browser
      view={view}
      onChangeView={(v) => setView(() => v)}
      onActivate={console.log}
      entries={[
        { id: "1", name: "One", otherField: 123, icon: <Feather.Box /> },
        { id: "2", name: "Two", otherField: 534, icon: <Feather.Box /> },
        { id: "3", name: "Three", otherField: 654, icon: <Feather.Box /> },
        { id: "4", name: "Four", otherField: 144, icon: <Feather.Box /> },
        { id: "5", name: "Five", otherField: 674, icon: <Feather.Box /> },
        { id: "6", name: "Six", otherField: 911, icon: <Feather.Box /> },
        { id: "7", name: "Seven", otherField: 1446, icon: <Feather.Box /> },
      ]}
      onContextMenu={(entries) => (
        <ContextMenu>
          <ContextMenu.Item>
            <Txt.Body>{entries.length} Items</Txt.Body>
          </ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item>
            <Txt.Body>Some Action</Txt.Body>
          </ContextMenu.Item>
        </ContextMenu>
      )}
    >
      <GridField>
        {(entry) => (
          <div
            css={{
              alignItems: "center",
            }}
          >
            {cloneElement(entry.icon, { size: 40 })}
          </div>
        )}
      </GridField>

      <GridField>
        {(entry) => (
          <div css={{ textAlign: "center" }}>
            <Txt.Body>{entry.name + "!"}</Txt.Body>
          </div>
        )}
      </GridField>

      <TableColumn width={1}>
        {(entry) => <div>{cloneElement(entry.icon, { size: "1em" })}</div>}
      </TableColumn>

      <TableColumn header={<Txt.H6>Name</Txt.H6>}>
        {(box) => <Txt.Body>{box.name}</Txt.Body>}
      </TableColumn>

      <TableColumn header={<Txt.H6>Some Value</Txt.H6>}>
        {(box) => <Txt.Body>{box.otherField}</Txt.Body>}
      </TableColumn>
    </Browser>
  );
}
