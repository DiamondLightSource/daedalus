import { store } from '@diamondlightsource/cs-web-lib';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import './App.css'
import { Provider } from "react-redux";
import { ThemeProvider } from '@mui/material/styles';
import { diamondTheme } from './theme';
import { DemoPage } from './routes/DemoPage';
import { MainPage } from './routes/MainPage';
import { createContext } from 'react';
import { FileState, initialState } from './store';

export const FileStateContext = createContext<{
  state: FileState;
  dispatch: React.Dispatch<any>;
}>({ state: initialState, dispatch: () => null });


export interface MacroMap {
  [key: string]: string;
}

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     [<Route path="/demo" element={<DemoPage />} />,
//     <Route path="/" element={<MainPage />} />,
//     ]
//   )
// );

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
