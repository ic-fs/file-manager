import * as Feather from "react-feather";
import { createSelect } from "../Form/SelectInput.jsx";
import { Txt } from "../Primitives/Txt.jsx";
import { DirectoryView } from "./DirectoryView.js";

const DirectoryViewSelect = createSelect<DirectoryView>();

export function DirectoryViewInput({
  value,
  onChange,
}: {
  value: DirectoryView;
  onChange: (view: DirectoryView) => void;
}) {
  return (
    <DirectoryViewSelect.Input value={value} onChange={onChange}>
      <DirectoryViewSelect.Option value={DirectoryView.Grid}>
        <div css={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
          <Feather.Grid size={12} />
          <Txt.Body>Grid</Txt.Body>
        </div>
      </DirectoryViewSelect.Option>

      <DirectoryViewSelect.Option value={DirectoryView.Table}>
        <div css={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
          <Feather.AlignLeft size={12} />
          <Txt.Body>Table</Txt.Body>
        </div>
      </DirectoryViewSelect.Option>
    </DirectoryViewSelect.Input>
  );
}
