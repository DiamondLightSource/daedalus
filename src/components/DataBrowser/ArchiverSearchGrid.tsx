import { useState } from "react";
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
  TextField
} from "@mui/material";

/**
 * The archiver
 */
export default function ArchiverSearchGrid() {
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
    <div>
      <Grid container spacing={1} rowSpacing={1} padding={"5px"}>
        <Grid size={{ xs: 6 }}>
          <Select
            id="archiver-select"
            aria-label="archiver-select"
            value={archiver}
            onChange={handleChange}
            sx={{ width: "100%" }}
          >
            <MenuItem value={"Primary"}>Primary</MenuItem>
            <MenuItem value={"Standby"}>Standby</MenuItem>
            <MenuItem value={"Backup"}>Backup</MenuItem>
          </Select>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Select id="mode-select" value={"0"} sx={{ width: "100%" }}>
            <MenuItem value={0}>Add</MenuItem>
            <MenuItem value={1}>Other</MenuItem>
          </Select>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            onChange={handlePvMatchChange}
            variant="filled"
            value={pvMatch}
            label="PV"
            sx={{ width: "100%", textAlign: "center" }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TableContainer component={Paper}>
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
    </div>
  );
}
