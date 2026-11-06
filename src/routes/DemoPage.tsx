import { Paper as MuiPaper, styled } from "@mui/material";
import * as React from "react";
import { demoReducer, demoInitialState, FileState } from "../store";
import { APP_BAR_HEIGHT } from "../utils/helper";
import FileDisplay from "../components/FileDisplay";
import { createContext, useEffect } from "react";

const FileStateContext = createContext<{
  state: FileState;
  dispatch: React.Dispatch<any>;
}>({ state: demoInitialState, dispatch: () => null });

const Paper = styled(MuiPaper)({
  height: `calc(100dvh - ${APP_BAR_HEIGHT}px - 10px)`,
  position: "absolute",
  inset: 5,
  overflow: "hidden"
});

export function DemoPage() {
  const [state, dispatch] = React.useReducer(demoReducer, demoInitialState);
  useEffect(() => {
    document.title = "Demo | Daedalus";
  }, []);

  return (
    <Paper>
      <FileStateContext.Provider value={{ state, dispatch }}>
        <FileDisplay />
      </FileStateContext.Provider>
    </Paper>
  );
}

export default FileStateContext;
