import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Box, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { useWindowWidth } from '../utils/helper';
import { useContext, useState } from 'react';
import { ADD_MACROS } from '../store';
import { FileStateContext } from '../App';


export default function MacrosModal() {
    const { state, dispatch } = useContext(FileStateContext);
    const [nameText, setNameText] = useState("");
    const [valueText, setValueText] = useState("");
    const width = useWindowWidth();
    const disabled = state.nextFile ? false : true;

    function handleOnAddMacroButtonClick() {
        if (nameText !== "" && valueText !== "") {
            dispatch({ type: ADD_MACROS, payload: { name: nameText, value: valueText } });
            setValueText("");
            setNameText("");
        }
    }

    function handleNameTextChange(e: any) {
        setNameText(e.target.value)
    }

    function handleValueTextChange(e: any) {
        setValueText(e.target.value)
    }

    return (
        <div>
            <Accordion sx={{ width: width * 0.2, height: 50, zIndex: 1300 }}>
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{ zIndex: 1300 }}
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
                                <TextField id="outlined-basic" value={nameText} disabled={disabled} label="Name" variant="outlined" onChange={handleNameTextChange} sx={{ backgroundColor: disabled ? "#dedede" : "white" }} />
                                <TextField id="outlined-basic" value={valueText} disabled={disabled} label="Value" variant="outlined" onChange={handleValueTextChange} sx={{ backgroundColor: disabled ? "#dedede" : "white" }} />
                            </Stack>

                            <Button variant="contained" onClick={handleOnAddMacroButtonClick}>Add Macro</Button>
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
                                    {state.nextFile.macros ? Object.entries(state.nextFile.macros!).map(macro => {
                                        return (<TableRow key={macro[0]}>
                                            <TableCell align="left">
                                                {macro[0]}
                                            </TableCell>
                                            <TableCell align="left">
                                                {macro[1]}
                                            </TableCell>
                                        </TableRow>)
                                    }) : <></>}
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </Stack>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
