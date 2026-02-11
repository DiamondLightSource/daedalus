import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { KeyboardDoubleArrowRight } from "@mui/icons-material";
import BeamlineSelect from "./BeamlineSelect";
import ScreenTreeView from "./ScreenTreeView";
import { useContext, useRef } from "react";
import { MenuContext } from "../routes/SynopticPage";
import { DRAWER_MIN_WIDTH, DRAWER_MAX_WIDTH } from "../utils/helper";

const openedMixin = (
  theme: Theme,
  width: number,
  isResizing: boolean
): CSSObject => ({
  width: width,
  transition: isResizing
    ? "none"
    : theme.transitions.create("width", {
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
  padding: theme.spacing(2, 1),
  position: "sticky",
  top: 0,
  zIndex: 1,
  backgroundColor: theme.palette.background.paper,
  flexShrink: 0,
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}));

const MenuBar = styled(MuiDrawer, {
  shouldForwardProp: prop =>
    prop !== "open" && prop !== "drawerWidth" && prop !== "isResizingDrawer"
})<{ open: boolean; drawerWidth: number; isResizingDrawer: boolean }>(
  ({ theme, drawerWidth, isResizingDrawer }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme, drawerWidth, isResizingDrawer),
          "& .MuiDrawer-paper": openedMixin(
            theme,
            drawerWidth,
            isResizingDrawer
          )
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
  })
);

export default function MiniMenuBar() {
  const theme = useTheme();
  const {
    menuOpen,
    setMenuOpen,
    drawerWidth,
    setDrawerWidth,
    isResizingDrawer,
    setIsResizingDrawer
  } = useContext(MenuContext);
  const isResizing = useRef(false);

  const handleDrawerOpen = () => {
    setMenuOpen(true);
  };

  const handleDrawerClose = () => {
    setMenuOpen(false);
  };

  const handleMouseDown = () => {
    isResizing.current = true;
    setIsResizingDrawer(true);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;
    const newWidth = e.clientX;
    if (newWidth >= DRAWER_MIN_WIDTH && newWidth <= DRAWER_MAX_WIDTH) {
      setDrawerWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    setIsResizingDrawer(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box sx={{ display: "flex", position: "relative" }}>
        <MenuBar
          variant="permanent"
          open={menuOpen}
          drawerWidth={drawerWidth}
          isResizingDrawer={isResizingDrawer}
        >
          <MenuBarHeader>
            {menuOpen ? (
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
          <ScreenTreeView />
        </MenuBar>
        {menuOpen && (
          <Box
            onMouseDown={handleMouseDown}
            sx={{
              width: "5px",
              cursor: "col-resize",
              position: "absolute",
              right: -2,
              top: 0,
              bottom: 0,
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "primary.main",
                opacity: 0.3
              }
            }}
          />
        )}
      </Box>
    </Box>
  );
}
