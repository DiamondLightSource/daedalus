import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import FileDisplayTabPanel from './FileDisplayTabPanel';
import { Paper, Typography } from '@mui/material';
import { FileStateContext } from '../App';
import { useContext } from 'react';

export default function FileDisplay() {
    const { state, dispatch } = useContext(FileStateContext);
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    function renderFileTabs() {
        const tabsArray: any[] = [];
        if (state.files.length > 0) {
            state.files.forEach(file => {
                tabsArray.push(<Tab sx={{ textTransform: "none" }} {...allyProps(file.index)} label={file.name} />)
            })
            return tabsArray;
        }
    }

    function renderFilePanels() {
        const panelArray: any[] = [];
        if (state.files.length > 0) {
            state.files.forEach(file => {
                panelArray.push(<FileDisplayTabPanel value={value} display={file.display} index={file.index}></FileDisplayTabPanel>)
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