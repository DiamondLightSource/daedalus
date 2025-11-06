import { Box } from "@mui/material";
import ArchiverMenuBar from "../components/ArchiverMenuBar";
import TracesPanel from "../components/TracesPanel";
import DataBrowserPlot from "../components/DataBrowserPlot";
import DLSAppBar from "../components/AppBar";

/**
 * Displays a mock editor page with palette and Phoebus
 * property menu bars
 * @returns
 */
export function DataBrowserPage() {
  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <DLSAppBar fullScreen={false} page="archiver" />
      <ArchiverMenuBar />
      <TracesPanel />
      <DataBrowserPlot />
    </Box>
  );
}
