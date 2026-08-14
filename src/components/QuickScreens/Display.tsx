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
  browsingMode?: string;
  setBrowsingMode: any;
}>({
  bobDisplayUuid: "",
  setBobDisplayUuid: () => null,
  browsingMode: "Load",
  setBrowsingMode: () => null
});

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
  const bobQuickScreen = location.state?.pageState?.bobQuickScreen;

  const hasQuickScreen = !!quickScreen;
  const hasBobQuickScreen = !!bobQuickScreen;

  return (
    <Paper elevation={12}>
      <Box sx={{ display: "flex", height: "100%" }}>
        <StorageContext.Provider
          value={{
            bobDisplayUuid,
            setBobDisplayUuid,
            browsingMode,
            setBrowsingMode
          }}
        >
          <QuickScreenSettings />

          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              gap: 1,
              p: 1
            }}
          >
            {hasQuickScreen && (
              <MuiPaper
                elevation={3}
                sx={{
                  flex: 1,
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <DynamicPageWidget
                  location="quickScreen"
                  position={newRelativePosition(
                    undefined,
                    undefined,
                    "100%",
                    "100%"
                  )}
                  scroll={true}
                  showCloseButton={false}
                  widgetIdsCallback={uuid => {
                    setBobDisplayUuid(uuid);
                  }}
                  targetDisplayType="displayGridLayout"
                />
              </MuiPaper>
            )}

            {hasBobQuickScreen && (
              <MuiPaper
                elevation={3}
                sx={{
                  flex: 1,
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <DynamicPageWidget
                  location="bobQuickScreen"
                  position={newRelativePosition(
                    undefined,
                    undefined,
                    "100%",
                    "100%"
                  )}
                  scroll={true}
                  showCloseButton={false}
                  targetDisplayType="displayGridLayout"
                />
              </MuiPaper>
            )}

            {!hasQuickScreen && !hasBobQuickScreen && (
              <Typography
                align="center"
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                No Quick Screen Loaded
              </Typography>
            )}
          </Box>
        </StorageContext.Provider>
      </Box>
    </Paper>
  );
}
