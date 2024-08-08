import * as React from 'react';
import Typography from '@mui/material/Typography';
import MacrosModal from './MacrosModal';
import { Alert, AlertTitle, Button, Container, Stack, TextField } from '@mui/material';
import { useState } from 'react';

const ALERT_MESSAGES: { [key: string]: string } = {
    success: "File was loaded successfully.",
    error: "File could not be loaded. Please check you have provided a valid .bob, .opi or .json file.",
    warning: "No file was provided."
}

export default function FileNavigationBar() {
    const [filePath, setFilePath] = useState("");
    const [alert, setAlert] = useState<any>(undefined);

    function handleTextChange(e: any) {
        setFilePath(e.target.value);
    }

    function handleSubmitButtonClick(e: any) {
        // Validate - check if .bob, .opi or .json
        // When click button, we create json
        // If no file, give warning
        const extension = filePath.split(".").pop();
        if (!filePath) {
            setAlert("warning");
        } else if (extension !== "bob" && extension !== "opi" && extension !== "json") {
            setAlert("error");
            setTimeout(() => {
                setAlert(undefined);
            }, 5000);
            return;
        } else {
            setAlert("success");
        }
        console.log(filePath)
        setTimeout(() => {
            setAlert(undefined);
        }, 5000);
    }
    return (
        <Container component="form" maxWidth={false} disableGutters sx={{ flexGrow: 1, width: "100%" }} noValidate autoComplete="off">
            {alert ? <Alert severity={alert} sx={{ position: "absolute", top: 0, left: 0, zIndex: 1300, width: "100%", height: 65, textAlign: "center", justifyContent: "center", display: "flex" }}><AlertTitle>{alert.toUpperCase()}</AlertTitle>{ALERT_MESSAGES[alert]}</Alert> : <></>}
            <Stack spacing={2} direction="row" sx={{ top: 20, left: 0 }}>
                <Typography sx={{ textAlign: "center", display: "flex", justifyContent: "center" }}>Provide a URL for the file to load:</Typography>
                <TextField id="outlined-basic" label="File URL" variant="outlined" onChange={handleTextChange} />
                <MacrosModal></MacrosModal>
                <Button sx={{ height: 40 }} variant="contained" onClick={handleSubmitButtonClick}>Submit</Button>
            </Stack>
        </Container>
    );
}
