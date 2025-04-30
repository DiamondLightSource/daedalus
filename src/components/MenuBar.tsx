import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { KeyboardDoubleArrowRight } from "@mui/icons-material";
import BeamlineSelect from "./BeamlineSelect";
import ScreenTreeView from "./ScreenTreeView";
import { useContext } from "react";
import BeamlineTreeStateContext from "../routes/MainPage";
import { OPEN_MENU_BAR } from "../store";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
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

const MenuBarHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}));

const MenuBar = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== "open"
})(({ theme }) => ({
  width: drawerWidth,
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

export default function MiniMenuBar() {
  const theme = useTheme();
  const { state, dispatch } = useContext(BeamlineTreeStateContext);

  const handleDrawerOpen = () => {
    dispatch({ type: OPEN_MENU_BAR, payload: { open: true } });
  };

  const handleDrawerClose = () => {
    dispatch({ type: OPEN_MENU_BAR, payload: { open: false } });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <MenuBar variant="permanent" open={state.menuBarOpen}>
        <MenuBarHeader>
          {state.menuBarOpen ? (
            <>
              <BeamlineSelect />
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </>
          ) : (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
            >
              <KeyboardDoubleArrowRight />
            </IconButton>
          )}
        </MenuBarHeader>
        {state.menuBarOpen ? <Divider /> : <></>}
        <ScreenTreeView />
      </MenuBar>
    </Box>
  );
}
