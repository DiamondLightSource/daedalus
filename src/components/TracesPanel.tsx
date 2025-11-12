import { styled } from "@mui/material/styles";
import Drawer, { DrawerProps as MuiDrawerProps } from "@mui/material/Drawer";
import {
  Box,
  Button,
  Checkbox,
  CSSObject,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Theme,
  Typography
} from "@mui/material";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import { useContext, useState } from "react";
import { OPEN_MENU_BAR } from "../store";
import { Color } from "@diamondlightsource/cs-web-lib";
import { DRAWER_WIDTH } from "../utils/helper";
import { BeamlineTreeStateContext } from "../App";

interface DrawerProps extends MuiDrawerProps {
  archiverMenuOpen?: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function TracesPanel() {
  const { state, dispatch } = useContext(BeamlineTreeStateContext);

  const [tab, setTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, value: number) => {
    setTab(value);
  };
  const closeTracesPanel = () => {
    dispatch({
      type: OPEN_MENU_BAR,
      payload: { open: false, page: "traces" }
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
          left: "96%"
        }}
        onClick={closeTracesPanel}
      >
        <CloseIcon />
      </IconButton>
      <Tabs value={tab} onChange={handleTabChange} sx={{ width: "90%" }}>
        <Tab label="Traces" />
        <Tab label="Time Axis" />
        <Tab label="Value Axes" />
      </Tabs>
      <CustomTabPanel value={tab} index={0}>
        <TracesGrid />
      </CustomTabPanel>
      <CustomTabPanel value={tab} index={1}>
        <TimeAxisGrid />
      </CustomTabPanel>
      <CustomTabPanel value={tab} index={2}>
        <ValueAxesGrid />
      </CustomTabPanel>
    </MenuBar>
  );
}

/**
 * A demo table of all Trace components and configuration
 */
function TracesGrid() {
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
      <Grid container spacing={1} rowSpacing={1}>
        <Grid item xs={8}>
          <TableContainer
            component={Paper}
            sx={{ height: "100%", textAlign: "center" }}
          >
            <Table aria-label="pv-table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ textAlign: "center" }}>
                    <b>PV</b>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <b>Show</b>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <b>Colour</b>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
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
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ textAlign: "center" }}
                    >
                      {row.pv}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Checkbox checked={row.show} />
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ textAlign: "center" }}
                    >
                      {row.colour.toString()}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
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

/**
 * Demo Time Axis configuration
 * @returns
 */
function TimeAxisGrid() {
  return (
    <>
      <Grid
        container
        spacing={0}
        rowSpacing={1}
        sx={{ width: "40%", paddingTop: "0px", alignItems: "center" }}
      >
        <Grid item xs={2}>
          <Typography>Start Time:</Typography>
        </Grid>
        <Grid item xs={4}>
          <TextField size="small"></TextField>
        </Grid>
        <Grid item xs={2}>
          <Typography>End Time:</Typography>
        </Grid>
        <Grid item xs={4}>
          <TextField size="small"></TextField>
        </Grid>
        <Grid item xs={1}>
          <Typography>Grid:</Typography>
        </Grid>
        <Grid
          item
          xs={11}
          sx={{ "&.MuiGrid-item": { paddingTop: "0px", paddingRight: "0px" } }}
        >
          <Checkbox />
        </Grid>
        <Grid item xs={2}>
          <Button>30 minutes</Button>
        </Grid>
        <Grid item xs={2}>
          <Button>1 hour</Button>
        </Grid>
        <Grid item xs={2}>
          <Button>12 hours</Button>
        </Grid>
        <Grid item xs={2}>
          <Button>1 day</Button>
        </Grid>
        <Grid item xs={2}>
          <Button>7 days</Button>
        </Grid>
      </Grid>
    </>
  );
}

/**
 * A table of all Trace components and configuration
 */
function ValueAxesGrid() {
  return (
    <>
      <Grid container spacing={1} rowSpacing={1}>
        <Grid item xs={12}>
          <TableContainer
            component={Paper}
            sx={{ height: "100%", textAlign: "center" }}
          >
            <Table aria-label="pv-table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ textAlign: "center" }}>
                    <b>Show</b>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <b>Axis Name</b>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <b>Trace Number</b>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <b>Grid</b>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <b>On Right</b>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <b>Color</b>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <b>Min</b>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <b>Max</b>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <b>Auto-Scale</b>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <b>Log. Scale</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  key={"demo"}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "& .MuiTableCell-root": {
                      height: "10px",
                      padding: "0"
                    }
                  }}
                >
                  <TableCell sx={{ textAlign: "center" }}>
                    <Checkbox checked={true} />
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ textAlign: "center" }}
                  >
                    Axis Name
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ textAlign: "center" }}
                  >
                    PV Name
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Checkbox checked={false} />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Checkbox checked={false} />
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ textAlign: "center" }}
                  >
                    RGBA(255, 40, 1)
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ textAlign: "center" }}
                  >
                    0
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ textAlign: "center" }}
                  >
                    300
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Checkbox checked={true} />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Checkbox checked={true} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
}
