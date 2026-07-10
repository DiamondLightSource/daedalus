import {
  CssBaseline,
  Paper as MuiPaper,
  styled
} from "@mui/material";
import {
  EmbeddedDisplay,
  newRelativePosition
} from "@diamondlightsource/cs-web-lib";
import {
  useWindowWidth,
  APP_BAR_HEIGHT,
  useWindowHeight
} from "../utils/helper";
import DLSAppBar from "./AppBar";

const Paper = styled(MuiPaper)(({ theme }) => ({
  height: `calc(${useWindowHeight()}px - 30px - ${theme.spacing(7)})`,
  width: `calc(${useWindowWidth()}px - ${theme.spacing(7)})`,
  margin: `calc(${APP_BAR_HEIGHT}px + 20px) 5px 5px 5px`
}));

export default function QuickScreens() {

  return (
    <>
      <CssBaseline />
      <DLSAppBar fullScreen={true} open={true} />
      <Paper elevation={12}>
            <EmbeddedDisplay
              file={{
                path: "/BOBs/demo/quickScreens_grid_layout.bob",
                defaultProtocol: "ca",
                macros: {}
              }}
              position={newRelativePosition()}
              scroll={false}
            />
      </Paper>
    </>
  );
}
