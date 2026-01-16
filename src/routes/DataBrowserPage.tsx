import { Box } from "@mui/material";
import ArchiverMenuBar from "../components/ArchiverMenuBar";
import TracesPanel from "../components/TracesPanel";
import DataBrowserPlot from "../components/DataBrowserPlot";
import DLSAppBar from "../components/AppBar";
import { createContext, useEffect, useState } from "react";

export const MenuContext = createContext<{
  menusOpen: {
    trace: boolean;
    archiver: boolean;
  };
  setMenusOpen: any;
}>({ menusOpen: { trace: false, archiver: false }, setMenusOpen: () => null });

/**
 * Displays a mock editor page with palette and Phoebus
 * property menu bars
 * @returns
 */
export function DataBrowserPage() {
  const [menusOpen, setMenusOpen] = useState({ trace: false, archiver: false });

  useEffect(() => {
    document.title = "Data Browser | Daedalus";
  }, []);

  return (
    <MenuContext.Provider value={{ menusOpen, setMenusOpen }}>
      <Box sx={{ display: "flex", width: "100%" }}>
        <DLSAppBar fullScreen={false} open={menusOpen.archiver} />
        <ArchiverMenuBar />
        <TracesPanel />
        <DataBrowserPlot />
      </Box>
    </MenuContext.Provider>
  );
}
