import React from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from '@mui/icons-material/Settings';
import { useContext } from "react";
import BeamlineTreeStateContext from "../routes/MainPage";
import { APP_BAR_HEIGHT, DRAWER_WIDTH } from "../utils/helper";
import { Box, Grid, Tooltip } from "@mui/material";
import DiamondLogo from "../assets/DiamondLogoWhite.svg";
import { useHistory } from "react-router-dom";
import { PageRouteInfo } from "../routes/PageRouteInfo";

interface AppBarProps extends MuiAppBarProps {
  fullscreen: number;
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
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

const DLSAppBar = (props: { fullScreen: boolean, children?: React.ReactNode}) => {
  const history = useHistory();
  const { fullScreen } = props;
  const { state } = useContext(BeamlineTreeStateContext);

  const handleOpenSettings = () => {
    console.log("TO DO - create settings modal");
  };

  return (
    <>
      <CssBaseline />
      <AppBar
        position="absolute"
        open={state.menuBarOpen}
        fullscreen={fullScreen ? 1 : 0}
        sx={{ height: APP_BAR_HEIGHT }}
      >
        <Toolbar>
          <Grid container>
            <Grid item xs={1}>
              <img src={DiamondLogo} />
            </Grid>
            <Grid item xs={11} sx={{pl: 1}}>
              <Box sx={{ display: "flex", flexDirection: 'row' }}>
                {props.children}
                <Box sx={{ display: "flex", flexDirection: 'row', justifyContent: "flex-end", flexGrow: 1 }}>
                  {PageRouteInfo.map(card => {
                    return (
                      <Tooltip title={card.name}>
                        <IconButton
                          color="inherit"
                          aria-label={card.ariaLabel}
                          size="small"
                          onClick={() => history.push(card.route)}
                        >
                         { card.icon }
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
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default DLSAppBar;