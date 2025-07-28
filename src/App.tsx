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

const INITIAL_SCREEN_STATE = {
  main: {
    path: "/json/start.json",
    macros: {},
    defaultProtocol: "ca"
  }
};

function App({ config }: { config: CsWebLibConfig }) {
  return (
    <>
      <Provider store={store(config)}>
        <ThemeProvider theme={diamondTheme}>
          <Router>
            <FileProvider initialPageState={INITIAL_SCREEN_STATE}>
              <Switch>
                <Route exact path="/demo" component={DemoPage} />
                <Route exact path="/data-browser" component={DataBrowserPage} />
                <Route exact path="/editor" component={EditorPage} />
                <Route exact path="/synoptic" component={MainPage} />
                <Route exact path="/synoptic/:beamline" component={MainPage} />
                <Route
                  exact
                  path="/synoptic/:beamline/:screenId"
                  component={MainPage}
                />
                <Route exact path="/" component={LandingPage} />
              </Switch>
            </FileProvider>
          </Router>
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default App;
