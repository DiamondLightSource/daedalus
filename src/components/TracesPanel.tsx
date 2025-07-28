import { styled } from "@mui/material/styles";
import Drawer, { DrawerProps as MuiDrawerProps} from "@mui/material/Drawer";
import { CSSObject, IconButton, Theme } from "@mui/material";
import Grid from "@mui/material/Grid";
import CloseIcon from '@mui/icons-material/Close';
import { ARCHIVER_SEARCH_DRAWER_WIDTH } from "./ArchiverMenuBar";
import { useContext } from "react";
import DataBrowserStateContext from "../routes/DataBrowserPage";
import { TOGGLE_TRACES_PANEL } from "../store";

interface DrawerProps extends MuiDrawerProps {
  archiverMenuOpen?: boolean;
}

const openedMixin = (theme: Theme, archiverMenuOpen?: boolean): CSSObject => ({
  height: "300px",
  overflowY: "hidden",
  [theme.breakpoints.up("sm")]: {
    width: archiverMenuOpen ? `calc(100% - ${ARCHIVER_SEARCH_DRAWER_WIDTH}px - 6px)` : `calc(100% - ${theme.spacing(8)} - 6px)`,
    marginLeft: archiverMenuOpen ? `calc(${ARCHIVER_SEARCH_DRAWER_WIDTH}px + 5px)` : `calc(${theme.spacing(8)} + 6px)`
  }
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: "hidden",
  [theme.breakpoints.up("sm")]: {
    height: "0px"
  }
});

const MenuBar = styled(Drawer, {
  shouldForwardProp: prop => prop !== "open" && prop !== "archiverMenuOpen"
})<DrawerProps>(({ theme, archiverMenuOpen }) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: archiverMenuOpen ? `calc(100% - ${ARCHIVER_SEARCH_DRAWER_WIDTH}px - 5px)` : `calc(100% - ${theme.spacing(8)} + 6px)`,
        ...openedMixin(theme, archiverMenuOpen),
        "& .MuiDrawer-paper": openedMixin(theme, archiverMenuOpen),    }
    },
    {
      props: ({ open }) => !open,
      style: {
        height: "0px",
        ...closedMixin(theme, ),
        "& .MuiDrawer-paper": closedMixin(theme)
      }
    },
  ]
}));

export interface TracesProps {}

export default function TracesPanel(props: TracesProps) {
  const { state, dispatch } = useContext(DataBrowserStateContext)

  const closeTracesPanel = () => {
    dispatch({
      type: TOGGLE_TRACES_PANEL,
      payload: { open: false }
    });
  }

  return (
    <MenuBar
        archiverMenuOpen={state.archiverMenuBarOpen}
        open={state.tracesPanelOpen}
        variant="permanent"
        anchor="bottom"
        sx={{position: "absolute"}}
        PaperProps={{ elevation: 8}}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          sx={{
            position: "absolute",
            left: "97%"
          }}
          onClick={closeTracesPanel}
        >
          <CloseIcon />
        </IconButton>
        hewwo
      </MenuBar>
  );
}

/**
 * A grid of all components
 */
function TracesGrid(props: { togglePalette: any }) {
  const { togglePalette } = props;
  // This includes a label for each, and then a basic implementation of it

  return (
    <>
      
      <Grid container spacing={2} rowGap={3} padding={"15px"}>
        
      </Grid>
    </>
  );
}
