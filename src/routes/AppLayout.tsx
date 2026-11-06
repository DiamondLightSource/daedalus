import { useContext, useMemo, useState } from "react";
import { Outlet, useMatch } from "react-router";
import { Box } from "@mui/material";
import { MenuContext } from "../contexts/MenuContext";
import DLSAppBar from "../components/AppBar";
import MiniMenuBar from "../components/MenuBar";
import { SynopticBreadcrumbs } from "../components/SynopticBreadcrumbs";
import { FileContext } from "@diamondlightsource/cs-web-lib";
import { BeamlineTreeStateContext } from "../contexts/BeamlineTreeStateContext";
import { addTabCallbackAction } from "../components/utils";
import { APP_BAR_HEIGHT } from "../utils/helper";
import TracesPanel from "../components/DataBrowser/TracesPanel";

export function AppLayout() {
  const { state } = useContext(BeamlineTreeStateContext);
  const baseFileContext = useContext(FileContext);

  const synopticView = Boolean(useMatch("/synoptic/*"));
  const isLanding = Boolean(useMatch({ path: "/", end: true }));
  const showMenu = !isLanding;

  const [menuOpen, setMenuOpen] = useState(true);
  const [tracesPanelOpen, setTracesPanelOpen] = useState(false);

  const addTab = useMemo(
    () =>
      addTabCallbackAction(
        state.beamlines,
        state.currentBeamline,
        window.location
      ),
    [state.beamlines, state.currentBeamline]
  );
  const synopticFileContext = useMemo(
    () => ({ ...baseFileContext, addTab }),
    [baseFileContext, addTab]
  );

  const fileContext =
    synopticView &&
    state.currentBeamline &&
    state.beamlines[state.currentBeamline]
      ? synopticFileContext
      : baseFileContext;

  const menuContext = useMemo(
    () => ({ menuOpen, setMenuOpen, tracesPanelOpen, setTracesPanelOpen }),
    [menuOpen, tracesPanelOpen]
  );

  return (
    <FileContext.Provider value={fileContext}>
      <MenuContext.Provider value={menuContext}>
        <Box sx={{ display: "flex", height: "100dvh", width: "100%" }}>
          <DLSAppBar
            title="Daedalus"
            open={menuOpen}
            setOpen={setMenuOpen}
            synopticView={synopticView}
            showMenuButton={showMenu}
          >
            {synopticView && <SynopticBreadcrumbs />}
          </DLSAppBar>
          {showMenu && <MiniMenuBar synopticView={synopticView} />}
          <Box
            component="main"
            sx={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              mt: `${APP_BAR_HEIGHT}px`,
              position: "relative",
              flexDirection: "column"
            }}
          >
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                position: "relative"
              }}
            >
              <Outlet />
            </Box>
            <TracesPanel />
          </Box>
        </Box>
      </MenuContext.Provider>
    </FileContext.Provider>
  );
}
