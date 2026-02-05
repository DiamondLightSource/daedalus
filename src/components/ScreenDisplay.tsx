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
  RelativePosition
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

  useEffect(() => {
    // This catches file changes done inside the file by actionbuttons
    // and updates the URL to match the fileroute
    if (state.currentBeamline) {
      const pathname = decodeURI(location.pathname)
        .replace(`/synoptic`, "")
        .replace(`/${state.currentBeamline}/`, "");

      // Remove host from file name if necessary
      const displayedPath = fileContext.pageState.main.path.replace(
        state.beamlines[state.currentBeamline].host!,
        ""
      );

      const currentFile = selectFileMetadataByFilePathAndMacros(
        state.beamlines[state.currentBeamline].filePathIds,
        displayedPath,
        fileContext.pageState.main?.macros
      );

      if (currentFile?.urlId && currentFile.urlId !== pathname) {
        // URL and state are out of sync with file displayed, update accordingly, if currentFile is null this file is not in the JsonMap
        navigate(`/synoptic/${state.currentBeamline}/${currentFile?.urlId}`, {
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
              position={new RelativePosition()}
              scroll={false}
              showCloseButton={false}
            />
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
