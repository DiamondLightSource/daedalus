import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper as MuiPaper,
  styled,
  Typography
} from "@mui/material";
import {
  DynamicPageWidget,
  newRelativePosition,
  FileContext,
  useDisplayInstance
} from "@diamondlightsource/cs-web-lib";
import {
  useWindowWidth,
  APP_BAR_HEIGHT,
  useWindowHeight
} from "../../utils/helper";
import { extractAncestorScreens } from "../../utils/screenUrlIdUtils";
import { Breadcrumbs } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { createContext, useContext, useEffect, useState } from "react";
import QuickScreenSettings from "./Settings";
import { useLocation } from "react-router";

type DisplayDescription = {
  gridLayout?: unknown;
};

// Local quick screen storage handler
export const StorageContext = createContext<{
  bobDisplayUuid?: string;
  setBobDisplayUuid: any;
  browsingMode?: string;
  setBrowsingMode: any;
  bobScreenUrlId?: string;
  setBobScreenUrlId: React.Dispatch<React.SetStateAction<string | undefined>>;
}>({
  bobDisplayUuid: "",
  setBobDisplayUuid: () => null,
  browsingMode: "Load",
  setBrowsingMode: () => null,
  bobScreenUrlId: undefined,
  setBobScreenUrlId: () => null
});

const Paper = styled(MuiPaper)(({ theme }) => ({
  position: "relative",
  height: `calc(${useWindowHeight()}px - ${APP_BAR_HEIGHT}px - 50px)`,
  margin: `calc(${APP_BAR_HEIGHT}px + 15px) 5px 5px 5px`,
  width: `calc(${useWindowWidth()}px - 10px - ${theme.spacing(7)} - 8px)`
}));

export default function QuickScreenDisplay() {
  const [bobDisplayUuid, setBobDisplayUuid] = useState<string>();
  const [browsingMode, setBrowsingMode] = useState<string>();
  const [pendingCloseLocation, setPendingCloseLocation] = useState<
    string | null
  >(null);
  const fileContext = useContext(FileContext);
  const location = useLocation();
  const quickScreen = fileContext.pageState?.quickScreen;
  const bobQuickScreen = fileContext.pageState.bobQuickScreen;
  const [bobScreenUrlId, setBobScreenUrlId] = useState<string | undefined>(
    location.state?.pageState?.bobScreenUrlId
  );

  const { displayInstance, addDisplayInstanceByDescription, removeDisplayInstance } =
    useDisplayInstance(bobDisplayUuid ?? "");

  const hasQuickScreen = !!quickScreen;
  const hasBobQuickScreen = !!bobQuickScreen;

  const bobBreadcrumbs = bobScreenUrlId
    ? extractAncestorScreens(bobScreenUrlId)
    : [];

  function isQuickScreenSaved(
    quickScreen: { path?: string } | undefined,
    currentDescription: DisplayDescription | undefined
  ): boolean {
    if (!quickScreen?.path || !currentDescription) return false;

    const stored = localStorage.getItem(`quickScreens/${quickScreen.path}`);
    if (!stored) return false;

    try {
      const savedScreen = JSON.parse(stored) as {
        description?: DisplayDescription;
      };

      return (
        JSON.stringify(savedScreen.description?.gridLayout) ===
        JSON.stringify(currentDescription.gridLayout)
      );
    } catch {
      return false;
    }
  }

  const handleDisplayClose = (location: string) => {
    if (
      isQuickScreenSaved(
        quickScreen,
        displayInstance?.description as DisplayDescription | undefined
      )
    ) {
      fileContext.removePage(location);
      if (quickScreen?.path) removeDisplayInstance(quickScreen.path);
    } else {
      setPendingCloseLocation(location);
    }
  };

  const confirmDisplayClose = () => {
    if (pendingCloseLocation) {
      fileContext.removePage(pendingCloseLocation);
      if (quickScreen?.path) removeDisplayInstance(quickScreen.path);
    }
    setPendingCloseLocation(null);
  };

  // Simple screen reload that preserves open pages on refresh
  useEffect(() => {
    if (!quickScreen?.path) return;
    const stored = localStorage.getItem(`quickScreens/${quickScreen.path}`);
    if (!stored) return;

    try {
      const screen = JSON.parse(stored);
      addDisplayInstanceByDescription(
        quickScreen.path,
        quickScreen.macros ?? {},
        screen.description
      );
    } catch (error) {
      console.error("Failed to restore Quick Screen display instance", error);
    }
  }, [quickScreen, addDisplayInstanceByDescription]);

  return (
    <Paper elevation={12}>
      <Box sx={{ display: "flex", height: "100%" }}>
        <StorageContext.Provider
          value={{
            bobDisplayUuid,
            setBobDisplayUuid,
            browsingMode,
            setBrowsingMode,
            bobScreenUrlId,
            setBobScreenUrlId
          }}
        >
          <QuickScreenSettings />

          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              gap: 1,
              p: 1,
              minWidth: 0,
              overflow: "hidden"
            }}
          >
            {hasQuickScreen && (
              <MuiPaper
                elevation={3}
                sx={{
                  flex: "1 1 0",
                  position: "relative",
                  overflow: "auto",
                  maxWidth: "100%",
                  minWidth: 0
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
                  showCloseButton={true}
                  widgetIdsCallback={uuid => {
                    setBobDisplayUuid(uuid);
                  }}
                  targetDisplayType="displayGridLayout"
                  editable={true}
                />
                <Box
                  role="button"
                  aria-label="Close quick screen"
                  onClick={() => handleDisplayClose("quickScreen")}
                  sx={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    width: "100px",
                    height: "40px",
                    zIndex: 2,
                    cursor: "pointer",
                    backgroundColor: "transparent"
                  }}
                />
                <Box
                  role="label"
                  aria-label="label for quick screen"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 2,
                    cursor: "pointer",
                    backgroundColor: "transparent"
                  }}
                >
                  <Typography variant="subtitle1" color="textSecondary">
                    Quick Screen{" "}
                    {quickScreen.path !== "/new.bob"
                      ? `: ${quickScreen?.path}`
                      : ""}
                  </Typography>
                </Box>
                <Dialog
                  open={pendingCloseLocation !== null}
                  onClose={() => setPendingCloseLocation(null)}
                >
                  <DialogTitle> Close Quick Screen? </DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      This Quick Screen is not saved. Are you sure you want to
                      close it?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setPendingCloseLocation(null)}>
                      Cancel
                    </Button>
                    <Button
                      color="warning"
                      variant="contained"
                      onClick={confirmDisplayClose}
                    >
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
              </MuiPaper>
            )}

            {hasBobQuickScreen && (
              <MuiPaper
                elevation={3}
                sx={{
                  flex: "1 1 0",
                  position: "relative",
                  overflow: "auto",
                  maxWidth: "100%",
                  minWidth: 0
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
                  showCloseButton={true}
                  targetDisplayType="displayGridLayout"
                  editable={false}
                />
                <Box
                  role="label"
                  aria-label="label for bob screen"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 2,
                    cursor: "pointer",
                    backgroundColor: "transparent"
                  }}
                >
                  <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="Bob screen breadcrumb"
                    sx={{ color: "text.secondary", cursor: "default" }}
                  >
                    {bobBreadcrumbs.map(item => (
                      <Typography
                        key={item.path}
                        variant="subtitle1"
                        color="textSecondary"
                      >
                        {item.displayName}
                      </Typography>
                    ))}
                  </Breadcrumbs>
                </Box>
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
