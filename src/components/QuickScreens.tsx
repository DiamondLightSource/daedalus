import { CssBaseline, Paper as MuiPaper, styled } from "@mui/material";
import {
  DynamicPageWidget,
  newRelativePosition
} from "@diamondlightsource/cs-web-lib";
import {
  useWindowWidth,
  APP_BAR_HEIGHT,
  useWindowHeight
} from "../utils/helper";
import DLSAppBar from "./AppBar";
import { useRef } from "react";

const Paper = styled(MuiPaper)(({ theme }) => ({
  height: `calc(${useWindowHeight()}px - ${APP_BAR_HEIGHT}px - 10px)`,
  margin: `calc(${APP_BAR_HEIGHT}px + 5px) 5px 5px 5px`,
  width: `calc(${useWindowWidth()}px - 10px - ${theme.spacing(7)} - 8px)`
}));

export default function QuickScreens() {
  const displayUuidRef = useRef<string>();

  return (
    <>
      <CssBaseline />
      <DLSAppBar fullScreen={true} open={true} />
      <Paper>
        <DynamicPageWidget
          location={"quickScreen"}
          position={newRelativePosition(undefined, undefined, "100%", "100%")}
          scroll={false}
          showCloseButton={false}
          widgetIdsCallback={uuid => {
            // The uuid allows the json representation of the display instance to be selected from the redux store
            displayUuidRef.current = uuid;
          }}
        />
      </Paper>
    </>
  );
}
