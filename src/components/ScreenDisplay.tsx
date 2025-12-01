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
import { MenuContext } from "../routes/MainPage";
import { useNavigate, useLocation } from "react-router-dom-v5-compat";

interface PaperProps extends MuiPaperProps {
  open?: boolean;
}

const Paper = styled(MuiPaper, {
  shouldForwardProp: prop => prop !== "open"
})<PaperProps>(({ theme }) => ({
  height: `calc(${useWindowHeight()}px - ${APP_BAR_HEIGHT}px - 10px)`,
  margin: `calc(${APP_BAR_HEIGHT}px + 5px) 5px 5px 5px`,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(${useWindowWidth()}px - 10px - ${DRAWER_WIDTH}px)`
      }
    },
    {
      props: ({ open }) => !open,
      style: {
        width: `calc(${useWindowWidth()}px - 10px - ${theme.spacing(7)} - 8px)`
      }
    }
  ]
}));

export default function ScreenDisplay() {
  const { state } = useContext(BeamlineTreeStateContext);
  const { menuOpen } = useContext(MenuContext);
  const fileContext = useContext(FileContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // This catches file changes done inside the file by actionbuttons
    // and updates the URL to match the fileroute
    if (state.currentBeamline) {
      const pathname = location.pathname.replace(
        `/${state.currentBeamline}/`,
        ""
      );
      // Remove host from file name if necessary
      const displayedPath = fileContext.pageState.main.path.replace(
        state.beamlines[state.currentBeamline].host!,
        ""
      );
      const allFiles = state.beamlines[state.currentBeamline].filePathIds;
      const currentPath = Object.keys(allFiles).find(
        key => allFiles[key].file === displayedPath
      );
      if (currentPath !== pathname) {
        // URL and state are out of sync with file displayed, update accordingly
        navigate(`/synoptic/${state.currentBeamline}/${currentPath}`, { state: location.state, replace: true } );
      }
    }
  }, [fileContext.pageState.main]);

  return (
    <Paper component="main" open={menuOpen}>
      <Box>
        <Box>
          {state.currentBeamline && state.currentScreenId ? (
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
