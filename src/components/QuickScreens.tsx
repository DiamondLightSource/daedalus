import { Box, Paper as MuiPaper, styled, Typography } from "@mui/material";
import {
  DynamicPageWidget,
  newRelativePosition
} from "@diamondlightsource/cs-web-lib";
import {
  useWindowWidth,
  APP_BAR_HEIGHT,
  useWindowHeight
} from "../utils/helper";
import { useRef } from "react";
import QuickScreenSettings from "./QuickScreenSettings";
import { useLocation } from "react-router";

const Paper = styled(MuiPaper)(({ theme }) => ({
  height: `calc(${useWindowHeight()}px - ${APP_BAR_HEIGHT}px - 50px)`,
  margin: `calc(${APP_BAR_HEIGHT}px + 15px) 5px 5px 5px`,
  width: `calc(${useWindowWidth()}px - 10px - ${theme.spacing(7)} - 8px)`
}));

export default function QuickScreens() {
  const displayUuidRef = useRef<string>();
  const location = useLocation();
  const quickScreen = location.state?.pageState?.quickScreen;

  return (
    <Paper elevation={12}>
      <Box sx={{ display: "flex", height: "100%" }}>
        <QuickScreenSettings />
        {quickScreen ? (
          <DynamicPageWidget
            location={"quickScreen"}
            position={newRelativePosition(undefined, undefined, "100%", "100%")}
            scroll={false}
            showCloseButton={false}
            widgetIdsCallback={uuid => {
              // The uuid allows the json representation of the display instance to be selected from the redux store
              displayUuidRef.current = uuid;
            }}
            targetDisplayType="displayGridLayout"
          />
        ) : (
          <Typography
            align="center"
            sx={{ marginTop: "20%", width: "100%", height: "100%" }}
          >
            No Quick Screen Loaded
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
