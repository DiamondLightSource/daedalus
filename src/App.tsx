import { store } from '@diamondlightsource/cs-web-lib';
import { Route, BrowserRouter as Router } from 'react-router-dom'
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
            <Route path="/demo" component={DemoPage} />
            <Route path="/" component={MainPage} />
          </Router>
        </ThemeProvider>
      </Provider>
    </>
  )
}

export default App
