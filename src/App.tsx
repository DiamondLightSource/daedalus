import { store } from '@dls-controls/cs-web-lib';
import './App.css'
import FileDisplay from './components/FileDisplay'
import FileNavigationBar from './components/FileNavigationBar'
import { Box, AppBar, Typography, Toolbar, Stack } from '@mui/material'
import { Provider } from "react-redux";
import { createContext, useReducer } from 'react';
import { FileState, initialState, reducer } from './store';
import { useWindowWidth, useWindowHeight } from './utils/helper';
import { ThemeProvider } from '@mui/material/styles';
import { diamondTheme } from './theme';


export interface MacroMap {
  [key: string]: string;
}

export const FileStateContext = createContext<{
  state: FileState;
  dispatch: React.Dispatch<any>;
}>({ state: initialState, dispatch: () => null });

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const width = useWindowWidth();
  const height = useWindowHeight();

  return (
    <>
      <Provider store={store}>
        <ThemeProvider theme={diamondTheme}>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar sx={{ position: "absolute" }}>
              <Toolbar>
                <Typography variant="h1" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
                  Daedalus Demo
                </Typography>
              </Toolbar>
            </AppBar>
            <FileStateContext.Provider value={{ state, dispatch }}>
              <Stack sx={{ alignItems: "center", position: "absolute", top: 80, width: width, height: height - 80 }} spacing={2}>
                <FileNavigationBar />
                <FileDisplay />
              </Stack>
            </FileStateContext.Provider>
          </Box>
        </ThemeProvider>
      </Provider>
    </>
  )
}

export default App
