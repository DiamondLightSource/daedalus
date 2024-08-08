import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Box, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import useWindowWidth from '../utils/helper';


export default function MacrosModal() {

    const width = useWindowWidth();
    return (
        <div>
            <Accordion sx={{ width: width * 0.2 }}>
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography>Macros</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ zIndex: 1300 }}>
                    <Stack spacing={4}>
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { m: 1, width: '25ch' },
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <Stack spacing={2} direction="row" sx={{ width: "100%" }}>
                                <TextField id="outlined-basic" label="Name" variant="outlined" />
                                <TextField id="outlined-basic" label="Value" variant="outlined" />
                            </Stack>

                            <Button variant="contained">Add Macro</Button>
                        </Box>
                        <TableContainer component={Paper}>
                            <Table sx={{ fontSize: "10px" }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Name</TableCell>
                                        <TableCell align="left">Value</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="left">
                                            WAH
                                        </TableCell>
                                        <TableCell align="left">
                                            HI
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </Stack>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
