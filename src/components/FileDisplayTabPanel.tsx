import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface FileDisplayTabPanelProps {
    index: number;
    value: number;
}

export default function FileDisplayTabPanel(props: FileDisplayTabPanelProps) {
    const { value, index } = props;
    // Here is where we load our files
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
        >
            {value === index && (<Box sx={{ flexGrow: 1 }}>
                <Typography>Load .bob file here {value}</Typography>
            </Box>)}
        </div>
    );
}
