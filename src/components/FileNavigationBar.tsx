import * as React from 'react';
import Typography from '@mui/material/Typography';
import MacrosModal from './MacrosModal';
import { Alert, AlertTitle, Button, Container, Stack, TextField } from '@mui/material';
import { createContext, useState } from 'react';
import useWindowWidth from '../utils/helper';
import { reducer, initialState, FileState, ADD_FILE, LOAD_NEXT_FILE } from '../store';

const ALERT_MESSAGES: { [key: string]: string } = {
    success: "File was loaded successfully.",
    error: "File could not be loaded. Please check you have provided a valid .bob, .opi or .json file.",
    warning: "No file was provided."
}

export interface MacroMap {
    [key: string]: string;
}

export const FileStateContext = createContext<{
    state: FileState;
    dispatch: React.Dispatch<any>;
}>({ state: initialState, dispatch: () => null });

export default function FileNavigationBar() {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const [filePath, setFilePath] = useState("");
    const [fileIndex, setFileIndex] = useState(0);
    const [alert, setAlert] = useState<any>(undefined);

    const width = useWindowWidth();

    function handleTextChange(e: any) {
        setFilePath(e.target.value);
    }

    function handleLoadButtonClick(e: any) {
        // Validate - check if .bob, .opi or .json
        // When click button, we create json
        // If no file, give warning
        const extension = filePath.split(".").pop();
        if (!filePath) {
            setAlert("warning");
            // Change the last attempted load back to a failure
        } else if (extension !== "bob" && extension !== "opi" && extension !== "json") {
            // Change the last attempted load back to a failure
            setAlert("error");
        } else {
            setAlert("success");
            dispatch({ type: LOAD_NEXT_FILE, payload: { file: { path: filePath, macros: {} } } });
            setFileIndex(fileIndex + 1);
        }
        setTimeout(() => {
            setAlert(undefined);
        }, 5000);
    }

    function handleSubmitButtonClick(e: any) {
        // Fetch the last loaded file info, and submit it
        // First fetch last loaded file
        if (state.nextFile) {
            // We have prepared a file reading for loading
            //dispatch({ type: ADD_FILE, payload: { name: lastLoaded, display: <h1></h1> }});
            // Update macros
        }
    }

    return (
        <Container component="form" maxWidth={false} disableGutters sx={{ display: "flex", position: "relative", justifyContent: "center", flexGrow: 1, width: width * 0.95 }} noValidate autoComplete="off">
            {alert ? <Alert severity={alert} sx={{ position: "relative", top: 0, left: 0, zIndex: 1300, width: "100%", height: 65, textAlign: "center", justifyContent: "center", display: "flex" }}><AlertTitle>{alert.toUpperCase()}</AlertTitle>{ALERT_MESSAGES[alert]}</Alert> : <></>}
            <Stack spacing={2} direction="row" sx={{ top: 20, left: 0 }}>
                <Typography sx={{ display: "flex", alignItems: "center", height: 50 }}>File to load:</Typography>
                <TextField id="outlined-basic" label="URL" variant="outlined" onChange={handleTextChange} />
                <Button sx={{ height: 40 }} variant="contained" onClick={handleLoadButtonClick}>Load</Button>
                <FileStateContext.Provider value={{ state, dispatch }}>
                    <MacrosModal></MacrosModal>
                </FileStateContext.Provider>

                <Button sx={{ height: 40 }} variant="contained" onClick={handleSubmitButtonClick}>Submit</Button>
            </Stack>
        </Container>
    );
}
