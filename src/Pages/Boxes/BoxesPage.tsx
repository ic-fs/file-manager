import { useMemo, useState } from "react";
import { createBrowser } from "../../Browser/Browser.jsx";
import { DirectoryView } from "../../Browser/DirectoryView.js";
import { ContextMenu } from "../../ContextMenu.jsx";
import { Txt } from "../../Primitives/Txt.jsx";
import * as Feather from "react-feather";
import { Box, BoxManager } from "@ic-fs/box";
import { Button } from "../../Primitives/Button.jsx";
import { Color } from "../../Primitives/Color.jsx";
import { useAgent } from "../../Identity.jsx";
import { useNavigate } from "react-router-dom";

const { Browser, TableColumn, GridField, ToolbarItem } = createBrowser<Box>();

export function BoxesPage() {
  const [view, setView] = useState<DirectoryView>(() => DirectoryView.Grid);

  const agent = useAgent();

  const boxManager = useMemo(() => BoxManager.withAgent(agent), [agent]);

  const [boxes, setBoxes] = useState<Box[]>([]);

  const navigate = useNavigate();

  return (
    <Browser
      view={view}
      onChangeView={(v) => setView(() => v)}
      onActivate={(box) => navigate(`/${box.id}/`)}
      entries={boxes}
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
      <ToolbarItem>
        <Button
          onClick={async () => {
            const box = await boxManager.create();
            setBoxes((bb) => bb.concat(box));
          }}
        >
          <div
            css={{
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
              paddingInline: 8,
              paddingBlock: 6,
              borderRadius: 4,
              borderColor: Color.Blue[300],
              borderStyle: "solid",
              borderWidth: 1,
              background: Color.Blue[200],
              color: Color.Blue[600],
              transition: "50ms background",

              ":hover": {
                background: Color.Blue[100],
              },
            }}
          >
            <Feather.Plus size={12} />
            <Txt.Body>New Box</Txt.Body>
          </div>
        </Button>
      </ToolbarItem>

      <GridField>
        {() => (
          <div
            css={{
              alignItems: "center",
            }}
          >
            <Feather.Box size={40} />
          </div>
        )}
      </GridField>

      <GridField>
        {(entry) => (
          <div css={{ textAlign: "center" }}>
            <Txt.Body>{entry.id}</Txt.Body>
          </div>
        )}
      </GridField>

      <TableColumn width={1}>{() => <Feather.Box size={20} />}</TableColumn>

      <TableColumn header={<Txt.H6>Name</Txt.H6>}>
        {(box) => <Txt.Body>{box.id}</Txt.Body>}
      </TableColumn>
    </Browser>
  );
}
