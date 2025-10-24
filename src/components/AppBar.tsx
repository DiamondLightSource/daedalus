import React from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from '@mui/icons-material/Settings';
import { useContext } from "react";
import { APP_BAR_HEIGHT, DRAWER_WIDTH } from "../utils/helper";
import { Box, Tooltip } from "@mui/material";
import DiamondLogo from "../assets/DiamondLogoWhite.svg";
import { useHistory } from "react-router-dom";
import { PageRouteInfo } from "../routes/PageRouteInfo";
import { BeamlineTreeStateContext } from "../App";

interface AppBarProps extends MuiAppBarProps {
  fullscreen: number;
  open?: boolean;
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

const DLSAppBar = (props: { fullScreen: boolean, page: string, children?: React.ReactNode}) => {
  const history = useHistory();
  const { fullScreen } = props;
  const { state } = useContext(BeamlineTreeStateContext);

  const handleOpenSettings = () => {
    console.log("TO DO - create settings modal");
  };
  const open = props.page === "synoptic" ? state.menuBarsOpen.synoptic : state.menuBarsOpen.archiver;

  return (
    <>
      <CssBaseline />
      <StyledAppBar
        position="absolute"
        open={open}
        fullscreen={fullScreen ? 1 : 0}
        sx={{ height: APP_BAR_HEIGHT }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", flexDirection: 'row', justifyContent: "flex-start", width: "110px"}}>
            <img src={DiamondLogo} />
          </Box>
          <Box sx={{ pl: 1, display: "flex", flexDirection: 'row', flexGrow: 1 }}>
            {props.children}
            <Box sx={{ display: "flex", flexDirection: 'row', justifyContent: "flex-end", flexGrow: 1 }}>
              {PageRouteInfo.map(page => {
                return (
                  <Tooltip key={`PageNavButton_${page.name}`} title={page.name}>
                    <IconButton
                      color="inherit"
                      aria-label={page.ariaLabel}
                      size="small"
                      onClick={() => history.push(page.route)}
                    >
                     { page.icon }
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
}

export default DLSAppBar;