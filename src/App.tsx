import { FileProvider, store } from "@diamondlightsource/cs-web-lib";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.css";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { diamondTheme } from "./theme";
import { DemoPage } from "./routes/DemoPage";
import { MainPage } from "./routes/MainPage";
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

function App({}) {
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
        <Router>
          <BeamlineTreeStateContext.Provider value={{ state, dispatch }}>
            <FileProvider initialPageState={INITIAL_SCREEN_STATE}>
              <Switch>
                <Route exact path="/demo" component={DemoPage} />
                <Route exact path="/data-browser" component={DataBrowserPage} />
                <Route exact path="/editor" component={EditorPage} />
                <Route exact path="/synoptic" component={MainPage} />
                <Route exact path="/synoptic/:beamline" component={MainPage} />
                <Route
                  exact
                  path="/synoptic/:beamline/:screenUrlId"
                  component={MainPage}
                />
                <Route exact path="/" component={LandingPage} />
              </Switch>
            </FileProvider>
          </BeamlineTreeStateContext.Provider>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
