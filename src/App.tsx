import {
  FileProvider,
  NotificationContainer,
  store
} from "@diamondlightsource/cs-web-lib";
import { createBrowserRouter, Outlet } from "react-router";
import "./App.css";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { DemoPage } from "./routes/DemoPage";
import { SynopticPage } from "./routes/SynopticPage";
import { EditorPage } from "./routes/EditorPage";
import { LandingPage } from "./routes/LandingPage";
import { DataBrowserPage } from "./routes/DataBrowserPage";
import { useEffect, useMemo, useReducer, useState } from "react";
import { APPEND_BEAMLINES, initialState, reducer } from "./store";
import { DaedalusConfig, loadConfig } from "./config";
import { Box, CircularProgress, Typography } from "@mui/material";
import { QuickScreensPage } from "./routes/QuickScreensPage";
import { DiamondDSTheme } from "@diamondlightsource/sci-react-ui";
import { AppLayout } from "./routes/AppLayout";
import { BeamlineTreeStateContext } from "./contexts/BeamlineTreeStateContext";

const INITIAL_SCREEN_STATE = {
  main: {
    path: "/json/start.json",
    macros: {},
    defaultProtocol: "ca"
  }
};

const App = ({}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [config, setConfig] = useState<DaedalusConfig | null>(null);

  useEffect(() => {
    loadConfig().then(config => {
      if (config?.beamlines) {
        dispatch({ type: APPEND_BEAMLINES, payload: config.beamlines });
      }

      setConfig(config);
    });
  }, []);

  const csStore = useMemo(() => (config ? store(config) : null), [config]);
  const beamlineContext = useMemo(() => ({ state, dispatch }), [state]);

  if (!config || !csStore) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Typography> Loading </Typography>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Provider store={csStore}>
      <ThemeProvider theme={DiamondDSTheme} defaultMode="light">
        <BeamlineTreeStateContext.Provider value={beamlineContext}>
          <FileProvider initialPageState={INITIAL_SCREEN_STATE}>
            <>
              <NotificationContainer />
              <Outlet />
            </>
          </FileProvider>
        </BeamlineTreeStateContext.Provider>
      </ThemeProvider>
    </Provider>
  );
};

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/demo", element: <DemoPage /> },
          { path: "/data-browser", element: <DataBrowserPage /> },
          { path: "/editor", element: <EditorPage /> },
          {
            path: "/synoptic",
            children: [
              { index: true, element: <SynopticPage /> },
              { path: ":beamline", element: <SynopticPage /> },
              { path: ":beamline/*", element: <SynopticPage /> }
            ]
          },
          { path: "/quick-screens", element: <QuickScreensPage /> },
          { index: true, element: <LandingPage /> }
        ]
      }
    ]
  }
]);
