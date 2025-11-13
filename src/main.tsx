import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { OutlineProvider } from "@diamondlightsource/cs-web-lib";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <OutlineProvider>
    <App />
  </OutlineProvider>
);
