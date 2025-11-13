import { useContext } from "react";
import {
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
import {
  EmbeddedDisplay,
  RelativePosition
} from "@diamondlightsource/cs-web-lib";
import { MenuContext } from "../routes/DataBrowserPage";

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
        width: `calc(${useWindowWidth()}px - ${DRAWER_WIDTH}px - 5px)`
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
  const { menusOpen } = useContext(MenuContext);
  return (
    <Paper
      component="main"
      propertiesopen={menusOpen.archiver ? 1 : 0}
      tracesopen={menusOpen.trace ? 1 : 0}
    >
      <EmbeddedDisplay
        file={{
          path: "/BOBs/databrowser/demo.bob",
          defaultProtocol: "ca",
          macros: {}
        }}
        position={new RelativePosition("0", "0", "100%", "100%")}
        scroll={false}
        resize={"scroll-content"}
      />
    </Paper>
  );
}
