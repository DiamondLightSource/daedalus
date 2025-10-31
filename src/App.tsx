import { CsWebLibConfig, FileProvider, store } from "@diamondlightsource/cs-web-lib";
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
import { createContext, useReducer } from "react";
import { BeamlineTreeState, initialState, reducer } from "./store";

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

function App({ config }: { config: CsWebLibConfig })  {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <Provider store={store(config)}>
        <ThemeProvider theme={diamondTheme}>
          <Router>
            <BeamlineTreeStateContext.Provider value={{ state, dispatch }}>
              <FileProvider initialPageState={INITIAL_SCREEN_STATE}>
                <Switch>
                  <Route exact path="/demo" component={DemoPage} />
                  <Route
                    exact
                    path="/data-browser"
                    component={DataBrowserPage}
                  />
                  <Route exact path="/editor" component={EditorPage} />
                  <Route exact path="/synoptic" component={MainPage} />
                  <Route
                    exact
                    path="/synoptic/:beamline"
                    component={MainPage}
                  />
                  <Route
                    exact
                    path="/synoptic/:beamline/:screenId"
                    component={MainPage}
                  />
                  <Route exact path="/" component={LandingPage} />
                </Switch>
              </FileProvider>
            </BeamlineTreeStateContext.Provider>
          </Router>
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default App;
