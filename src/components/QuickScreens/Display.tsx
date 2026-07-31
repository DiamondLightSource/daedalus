import { Box, Paper as MuiPaper, styled, Typography } from "@mui/material";
import {
  DynamicPageWidget,
  newRelativePosition
} from "@diamondlightsource/cs-web-lib";
import {
  useWindowWidth,
  APP_BAR_HEIGHT,
  useWindowHeight
} from "../../utils/helper";
import { createContext, useState } from "react";
import QuickScreenSettings from "./Settings";
import { useLocation } from "react-router";


// Local quick screen storage handler
export const StorageContext = createContext<{
  bobDisplayUuid?: string;
  setBobDisplayUuid: any;
  browsingMode?: string,
  setBrowsingMode: any
}>({ bobDisplayUuid: "", setBobDisplayUuid: () => null, browsingMode: "Load", setBrowsingMode: () => null });

const Paper = styled(MuiPaper)(({ theme }) => ({
  height: `calc(${useWindowHeight()}px - ${APP_BAR_HEIGHT}px - 50px)`,
  margin: `calc(${APP_BAR_HEIGHT}px + 15px) 5px 5px 5px`,
  width: `calc(${useWindowWidth()}px - 10px - ${theme.spacing(7)} - 8px)`
}));

export default function QuickScreenDisplay() {
  const [bobDisplayUuid, setBobDisplayUuid] = useState<string>();
  const [browsingMode, setBrowsingMode] = useState<string>();
  const location = useLocation();
  const quickScreen = location.state?.pageState?.quickScreen;

  return (
    <Paper elevation={12}>
      <Box sx={{ display: "flex", height: "100%" }}>
        <StorageContext.Provider value={{ bobDisplayUuid, setBobDisplayUuid, browsingMode, setBrowsingMode }}>
          <QuickScreenSettings />
          {quickScreen ? (
            <DynamicPageWidget
              location={"quickScreen"}
              position={newRelativePosition(
                undefined,
                undefined,
                "100%",
                "100%"
              )}
              scroll={false}
              showCloseButton={false}
              widgetIdsCallback={uuid => {
                // The uuid allows the json representation of the display instance to be selected from the redux store
                setBobDisplayUuid(uuid);
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
        </StorageContext.Provider>
      </Box>
    </Paper>
  );
}
