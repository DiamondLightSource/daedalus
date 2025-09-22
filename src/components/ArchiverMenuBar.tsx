import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { KeyboardDoubleArrowRight } from "@mui/icons-material";
import { useContext, useState } from "react";
import {
  Grid,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import DataBrowserStateContext from "../routes/DataBrowserPage";
import { TOGGLE_ARCHIVER_MENU_BAR } from "../store";

export const ARCHIVER_SEARCH_DRAWER_WIDTH = 300;

const openedMixin = (theme: Theme): CSSObject => ({
  width: ARCHIVER_SEARCH_DRAWER_WIDTH,
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
  width: ARCHIVER_SEARCH_DRAWER_WIDTH,
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

export default function ArchiverMenuBar() {
  const theme = useTheme();
  const { state, dispatch } = useContext(DataBrowserStateContext);

  console.log(state);
  const handleDrawerOpen = () => {
    dispatch({
      type: TOGGLE_ARCHIVER_MENU_BAR,
      payload: { open: true }
    });
  };

  const handleDrawerClose = () => {
    dispatch({
      type: TOGGLE_ARCHIVER_MENU_BAR,
      payload: { open: false }
    });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <MenuBar
        variant="permanent"
        open={state.archiverMenuBarOpen}
        PaperProps={{ elevation: 8 }}
      >
        <MenuBarHeader>
          {state.archiverMenuBarOpen ? (
            <>
              <Typography variant="h1">Archive Search</Typography>
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
        {state.archiverMenuBarOpen ? <ArchiverSearchGrid /> : <></>}
      </MenuBar>
    </Box>
  );
}

/**
 * The archiver
 */
function ArchiverSearchGrid(props: {}) {
  const [archiver, setArchiver] = useState("Primary");
  const [pvMatch, setPvMatch] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setArchiver(event.target.value);
  };

  const handlePvMatchChange = (event: any) => {
    setPvMatch(event.target.value);
  };

  function createData(pv: string, archiver: string) {
    return { pv, archiver };
  }

  // Fake test PVS
  const rows = [
    createData("BL07-TEST-01", "Primary"),
    createData("BL07-TEST-01", "Standby"),
    createData("BL07-TEST-01", "Backup"),
    createData("BL07-TEST-02", "Primary"),
    createData("BL07-TEST-02", "Standby"),
    createData("BL07-TEST-03", "Primary"),
    createData("BL07-TEST-03", "Standby"),
    createData("BL07-VAC-01", "Primary"),
    createData("BL07-VAC-01", "Standby"),
    createData("BL07-VAC-OLD-02", "Primary"),
    createData("BL07-VAC-OLD-02", "Standby")
  ];

  const regex = new RegExp(pvMatch);
  // Filter rows by archiver
  const filteredRows = rows.filter(function (row) {
    if (row.archiver === archiver) {
      if (regex.test(row.pv)) return row;
    }
  });

  return (
    <>
      <Grid container spacing={1} rowSpacing={1} padding={"5px"}>
        <Grid item xs={6}>
          <Select
            id="archiver-select"
            value={archiver}
            onChange={handleChange}
            sx={{ width: "100%" }}
          >
            <MenuItem value={"Primary"}>Primary</MenuItem>
            <MenuItem value={"Standby"}>Standby</MenuItem>
            <MenuItem value={"Backup"}>Backup</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={6}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={"0"}
            sx={{ width: "100%" }}
          >
            <MenuItem value={0}>Add</MenuItem>
            <MenuItem value={1}>Other</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={handlePvMatchChange}
            variant="filled"
            value={pvMatch}
            label="PV"
            sx={{ width: "100%", textAlign: "center" }}
          />
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ height: "100%" }}>
            <Table aria-label="pv-table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>PV</b>
                  </TableCell>
                  <TableCell>
                    <b>Archiver</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.map(row => (
                  <TableRow
                    key={row.pv}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.pv}
                    </TableCell>
                    <TableCell>{row.archiver}</TableCell>
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

