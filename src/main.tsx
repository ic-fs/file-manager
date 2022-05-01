import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./Primitives/prelude.js";

const root = createRoot(
  document.body.appendChild(document.createElement("div"))
);

root.render(<App />);
