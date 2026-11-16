import { IconButton, Paper as MuiPaper, styled } from "@mui/material";
import { APP_BAR_HEIGHT } from "../../utils/helper";
import {
  EmbeddedDisplay,
  newRelativePosition
} from "@diamondlightsource/cs-web-lib";
import SsidChartIcon from "@mui/icons-material/SsidChart";
import { useContext } from "react";
import { MenuContext } from "../../contexts/MenuContext";

const Paper = styled(MuiPaper)({
  height: `calc(100dvh - ${APP_BAR_HEIGHT}px - 10px)`,
  position: "absolute",
  inset: 5,
  overflow: "hidden"
});

export default function DataBrowserPlot() {
  const { setTracesPanelOpen } = useContext(MenuContext);

  const openTracesPanel = () => {
    setTracesPanelOpen?.(true);
  };

  return (
    <Paper>
      <EmbeddedDisplay
        file={{
          path: "/BOBs/databrowser/demo.bob",
          defaultProtocol: "ca",
          macros: {}
        }}
        position={newRelativePosition("0", "0", "100%", "100%")}
        scroll={false}
        resize={"scroll-content"}
      />
      <IconButton
        color="inherit"
        onClick={openTracesPanel}
        sx={{ position: "absolute", right: "1%", top: "95%" }}
      >
        <SsidChartIcon />
      </IconButton>
    </Paper>
  );
}
