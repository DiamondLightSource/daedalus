import * as React from 'react';
import Typography from '@mui/material/Typography';
import MacrosModal from './MacrosModal';
import { Alert, AlertTitle, Button, Container, Stack, TextField } from '@mui/material';
import { useContext, useState } from 'react';
import { ADD_FILE, LOAD_NEXT_FILE } from '../store';
import { EmbeddedDisplay, RelativePosition } from '@dls-controls/cs-web-lib';
import { FileStateContext } from '../App';
import { isValidHttpUrl } from '../utils/helper';

const ALERT_MESSAGES: { [key: string]: string } = {
    success: "File was loaded successfully.",
    error: "File could not be loaded. Please check you have provided a valid .bob, .opi or .json file.",
    warning: "No file was provided."
}

export default function FileNavigationBar() {
    const { state, dispatch } = useContext(FileStateContext);
    const [filePath, setFilePath] = useState("");
    const [alert, setAlert] = useState<any>(undefined);
    const [validFile, setValidFile] = useState<boolean | undefined>(true);
    const [helperText, setHelperText] = useState<string>("");

    function handleTextChange(e: any) {
        setFilePath(e.target.value);
    }

    /**
     * Validate the file passed to load
     * @param e 
     */
    async function handleLoadButtonClick(e: any) {
        // Check if file exists
        // If passes all checks, we load
        // If fails, we change colour and set a popover explaining issue
        if (filePath === "") setValidFile(true);
        const extension = filePath.split(".").pop();
        const validUrl = isValidHttpUrl(filePath)
        const validExtension = (extension !== "bob" && extension !== "opi" && extension !== "json") ? false : true;
        let valid = false;
        try {
            const fileExists = await fetch(filePath, { method: "HEAD" }).then((res) => { return res.ok });
            if (fileExists) {
                if (validUrl) {
                    if (validExtension) {
                        valid = true;
                        setHelperText("");
                        dispatch({ type: LOAD_NEXT_FILE, payload: { file: { path: filePath, macros: {} } } });
                    } else {
                        setHelperText("Invalid file extension. Use .bob, .opi or .json")
                        valid = false;
                    }
                } else {
                    setHelperText("Invalid URL protocol")
                    valid = false;
                }
            } else {
                setHelperText("Invalid file could not be fetched from URL")
                valid = false;
            }
        } catch {
            valid = false;
            setHelperText("Invalid file could not be fetched from URL")
        }

        setValidFile(valid);
    }

    function handleSubmitButtonClick(e: any) {
        // Fetch the last loaded file info, and submit it
        // First fetch last loaded file
        if (state.nextFile.path) {
            const extension = state.nextFile.path.split(".").pop();
            if (extension !== "bob" && extension !== "opi" && extension !== "json") {
                // Change the last attempted load back to a failure
                setAlert("error");
            } else {
                const display = (
                    <EmbeddedDisplay
                        height={800}
                        position={new RelativePosition()}
                        scroll={true}
                        resize={0}
                        file={
                            {
                                path: state.nextFile.path,
                                macros: { ...state.nextFile.macros },
                                defaultProtocol: "ca"
                            }
                        }
                    />
                )
                dispatch({ type: ADD_FILE, payload: { name: state.nextFile.path, display: display } });
                setAlert("success");
            }
        } else {
            setAlert("warning");
        }
        setTimeout(() => {
            setAlert(undefined);
        }, 5000);
    }

    return (
        <Container component="form" maxWidth={false} disableGutters sx={{ display: "flex", position: "relative", justifyContent: "center", width: "95%", height: "10%" }} noValidate autoComplete="off">
            {alert ? <Alert severity={alert} sx={{ position: "absolute", top: -80, zIndex: 1300, width: "100%", height: 65, textAlign: "center", justifyContent: "center", display: "flex" }}><AlertTitle>{alert.toUpperCase()}</AlertTitle>{ALERT_MESSAGES[alert]}</Alert> : <></>}
            <Stack spacing={2} direction="row" sx={{ top: 20, left: 0, zIndex: 1299 }}>
                <Typography sx={{ display: "flex", alignItems: "center", height: 50 }}>File to load:</Typography>
                <TextField id="outlined-basic" value={filePath} label="URL" variant="outlined" onChange={handleTextChange} sx={{ height: 50 }} error={!validFile} helperText={helperText} />
                <Button sx={{ height: 50 }} variant="contained" onClick={handleLoadButtonClick}>Load</Button>
                <MacrosModal></MacrosModal>
                <Button sx={{ height: 50 }} variant="contained" onClick={handleSubmitButtonClick}>Submit</Button>
            </Stack>
        </Container>
    );
}
