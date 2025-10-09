import { Box, Typography, Stack } from "@mui/material";
import * as React from "react";
import { demoReducer, demoInitialState, FileState } from "../store";
import { useWindowWidth, useWindowHeight } from "../utils/helper";
import FileDisplay from "../components/FileDisplay";
import FileNavigationBar from "../components/FileNavigationBar";
import { createContext } from "react";
import DLSAppBar from "../components/AppBar";

const FileStateContext = createContext<{
  state: FileState;
  dispatch: React.Dispatch<any>;
}>({ state: demoInitialState, dispatch: () => null });

export function DemoPage() {
  const [state, dispatch] = React.useReducer(demoReducer, demoInitialState);
  const width = useWindowWidth();
  const height = useWindowHeight();

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <DLSAppBar fullScreen={true}>
            <Typography
              variant="h1"
              component="div"
              sx={{ flexGrow: 1, textAlign: "center" }}
            >
              Daedalus Demo
            </Typography>
        </DLSAppBar>
        <FileStateContext.Provider value={{ state, dispatch }}>
          <Stack
            sx={{
              alignItems: "center",
              position: "absolute",
              top: 80,
              width: width,
              height: height - 80
            }}
            spacing={2}
          >
            <FileNavigationBar />
            <FileDisplay />
          </Stack>
        </FileStateContext.Provider>
      </Box>
    </>
  );
}

export default FileStateContext;
