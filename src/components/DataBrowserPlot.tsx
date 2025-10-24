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
import { BeamlineTreeStateContext } from "../App";

interface PaperProps extends MuiPaperProps {
  propertiesopen?: number;
  tracesopen?: number;
}

const Paper = styled(MuiPaper, {
  shouldForwardProp: prop => prop !== "open"
})<PaperProps>(({ theme }) => ({
  margin: `calc(${APP_BAR_HEIGHT}px + 5px) 5px 5px 5px`,
  variants: [
    {
      props: ({ propertiesopen }) => propertiesopen,
      style: {
        width: `calc(${useWindowWidth()}px- ${DRAWER_WIDTH}px)`
      }
    },
    {
      props: ({ propertiesopen }) => !propertiesopen,
      style: {
        width: `calc(${useWindowWidth()}px - 10px - ${theme.spacing(7)} - 8px)`
      }
    },
    {
      props: ({ tracesopen }) => tracesopen,
      style: {
        height: `calc(${useWindowHeight()}px - ${APP_BAR_HEIGHT}px - 10px - ${TRACES_PANEL_HEIGHT}px)`
      }
    },
    {
      props: ({ tracesopen }) => !tracesopen,
      style: {
        height: `calc(${useWindowHeight()}px - ${APP_BAR_HEIGHT}px - 10px )`
      }
    }
  ]
}));

export default function DataBrowserPlot() {
  const { state } = useContext(BeamlineTreeStateContext);

  return (
    <Paper
      component="main"
      propertiesopen={state.menuBarsOpen.archiver ? 1 : 0}
      tracesopen={state.menuBarsOpen.traces ? 1 : 0}
    >
      <Box>
        <Box></Box>
      </Box>
    </Paper>
  );
}