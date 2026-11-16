import { useContext, useMemo, useState } from "react";
import { Outlet, useLocation, useMatch } from "react-router";
import { Box } from "@mui/material";
import { MenuContext } from "../contexts/MenuContext";
import DLSAppBar from "../components/AppBar";
import SideBar from "../components/SideBar";
import { SynopticBreadcrumbs } from "../components/Synoptic/SynopticBreadcrumbs";
import {
  FileContext,
  useDisplayInstance
} from "@diamondlightsource/cs-web-lib";
import { BeamlineTreeStateContext } from "../contexts/BeamlineTreeStateContext";
import { addTabCallbackAction } from "../components/utils";
import { APP_BAR_HEIGHT } from "../utils/helper";
import TracesPanel from "../components/DataBrowser/TracesPanel";
import { StorageContext } from "../contexts/LocalStorageContext";
import { executeOpenQuickScreen } from "../utils/csWebLibActions";

export function AppLayout() {
  const { state } = useContext(BeamlineTreeStateContext);
  const baseFileContext = useContext(FileContext);
  const location = useLocation();

  const synopticView = Boolean(useMatch("/synoptic/*"));
  const isLanding = Boolean(useMatch({ path: "/", end: true }));
  const showMenu = !isLanding;

  const [menuOpen, setMenuOpen] = useState(true);
  const [tracesPanelOpen, setTracesPanelOpen] = useState(false);

  const [bobDisplayUuid, setBobDisplayUuid] = useState<string>();
  const [browsingMode, setBrowsingMode] = useState<string>("Load");
  const [bobScreenUrlId, setBobScreenUrlId] = useState<string | undefined>(
    location.state?.pageState?.bobScreenUrlId
  );
  const { addDisplayInstanceByDescription } = useDisplayInstance("");

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

  const restoreQuickScreenSession = () => {
    const stored = localStorage.getItem("quickScreenSession");
    if (!stored) return;

    try {
      const session = JSON.parse(stored);
      if (!session.path || !session.description) return;

      const macros = session.macros ?? {};

      addDisplayInstanceByDescription(
        session.path,
        macros,
        session.description
      );
      executeOpenQuickScreen(
        session.path,
        "quickScreen",
        macros,
        fileContext,
        ""
      );
    } catch (error) {
      console.error("Failed to restore Quick Screen session", error);
    }
  };

  const storageContext = useMemo(
    () => ({
      bobDisplayUuid,
      setBobDisplayUuid,
      browsingMode,
      setBrowsingMode,
      bobScreenUrlId,
      setBobScreenUrlId,
      restoreQuickScreenSession
    }),
    [
      bobDisplayUuid,
      setBobDisplayUuid,
      browsingMode,
      setBrowsingMode,
      bobScreenUrlId,
      setBobScreenUrlId,
      restoreQuickScreenSession
    ]
  );

  return (
    <FileContext.Provider value={fileContext}>
      <MenuContext.Provider value={menuContext}>
        <StorageContext.Provider value={storageContext}>
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
            {showMenu && <SideBar synopticView={synopticView} />}
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
        </StorageContext.Provider>
      </MenuContext.Provider>
    </FileContext.Provider>
  );
}
