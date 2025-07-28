import { useContext } from "react";
import {
  Box,
  Paper as MuiPaper,
  PaperProps as MuiPaperProps,
  styled
} from "@mui/material";
import {
  useWindowWidth,
  useWindowHeight,
  DRAWER_WIDTH,
  APP_BAR_HEIGHT,
  TRACES_PANEL_HEIGHT
} from "../utils/helper";
import DataBrowserStateContext from "../routes/DataBrowserPage";

interface PaperProps extends MuiPaperProps {
  propertiesOpen?: boolean;
  tracesOpen?: boolean
}

const Paper = styled(MuiPaper, {
  shouldForwardProp: prop => prop !== "open"
})<PaperProps>(({ theme }) => ({
  margin: `calc(${APP_BAR_HEIGHT}px + 5px) 5px 5px 5px`,
  variants: [
    {
      props: ({ propertiesOpen }) => propertiesOpen,
      style: {
        width: `calc(${useWindowWidth()}px - 10px - ${DRAWER_WIDTH}px)`,
      }
    },
    {
      props: ({ propertiesOpen }) => !propertiesOpen,
      style: {
        width: `calc(${useWindowWidth()}px - 10px - ${theme.spacing(7)} - 8px)`,
      }
    },
    {
      props: ({ tracesOpen }) => tracesOpen,
      style: {
        height: `calc(${useWindowHeight()}px - ${APP_BAR_HEIGHT}px - 10px - ${TRACES_PANEL_HEIGHT}px)`
      }
    },
    {
      props: ({ tracesOpen }) => !tracesOpen,
      style: {
        height: `calc(${useWindowHeight()}px - ${APP_BAR_HEIGHT}px - 10px )`
      }
    }
  ]
}));

export default function DataBrowserPlot() {
  const { state } = useContext(DataBrowserStateContext);

  return (
    <Paper component="main" propertiesOpen={state.archiverMenuBarOpen} tracesOpen={state.tracesPanelOpen}>
      <Box>
        <Box>
        </Box>
      </Box>
    </Paper>
  );
}
