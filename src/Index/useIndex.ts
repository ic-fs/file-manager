import { Actor } from "@dfinity/agent";
import { useEffect, useMemo, useState } from "react";
import { useAgent } from "../Identity.jsx";
import {
  // @ts-expect-error
  idlFactory,
  _SERVICE,
} from "../../.dfx/local/canisters/index/index.did.js";
import { BoxManager, Box } from "@ic-fs/box";
import { Principal } from "@dfinity/principal";

declare global {
  const INDEX_CANISTER_ID: string;
}

export interface Index {
  boxes: Box[];
  isLoading: boolean;
  create: () => void;
  link: (id: string | Principal) => void;
  unlink: (id: string | Principal) => void;
}

export function useIndex(): Index {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const agent = useAgent();

  const boxManager = useMemo(() => BoxManager.withAgent(agent), [agent]);

  const index = useMemo(
    () =>
      Actor.createActor<_SERVICE>(idlFactory, {
        canisterId: INDEX_CANISTER_ID,
        agent,
      }),
    [agent]
  );

  useEffect(() => {
    index
      .list()
      .then((ids) => setBoxes(ids.map(boxManager.connect.bind(boxManager))))
      .finally(() => setIsLoading(false));
  }, [index, boxManager]);

  async function create() {
    try {
      setIsLoading(true);
      const box = await boxManager.create({ waitForInstall: false });
      setBoxes((bs) => [...bs, box]);
      await index.link(Principal.from(box.id));
    } finally {
      setIsLoading(false);
    }
  }

  async function link(id: string | Principal) {
    const newBox = boxManager.connect(id);
    setBoxes((bs) => [...bs, newBox]);
    await index.link(Principal.from(id));
  }

  async function unlink(id: string | Principal) {
    const idString = id.toString();
    setBoxes((bs) => bs.filter((b) => b.id !== idString));
    await index.unlink(Principal.from(id));
  }

  return {
    boxes,
    isLoading,
    create,
    link,
    unlink,
  };
}
