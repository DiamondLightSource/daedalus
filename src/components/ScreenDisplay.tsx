import { useContext, useEffect } from "react";
import {
  Box,
  Paper as MuiPaper,
  PaperProps as MuiPaperProps,
  styled
} from "@mui/material";
import {
  DynamicPageWidget,
  FileContext,
  newRelativePosition
} from "@diamondlightsource/cs-web-lib";
import {
  useWindowWidth,
  useWindowHeight,
  DRAWER_WIDTH,
  APP_BAR_HEIGHT
} from "../utils/helper";
import { BeamlineTreeStateContext } from "../App";
import { MenuContext } from "../routes/SynopticPage";
import { useLocation, useNavigate } from "react-router";
import { selectFileMetadataByFilePathAndMacros } from "../utils/parser";

interface PaperProps extends MuiPaperProps {
  open?: boolean;
  drawerWidth?: number;
}

const Paper = styled(MuiPaper, {
  shouldForwardProp: prop => prop !== "open" && prop !== "drawerWidth"
})<PaperProps>(({ theme, open, drawerWidth = DRAWER_WIDTH }) => ({
  height: `calc(${useWindowHeight()}px - ${APP_BAR_HEIGHT}px - 10px)`,
  margin: `calc(${APP_BAR_HEIGHT}px + 5px) 5px 5px 5px`,
  ...(open && {
    width: `calc(${useWindowWidth()}px - 10px - ${drawerWidth}px)`
  }),
  ...(!open && {
    width: `calc(${useWindowWidth()}px - 10px - ${theme.spacing(7)} - 8px)`
  })
}));

export default function ScreenDisplay() {
  const { state } = useContext(BeamlineTreeStateContext);
  const { menuOpen, drawerWidth } = useContext(MenuContext);
  const fileContext = useContext(FileContext);
  const navigate = useNavigate();
  const location = useLocation();

  const selectedBeamlineId = state.currentBeamline;
  const beamlineState = state.beamlines[selectedBeamlineId];

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

      if (currentFile?.urlId && currentFile.urlId !== pathname) {
        // URL and state are out of sync with file displayed, update accordingly, if currentFile is null this file is not in the JsonMap
        navigate(`/synoptic/${selectedBeamlineId}/${currentFile?.urlId}`, {
          state: location.state,
          replace: true
        });
      }
    }
  }, [fileContext.pageState.main]);

  return (
    <Paper component="main" open={menuOpen} drawerWidth={drawerWidth}>
      <Box>
        <Box>
          {state.currentBeamline && state.currentScreenUrlId ? (
            <DynamicPageWidget
              location={"main"}
              position={newRelativePosition()}
              scroll={false}
              showCloseButton={false}
              mjpgEndpoint={beamlineState?.mjpgEndpoint}
            />
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
