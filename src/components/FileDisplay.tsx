import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import FileDisplayTabPanel from './FileDisplayTabPanel';
import { IconButton, Paper, Typography } from '@mui/material';
import { FileStateContext } from '../App';
import { useContext, useEffect, useState } from 'react';
import { Close } from '@mui/icons-material';

export default function FileDisplay() {
    const { state, dispatch } = useContext(FileStateContext);
    const [value, setValue] = useState(0);
    // Number of open tabs, used to help move focus when tabs deleted
    const [tabNumber, setTabNumber] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (state.files.length > tabNumber) {
            // New tab has opened, move focus there
            setValue(state.files.length - 1)
            setTabNumber(state.files.length)
        } else if (state.files.length < tabNumber) {
            // TO DO
            // Tab has been removed. If ahead of our tab, do nothing
            // If before our tab, shift focus to stay on our tab
            // If our tab, shift as well
        }
    }, [state.files])

    function renderFileTabs() {
        const tabsArray: any[] = [];
        if (state.files.length > 0) {
            state.files.forEach(file => {
                const fileName = file.name.split("/").pop()
                tabsArray.push(<Tab sx={{ textTransform: "none" }} {...allyProps(file.index)} key={file.name} label={
                    <span>
                        {fileName}
                        <IconButton size="small" component="span">
                            <Close />
                        </IconButton>
                    </span>
                } />)
            })
            return tabsArray;
        }
    }

    function renderFilePanels() {
        const panelArray: any[] = [];
        if (state.files.length > 0) {
            state.files.forEach(file => {
                panelArray.push(<FileDisplayTabPanel value={value} display={file.display} index={file.index} key={file.name}></FileDisplayTabPanel>)
            })
            return panelArray;
        }
    }

    return (
        <Paper elevation={1} sx={{ width: "95%", height: "80%", position: "relative" }}>
            {state.files.length === 0 ? <Typography sx={{ justifyContent: "center", display: "flex" }}>No files currently displayed.</Typography> : <></>}
            <Box sx={{ width: '100%' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                >
                    {renderFileTabs()}
                </Tabs>
                {renderFilePanels()}
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