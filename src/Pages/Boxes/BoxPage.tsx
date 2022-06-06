import { BoxManager, Directory, Entry } from "@ic-fs/box";
import { useEffect, useMemo, useRef, useState } from "react";
import * as Feather from "react-feather";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { createBrowser } from "../../Browser/Browser.jsx";
import { DirectoryView } from "../../Browser/DirectoryView.js";
import { ContextMenu } from "../../ContextMenu.jsx";
import { useAgent } from "../../Identity.jsx";
import { Loading } from "../../Loading.jsx";
import { Color } from "../../Primitives/Color.jsx";
import { Txt } from "../../Primitives/Txt.jsx";

const { Browser, TableColumn, GridField } = createBrowser<
  Entry & { id: string }
>();

export function BoxPage() {
  const agent = useAgent();
  const { canisterId } = useParams();

  const boxManager = useMemo(() => BoxManager.withAgent(agent), [agent]);

  const box = useMemo(() => boxManager.connect(canisterId!), [boxManager]);

  const location = useLocation();

  const path = location.pathname.split("/").slice(2).join("/");

  const [directory, setDirectory] = useState<Directory>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    box
      .openDirectory(path)
      .then(setDirectory)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [path, box]);

  const navigate = useNavigate();

  const [directoryView, setDirectoryView] = useState(DirectoryView.Grid);

  const [inspectedEntries, setInspectedEntries] = useState<Entry[]>([]);

  if (isLoading) {
    //return <Loading size={20} />;
  }

  if (error instanceof Error) {
    return <div>{error.message}</div>;
  }

  if (error) {
    return <div>{String(error)}</div>;
  }

  async function readFile(entry: Entry) {
    if ("Directory" in entry.kind) {
      throw new Error("Cannot read directory");
    } else {
      return new File(
        [new Uint8Array(await box.readFile(`${path}/${entry.name}`, [], []))],
        entry.name,
        { type: entry.kind.File.contentType }
      );
    }
  }

  async function withObjectURL<R>(
    entry: Entry,
    f: (url: string) => Promise<R>
  ): Promise<R> {
    const file = await readFile(entry);
    const url = URL.createObjectURL(file);
    try {
      return await f(url);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  const entries = directory?.entries
    .map((e) => ({ ...e, id: e.name }))
    .sort(
      (a, b) =>
        Object.keys(a.kind)[0].localeCompare(Object.keys(b.kind)[0]) ||
        a.name.localeCompare(b.name)
    );
  if (path) {
    const parentPath = path.split("/").slice(0, -2);
    entries?.unshift({
      id: parentPath.join("/"),
      kind: { Directory: null },
      name: "..",
    });
  }

  return (
    <>
      {inspectedEntries.length > 0 && (
        <Inspector
          entries={inspectedEntries}
          onClose={() => setInspectedEntries([])}
          readFile={readFile}
        />
      )}
      <Browser
        key={path}
        view={directoryView}
        onChangeView={setDirectoryView}
        onActivate={async (entry) => {
          if ("Directory" in entry.kind) {
            navigate(new URL(entry.name + "/", window.location.href));
          } else {
            await withObjectURL(entry, async (url) => {
              const subWindow = window.open(url)!;
              await new Promise<void>((resolve) => {
                setTimeout(function rec() {
                  if (subWindow.closed) {
                    resolve();
                  } else {
                    setTimeout(rec, 1000);
                  }
                }, 1000);
              });
            });
          }
        }}
        onAcceptDrop={(transfer) => {
          for (const { type } of transfer.items) {
            if (!type) {
              return false;
            }
          }
          return true;
        }}
        onDrop={async (transfer) => {
          for (const file of transfer.files) {
            const buf = await file.arrayBuffer();
            const filepath = `${path}/${file.name}`;
            await box.createFile(filepath, file.type);
            await box.writeFile(filepath, new Uint8Array(buf) as any, []);
          }
        }}
        onPreview={setInspectedEntries}
        onContextMenu={() => (
          <ContextMenu>
            <ContextMenu.Item
              onClick={async () => {
                const name = prompt("Name of new directory");
                if (name) {
                  await box.createDirectory(`${path}/${name}`);
                }
              }}
            >
              <Txt.Body>Add Folder</Txt.Body>
            </ContextMenu.Item>
          </ContextMenu>
        )}
        entries={entries}
      >
        <GridField>
          {(entry) => (
            <div css={{ alignItems: "center" }}>
              {"Directory" in entry.kind ? (
                <Feather.Folder size={40} />
              ) : (
                <Feather.File size={40} />
              )}
            </div>
          )}
        </GridField>

        <GridField>
          {(entry) => (
            <div css={{ textAlign: "center" }}>
              <Txt.Body>{entry.name}</Txt.Body>
            </div>
          )}
        </GridField>

        <TableColumn width={1}>
          {(entry) => (
            <div css={{ alignItems: "center" }}>
              {"Directory" in entry.kind ? (
                <Feather.Folder size={15} />
              ) : (
                <Feather.File size={15} />
              )}
            </div>
          )}
        </TableColumn>

        <TableColumn header={<Txt.H6>Name</Txt.H6>}>
          {(entry) => <Txt.Body>{entry.name}</Txt.Body>}
        </TableColumn>
      </Browser>
    </>
  );
}

function Inspector({
  entries,
  onClose,
  readFile,
}: {
  entries: Entry[];
  onClose: () => void;
  readFile: (entry: Entry) => Promise<File>;
}) {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog == null) {
      return;
    }

    dialog.showModal();
    dialog.addEventListener("close", onClose);

    window.focus();
    dialog.focus();

    return () => {
      dialog.close();
    };
  }, [entries]);

  return (
    <dialog
      ref={ref}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === " ") {
          onClose();
        }
      }}
      css={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minWidth: "80vw",
      }}
    >
      {entries.map((entry) => (
        <InspectedEntry key={entry.name} entry={entry} readFile={readFile} />
      ))}
    </dialog>
  );
}

function InspectedEntry({
  entry,
  readFile,
}: {
  entry: Entry;
  readFile: (entry: Entry) => Promise<File>;
}) {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    readFile(entry).then(URL.createObjectURL).then(setUrl);
  }, [entry]);

  useEffect(
    () => () => {
      if (url != null) {
        URL.revokeObjectURL(url);
      }
    },
    [url]
  );

  if (url == null) {
    return <Loading size={20} />;
  }

  return (
    <div
      css={{
        gap: 10,
      }}
    >
      <Txt.H5>{entry.name}</Txt.H5>
      <iframe
        src={url}
        css={{
          display: "block",
          flex: "1 1 100%",
          minHeight: "70vh",
          borderStyle: "solid",
          borderWidth: 1,
          borderColor: Color.Gray[200],
        }}
      />
    </div>
  );
}
