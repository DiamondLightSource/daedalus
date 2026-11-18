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
  Tooltip,
  Typography
} from "@mui/material";
import {
  DynamicPageWidget,
  newRelativePosition,
  FileContext,
  useDisplayInstance
} from "@diamondlightsource/cs-web-lib";
import { APP_BAR_HEIGHT } from "../../utils/helper";
import { extractAncestorScreens } from "../../utils/screenUrlIdUtils";
import { Breadcrumbs } from "@mui/material";
import { NavigateNext, Lock, LockOpen } from "@mui/icons-material";
import { useContext, useEffect, useState } from "react";
import { StorageContext } from "../../contexts/LocalStorageContext";

type DisplayDescription = {
  gridLayout?: unknown;
};

const Paper = styled(MuiPaper)({
  height: `calc(100dvh - ${APP_BAR_HEIGHT}px - 10px)`,
  position: "absolute",
  inset: 5,
  overflow: "hidden"
});

export default function QuickScreenDisplay() {
  const [pendingCloseLocation, setPendingCloseLocation] = useState<
    string | null
  >(null);
  const fileContext = useContext(FileContext);
  const storage = useContext(StorageContext);
  const quickScreen = fileContext.pageState?.quickScreen;
  const bobQuickScreen = fileContext.pageState.bobQuickScreen;
  const { quickScreenEditable, setQuickScreenEditable } = storage;
  const {
    displayInstance,
    addDisplayInstanceByDescription,
    removeDisplayInstance
  } = useDisplayInstance(storage.bobDisplayUuid ?? "");

  const hasQuickScreen = !!quickScreen;
  const hasBobQuickScreen = !!bobQuickScreen;

  const bobBreadcrumbs = storage.bobScreenUrlId
    ? extractAncestorScreens(storage.bobScreenUrlId)
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
  }, [quickScreen?.path, addDisplayInstanceByDescription]);

  useEffect(() => {
    if (!displayInstance?.description) return;

    localStorage.setItem(
      "quickScreenSession",
      JSON.stringify({
        path: quickScreen?.path,
        macros: displayInstance.macros ?? {},
        description: displayInstance.description
      })
    );
  }, [
    quickScreen?.path,
    displayInstance?.description,
    displayInstance?.macros
  ]);

  return (
    <Paper elevation={12}>
      <Box sx={{ display: "flex", height: "100%" }}>
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
                  storage.setBobDisplayUuid(uuid);
                }}
                targetDisplayType="displayGridLayout"
                interactivity={{
                  editable: quickScreenEditable,
                  crossGridDragEnabled: false,
                  crossGridDropEnabled: true
                }}
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
                sx={{
                  position: "absolute",
                  bottom: 4,
                  left: 2,
                  right: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <Typography
                  aria-label="quick screen label"
                  variant="subtitle1"
                  color="textSecondary"
                >
                  Quick Screen{" "}
                  {quickScreen.path !== "" ? `: ${quickScreen?.path}` : ""}
                </Typography>
                <Tooltip
                  title={`${quickScreenEditable ? "Lock" : "Unlock"} Quick Screen for editing`}
                >
                  <Button
                    aria-label={`${quickScreenEditable ? "Lock" : "Unlock"} Quick Screen`}
                    onClick={() => setQuickScreenEditable(current => !current)}
                    sx={{
                      minWidth: 40,
                      width: 40,
                      height: 40
                    }}
                  >
                    {quickScreenEditable ? <LockOpen /> : <Lock />}
                  </Button>
                </Tooltip>
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
                interactivity={{
                  editable: false,
                  crossGridDragEnabled: true,
                  crossGridDropEnabled: false
                }}
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
                  separator={<NavigateNext fontSize="small" />}
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
      </Box>
    </Paper>
  );
}
