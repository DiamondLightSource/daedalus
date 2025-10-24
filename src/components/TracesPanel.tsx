import { styled } from "@mui/material/styles";
import Drawer, { DrawerProps as MuiDrawerProps } from "@mui/material/Drawer";
import {
  Checkbox,
  CSSObject,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  Typography
} from "@mui/material";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import { useContext } from "react";
import { OPEN_MENU_BAR } from "../store";
import { Color } from "@diamondlightsource/cs-web-lib";
import { DRAWER_WIDTH } from "../utils/helper";
import { BeamlineTreeStateContext } from "../App";

interface DrawerProps extends MuiDrawerProps {
  archiverMenuOpen?: boolean;
}

const openedMixin = (theme: Theme, archiverMenuOpen?: boolean): CSSObject => ({
  height: "300px",
  overflowY: "hidden",
  [theme.breakpoints.up("sm")]: {
    width: archiverMenuOpen
      ? `calc(100% - ${DRAWER_WIDTH}px - 6px)`
      : `calc(100% - ${theme.spacing(8)} - 6px)`,
    marginLeft: archiverMenuOpen
      ? `calc(${DRAWER_WIDTH}px + 5px)`
      : `calc(${theme.spacing(8)} + 6px)`
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
        width: archiverMenuOpen
          ? `calc(100% - ${DRAWER_WIDTH}px - 5px)`
          : `calc(100% - ${theme.spacing(8)} + 6px)`,
        ...openedMixin(theme, archiverMenuOpen),
        "& .MuiDrawer-paper": openedMixin(theme, archiverMenuOpen)
      }
    },
    {
      props: ({ open }) => !open,
      style: {
        height: "0px",
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme)
      }
    }
  ]
}));


export default function TracesPanel() {
  const { state, dispatch } = useContext(BeamlineTreeStateContext);

  const closeTracesPanel = () => {
    dispatch({
      type: OPEN_MENU_BAR,
      payload: { open: false, type: "traces" }
    });
  };

  return (
    <MenuBar
      archiverMenuOpen={state.menuBarsOpen.archiver}
      open={state.menuBarsOpen.traces}
      variant="permanent"
      anchor="bottom"
      sx={{ position: "absolute" }}
      PaperProps={{ elevation: 8 }}
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
      <Typography variant="h1" sx={{ marginLeft: 2 }}>
        Traces
      </Typography>
      <TracesGrid togglePalette={false} />
    </MenuBar>
  );
}

/**
 * A grid of all components
 */
function TracesGrid(props: { togglePalette: any }) {
  const { togglePalette } = props;
  // This includes a label for each, and then a basic implementation of it
  function createData(pv: string, show: boolean, colour: Color, type: string) {
    return { pv, show, colour, type };
  }

  // Fake test PVS
  const rows = [
    createData("BL07-TEST-01", true, Color.fromRgba(10, 20, 150), "Line"),
    createData("BL07-TEST-02", false, Color.fromRgba(100, 100, 120), "Line"),
    createData("BL07-TEST-03", true, Color.fromRgba(40, 45, 200), "Area")
  ];

  return (
    <>
      <Grid
        container
        spacing={1}
        rowSpacing={1}
        padding={"5px"}
        marginLeft={"10px"}
      >
        <Grid item xs={6}>
          <TableContainer component={Paper} sx={{ height: "100%" }}>
            <Table aria-label="pv-table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>PV</b>
                  </TableCell>
                  <TableCell>
                    <b>Show</b>
                  </TableCell>
                  <TableCell>
                    <b>Colour</b>
                  </TableCell>
                  <TableCell>
                    <b>Trace Type</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow
                    key={row.pv}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "& .MuiTableCell-root": {
                        height: "10px",
                        padding: "0"
                      }
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row.pv}
                    </TableCell>
                    <TableCell>
                      <Checkbox checked={row.show} />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.colour.toString()}
                    </TableCell>
                    <TableCell>
                      <Select value={row.type} sx={{ margin: "2px" }}>
                        <MenuItem value={"Line"}>Line</MenuItem>
                        <MenuItem value={"Area"}>Area</MenuItem>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
}