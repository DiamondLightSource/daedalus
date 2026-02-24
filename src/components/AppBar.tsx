import React from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import { APP_BAR_HEIGHT, DRAWER_WIDTH } from "../utils/helper";
import { Box, Tooltip } from "@mui/material";
import DiamondLogo from "../assets/DiamondLogoWhite.svg";
import { PageRouteInfo } from "../routes/PageRouteInfo";
import { useNavigate } from "react-router";

interface AppBarProps extends MuiAppBarProps {
  fullscreen: number;
  open?: boolean;
  drawerWidth?: number;
}

export const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== "open"
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  width: "100%",
  variants: [
    {
      props: ({ open, fullscreen }) => open && !fullscreen,
      style: {
        marginLeft: DRAWER_WIDTH,
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen
        })
      }
    },
    {
      props: ({ open, fullscreen }) => !open && !fullscreen,
      style: {
        marginLeft: `calc(${theme.spacing(7)} + 1px)`,
        width: `calc(100% - ${theme.spacing(7)} - 8px)`
      }
    }
  ]
}));

const DLSAppBar = (props: {
  fullScreen: boolean;
  open?: boolean;
  drawerWidth?: number;
  isResizingDrawer?: boolean;
  children?: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const {
    fullScreen,
    open,
    drawerWidth = DRAWER_WIDTH,
    isResizingDrawer
  } = props;
  const handleOpenSettings = () => {
    console.log("TO DO - create settings modal");
  };

  return (
    <>
      <CssBaseline />
      <StyledAppBar
        position="fixed"
        open={open}
        fullscreen={fullScreen ? 1 : 0}
        sx={{
          height: APP_BAR_HEIGHT,
          ...(open &&
            !fullScreen && {
              marginLeft: `${drawerWidth}px`,
              width: `calc(100% - ${drawerWidth}px)`,
              transition: isResizingDrawer
                ? "none"
                : theme =>
                    theme.transitions.create(["width", "margin"], {
                      easing: theme.transitions.easing.sharp,
                      duration: theme.transitions.duration.enteringScreen
                    })
            }),
          ...(!open &&
            !fullScreen && {
              marginLeft: theme => `calc(${theme.spacing(7)} + 1px)`,
              width: theme => `calc(100% - ${theme.spacing(7)} - 8px)`
            })
        }}
      >
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              width: "110px"
            }}
          >
            <img src={DiamondLogo} />
          </Box>
          <Box
            sx={{ pl: 1, display: "flex", flexDirection: "row", flexGrow: 1 }}
          >
            {props.children}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                flexGrow: 1
              }}
            >
              {PageRouteInfo.map(page => {
                return (
                  <Tooltip key={`PageNavButton_${page.name}`} title={page.name}>
                    <IconButton
                      color="inherit"
                      aria-label={page.ariaLabel}
                      size="small"
                      onClick={() => navigate(page.route)}
                    >
                      {page.icon}
                    </IconButton>
                  </Tooltip>
                );
              })}
              <Tooltip title="Settings">
                <IconButton
                  color="inherit"
                  aria-label="open settings"
                  size="small"
                  onClick={handleOpenSettings}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Toolbar>
      </StyledAppBar>
    </>
  );
};

export default DLSAppBar;
