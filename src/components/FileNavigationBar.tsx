import * as React from 'react';
import MacrosModal from './MacrosModal';
import { Alert, AlertTitle, Button, Container, Stack } from '@mui/material';
import { useContext, useState } from 'react';
import { ADD_FILE } from '../store';
import { EmbeddedDisplay, RelativePosition } from '@diamondlightsource/cs-web-lib';
import { FileStateContext } from '../App';
import ProtocolButton from './ProtocolButton';
import FileInput from './FileInput';

const ALERT_MESSAGES: { [key: string]: string } = {
    success: "File was loaded successfully.",
    error: "File could not be loaded. Please check you have provided a valid .bob, .opi or .json file.",
    warning: "No file was provided."
}

export default function FileNavigationBar() {
    const { state, dispatch } = useContext(FileStateContext);
    const [alert, setAlert] = useState<any>(undefined);

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
                                defaultProtocol: state.nextFile.protocol
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
            <Stack spacing={2} direction="row" sx={{ top: 20, left: 0, zIndex: 1299, width: "100%", justifyContent: "center", }}>
                <FileInput></FileInput>
                <MacrosModal></MacrosModal>
                <ProtocolButton></ProtocolButton>
                <Button sx={{ height: 50 }} variant="contained" onClick={handleSubmitButtonClick}>Submit</Button>
            </Stack>
        </Container>
    );
}
