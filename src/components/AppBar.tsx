import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useContext } from "react";
import BeamlineTreeStateContext from "../routes/MainPage";
import { APP_BAR_HEIGHT, DRAWER_WIDTH } from "../utils/helper";
import { Breadcrumbs, Link } from "@mui/material";
import { executeAction, FileContext } from "@diamondlightsource/cs-web-lib";

interface AppBarProps extends MuiAppBarProps {
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
  variants: [
    {
      props: ({ open }) => open,
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
      props: ({ open }) => !open,
      style: {
        marginLeft: `calc(${theme.spacing(7)} + 1px)`,
        width: `calc(100% - ${theme.spacing(7)} - 8px)`
      }
    }
  ]
}));

export default function DLSAppBar() {
  const { state } = useContext(BeamlineTreeStateContext);
  const fileContext = useContext(FileContext);

  const handleOpenSettings = () => {
    console.log("TO DO - create settings modal");
  };

  function handleClick(event: any) {
    if (event.target.pathname) {
      event.preventDefault();
      const screenId = decodeURI(event.target.pathname)
        .split("/")
        .at(-1) as string;
      const newScreen =
        state.beamlines[state.currentBeamline].host + state.beamlines[state.currentBeamline].filePathIds[screenId];
      executeAction(
        {
          type: "OPEN_PAGE",
          dynamicInfo: {
            name: newScreen,
            location: "main",
            description: undefined,
            file: {
              path: newScreen,
              macros: {},
              defaultProtocol: "ca"
            }
          }
        },
        fileContext,
        undefined,
        {},
        event.target.pathname
      );
    }
  }

  const breadcrumbs = createBreadcrumbs(
    state.currentScreenId,
    state.currentBeamline
  );

  return (
    <>
      <CssBaseline />
      <AppBar
        position="absolute"
        open={state.menuBarOpen}
        sx={{ height: APP_BAR_HEIGHT }}
      >
        <Toolbar>
          <Breadcrumbs
            onClick={handleClick}
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{
              marginBottom: "10px",
              p: 2,
              paddingBottom: 0,
              textAlign: "left",
              color: "white",
              display: "flex",
              flexGrow: 1
            }}
          >
            {breadcrumbs}
          </Breadcrumbs>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleOpenSettings}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  );
}

/**
 * Navigates the screen Treeview to determine the correct
 * breadcrumb trail
 */
function createBreadcrumbs(screenId: string, beamline: string) {
  const breadcrumbs: any[] = [];
  if (beamline === "") return [];
  const breadcrumbLabels = screenId.split("+");
  let linkUrl = `/${beamline}/`;
  breadcrumbLabels.forEach((label, idx) => {
    if (idx !== 0) linkUrl += "+";
    linkUrl += label;
    breadcrumbs.push(
      idx === breadcrumbLabels.length - 1 ? (
        <Typography key="3" sx={{ color: "white" }}>
          {label}
        </Typography>
      ) : (
        <Link underline="hover" key={idx} color="white" href={linkUrl}>
          {label}
        </Link>
      )
    );
  });
  return breadcrumbs;
}
