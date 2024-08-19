import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import FileDisplayTabPanel from './FileDisplayTabPanel';
import { IconButton, Paper, Typography } from '@mui/material';
import { FileStateContext } from '../App';
import { useContext, useEffect, useState } from 'react';
import { Close } from '@mui/icons-material';
import { REMOVE_FILE } from '../store';

export default function FileDisplay() {
    const { state, dispatch } = useContext(FileStateContext);
    const [value, setValue] = useState(0);
    // Number of open tabs, used to help move focus when tabs deleted
    const [activeTabs, setActiveTabs] = useState(state.files.length);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        const element = event.target as HTMLElement;
        if (element.tagName === "path") {
            event.preventDefault();
            return;
        }
        setValue(newValue);
    };

    const handleCloseButtonClick = (event: any, fileName: string) => {
        dispatch({ type: REMOVE_FILE, payload: { name: fileName } })
    }

    useEffect(() => {
        let newValue = value;
        if (state.files.length > activeTabs) {
            // New tab has opened, move focus there
            setActiveTabs(state.files.length);
            newValue = state.files.length - 1;
        } else if (state.files.length < activeTabs) {
            // If active tab is higher index than exists, reduce
            if (value > state.files.length - 1) newValue--;
        }
        setActiveTabs(state.files.length);
        setValue(newValue);
    }, [state.files])

    return (
        <Paper elevation={1} sx={{ width: "95%", height: "85%", position: "relative" }}>
            {state.files.length === 0 ? <Typography sx={{ justifyContent: "center", display: "flex" }}>No files currently displayed.</Typography> : <></>}
            <Box sx={{ width: "100%", height: "100%" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                >
                    {state.files.map((file, idx) => (
                        <Tab sx={{ textTransform: "none" }} {...allyProps(idx)} key={file.name} label={
                            <span>
                                {file.name.split("/").pop()}
                                <IconButton size="small" component="span" onClick={(event) => handleCloseButtonClick(event, file.name)}>
                                    <Close />
                                </IconButton>
                            </span>
                        } />
                    ))}
                </Tabs>
                {state.files.map((file, idx) => (
                    <FileDisplayTabPanel value={value} display={file.display} index={idx} key={file.name}></FileDisplayTabPanel>
                ))}
            </Box>
        </Paper>
    );
}

function allyProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}