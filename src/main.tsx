import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { OutlineProvider } from "@diamondlightsource/cs-web-lib";
import { loadConfig } from "./config.ts";

const container = document.getElementById("root");
const root = createRoot(container!);

loadConfig().then((config) => {
  root.render(
    <OutlineProvider>
      <App config={config} />
    </OutlineProvider>
  );
});
