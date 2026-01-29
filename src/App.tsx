import { FileProvider, store } from "@diamondlightsource/cs-web-lib";
import { createBrowserRouter, Outlet } from "react-router";
import "./App.css";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { diamondTheme } from "./theme";
import { DemoPage } from "./routes/DemoPage";
import { SynopticPage } from "./routes/SynopticPage";
import { EditorPage } from "./routes/EditorPage";
import { LandingPage } from "./routes/LandingPage";
import { DataBrowserPage } from "./routes/DataBrowserPage";
import { createContext, useEffect, useReducer, useState } from "react";
import {
  APPEND_BEAMLINES,
  BeamlineTreeState,
  initialState,
  reducer
} from "./store";
import { DaedalusConfig, loadConfig } from "./config";
import { Box, CircularProgress, Typography } from "@mui/material";

const INITIAL_SCREEN_STATE = {
  main: {
    path: "/json/start.json",
    macros: {},
    defaultProtocol: "ca"
  }
};

export const BeamlineTreeStateContext = createContext<{
  state: BeamlineTreeState;
  dispatch: React.Dispatch<any>;
}>({ state: initialState, dispatch: () => null });

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

  if (!config) {
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
    <Provider store={store(config)}>
      <ThemeProvider theme={diamondTheme}>
        <BeamlineTreeStateContext.Provider value={{ state, dispatch }}>
          <FileProvider initialPageState={INITIAL_SCREEN_STATE}>
            <Outlet />
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
      { path: "/demo", element: <DemoPage /> },
      { path: "/data-browser", element: <DataBrowserPage /> },
      { path: "/editor", element: <EditorPage /> },

      {
        path: "/synoptic",
        children: [
          { index: true, element: <SynopticPage /> },
          { path: ":beamline", element: <SynopticPage /> },
          { path: ":beamline/:screenUrlId", element: <SynopticPage /> }
        ]
      },

      { index: true, element: <LandingPage /> }
    ]
  }
]);
