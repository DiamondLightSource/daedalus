import { styled, Theme, CSSObject } from "@mui/material/styles";
import { Box, Divider } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import ScreenTreeView from "./ScreenTreeView";
import { useContext } from "react";
import { APP_BAR_HEIGHT, DRAWER_WIDTH } from "../utils/helper";
import { MenuContext } from "../contexts/MenuContext";
import PageNavigationList from "./PageNavigationList";
import { BeamlineTreeStateContext } from "../contexts/BeamlineTreeStateContext";

const openedMixin = (theme: Theme): CSSObject => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: "hidden"
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
});

const MenuBar = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== "open"
})<{ open: boolean }>(({ theme }) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme)
      }
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme)
      }
    }
  ]
}));

export default function MiniMenuBar({
  synopticView
}: {
  synopticView: boolean;
}) {
  const { state } = useContext(BeamlineTreeStateContext);
  const { menuOpen } = useContext(MenuContext);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box sx={{ display: "flex", position: "relative" }}>
        <MenuBar variant="permanent" open={menuOpen}>
          <Box sx={{ height: APP_BAR_HEIGHT, flexShrink: 0 }} />
          <PageNavigationList collapsed={!menuOpen} />
          {synopticView && menuOpen && state.filesLoaded && (
            <>
              <Divider />
              <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
                <ScreenTreeView />
              </Box>
              <Divider />
            </>
          )}
        </MenuBar>
      </Box>
    </Box>
  );
}
