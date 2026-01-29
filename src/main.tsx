import { createRoot } from "react-dom/client";
import { appRouter } from "./App.tsx";
import "./index.css";
import { OutlineProvider } from "@diamondlightsource/cs-web-lib";
import { RouterProvider } from "react-router";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <OutlineProvider>
    <RouterProvider router={appRouter} />
  </OutlineProvider>
);
