import { Box } from "@mui/material";
import TracesPanel from "../components/DataBrowser/TracesPanel";
import DataBrowserPlot from "../components/DataBrowser/DataBrowserPlot";
import { useEffect } from "react";

/**
 * Displays a mock editor page with palette and Phoebus
 * property menu bars
 * @returns
 */
export function DataBrowserPage() {
  useEffect(() => {
    document.title = "Data Browser | Daedalus";
  }, []);

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <TracesPanel />
      <DataBrowserPlot />
    </Box>
  );
}
