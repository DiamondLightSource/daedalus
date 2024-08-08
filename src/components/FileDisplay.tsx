import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import FileDisplayTabPanel from './FileDisplayTabPanel';
import { Paper } from '@mui/material';
import useWindowWidth from '../utils/helper';

export default function FileDisplay() {
    const [value, setValue] = React.useState(0);
    const width = useWindowWidth();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Paper elevation={1} sx={{ width: width * 0.95, position: "relative" }}>
            <Box sx={{ width: '100%' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                >
                    <Tab sx={{ textTransform: "none" }} {...allyProps(0)} label="Item zero" />
                    <Tab sx={{ textTransform: "none" }} {...allyProps(1)} label="Item One" />
                    <Tab sx={{ textTransform: "none" }} {...allyProps(2)} label="Item two" />
                </Tabs>
                <FileDisplayTabPanel value={value} index={0}></FileDisplayTabPanel>
                <FileDisplayTabPanel value={value} index={1}></FileDisplayTabPanel>
                <FileDisplayTabPanel value={value} index={2}></FileDisplayTabPanel>
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