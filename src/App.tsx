import { store } from '@diamondlightsource/cs-web-lib';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import './App.css'
import { Provider } from "react-redux";
import { ThemeProvider } from '@mui/material/styles';
import { diamondTheme } from './theme';
import { DemoPage } from './routes/DemoPage';
import { MainPage } from './routes/MainPage';

function App({ }) {
  return (
    <>
      <Provider store={store}>
        <ThemeProvider theme={diamondTheme}>
          <Router>
            <Switch>
              <Route exact path="/demo" component={DemoPage} />
              <Route exact path="/:beamline" component={MainPage} />
              <Route exact path="/:beamline/:screenId" component={MainPage} />
              <Route exact path="/" component={MainPage} />
            </Switch>
          </Router>
        </ThemeProvider>
      </Provider>
    </>
  )
}

export default App
