import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import { createContext, useReducer } from "react";
import {
  dataBrowserReducer,
  DataBrowserState,
  initialDataBrowserState,
  TOGGLE_TRACES_PANEL
} from "../store";
import MenuIcon from "@mui/icons-material/Menu";
import SsidChartIcon from "@mui/icons-material/SsidChart";
import ArchiverMenuBar from "../components/ArchiverMenuBar";
import { APP_BAR_HEIGHT } from "../utils/helper";
import TracesPanel from "../components/TracesPanel";
import DataBrowserPlot from "../components/DataBrowserPlot";

const DataBrowserStateContext = createContext<{
  state: DataBrowserState;
  dispatch: React.Dispatch<any>;
}>({ state: initialDataBrowserState, dispatch: () => null });

/**
 * Displays a mock editor page with palette and Phoebus
 * property menu bars
 * @returns
 */
export function DataBrowserPage() {
  const [state, dispatch] = useReducer(
    dataBrowserReducer,
    initialDataBrowserState
  );

  const openTracesPanel = () => {
    dispatch({
      type: TOGGLE_TRACES_PANEL,
      payload: { open: true }
    });
  };

  return (
    <>
      <DataBrowserStateContext.Provider value={{ state, dispatch }}>
        <Box sx={{ display: "flex", width: "100%" }}>
          <AppBar
            position="absolute"
            sx={{
              height: APP_BAR_HEIGHT,
              width: "100%",
              zIndex: theme => theme.zIndex.drawer - 1
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                sx={{
                  position: "absolute",
                  left: "96%"
                }}
              >
                <MenuIcon />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                sx={{
                  position: "absolute",
                  left: "93%"
                }}
                onClick={openTracesPanel}
              >
                <SsidChartIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <ArchiverMenuBar />
          <TracesPanel />
          <DataBrowserPlot />
        </Box>
      </DataBrowserStateContext.Provider>
    </>
  );
}

export default DataBrowserStateContext;