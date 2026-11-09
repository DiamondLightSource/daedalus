import { useContext, useEffect, useRef, useState } from "react";
import { IconButton, Paper as MuiPaper, styled, Tooltip } from "@mui/material";
import {
  DynamicPageWidget,
  FileContext,
  newRelativePosition,
  useNotification
} from "@diamondlightsource/cs-web-lib";
import { useLocation, useNavigate } from "react-router";
import { selectFileMetadataByFilePathAndMacros } from "../../utils/parser";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { FileMetadata } from "../../store";
import { executeOpenQuickScreen } from "../../utils/csWebLibActions";
import { BeamlineTreeStateContext } from "../../contexts/BeamlineTreeStateContext";
import { APP_BAR_HEIGHT } from "../../utils/helper";

const Paper = styled(MuiPaper)({
  height: `calc(100dvh - ${APP_BAR_HEIGHT}px - 10px)`,
  position: "absolute",
  inset: 5,
  overflow: "hidden"
});

export default function ScreenDisplay() {
  const { state } = useContext(BeamlineTreeStateContext);
  const fileContext = useContext(FileContext);
  const navigate = useNavigate();
  const location = useLocation();
  const displayUuidRef = useRef<string>();
  const { showWarning } = useNotification();

  const selectedBeamlineId = state.currentBeamline;
  const beamlineState = state.beamlines[selectedBeamlineId];
  const [currentScreenIsSynoptic, setCurrentScreenIsSynoptic] = useState(false);

  useEffect(() => {
    // This catches a file change triggered by an action buttons
    // and updates the URL to match the fileroute
    if (selectedBeamlineId) {
      const pathname = decodeURI(location.pathname)
        .replace(`/synoptic`, "")
        .replace(`/${selectedBeamlineId}/`, "");

      // Remove host from file name if necessary
      const displayedPath = fileContext.pageState.main.path.replace(
        beamlineState.host!,
        ""
      );

      const currentFile = selectFileMetadataByFilePathAndMacros(
        beamlineState.filePathIds,
        displayedPath,
        fileContext.pageState.main?.macros
      );
      setCurrentScreenIsSynoptic(checkIfFileIsSynoptic(currentFile));

      if (currentFile?.urlId && currentFile.urlId !== pathname) {
        // URL and state are out of sync with file displayed, update accordingly, if currentFile is null this file is not in the JsonMap
        navigate(`/synoptic/${selectedBeamlineId}/${currentFile?.urlId}`, {
          state: location.state,
          replace: true
        });
      }
    }
  }, [
    fileContext.pageState.main,
    beamlineState,
    location,
    navigate,
    selectedBeamlineId
  ]);

  const handleQuickScreenClick = () => {
    try {
      // Opens new quick screen page, passing current file state
      const newScreen = location.state.pageState.main;
      executeOpenQuickScreen(
        newScreen.path,
        "bobQuickScreen",
        newScreen.macros ?? {},
        fileContext,
        ""
      );
    } catch (e) {
      showWarning(
        "Failed to convert .bob to Quick Screen. Please check the .bob file is loaded correctly."
      );
    }
  };

  return (
    <Paper>
      {state.currentBeamline && state.currentScreenUrlId ? (
        <>
          <DynamicPageWidget
            location={"main"}
            position={newRelativePosition(undefined, undefined, "100%", "100%")}
            scroll={false}
            showCloseButton={false}
            mjpgEndpoint={beamlineState?.mjpgEndpoint}
            widgetIdsCallback={uuid => {
              // The uuid allows the json representation of the display instance to be selected from the redux store
              displayUuidRef.current = uuid;
            }}
          />
          {currentScreenIsSynoptic ? (
            <></>
          ) : (
            <Tooltip title="Edit .bob file in Quick Screens view">
              <IconButton
                color="inherit"
                sx={{
                  zIndex: 10,
                  top: "93%",
                  left: "95%",
                  position: "absolute"
                }}
                onClick={handleQuickScreenClick}
              >
                <RateReviewIcon
                  sx={{
                    width: "36px",
                    height: "36px",
                    color: "inherit"
                  }}
                />
              </IconButton>
            </Tooltip>
          )}
        </>
      ) : (
        <></>
      )}
    </Paper>
  );
}

function checkIfFileIsSynoptic(screen: FileMetadata | undefined): boolean {
  if (!screen) return false;
  if (
    !screen.urlId.includes("/") ||
    screen.file === "index.bob" ||
    screen.file.includes("index-")
  )
    return true;
  return false;
}
