import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function BeamlineSelect() {
    const [beamline, setBeamline] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setBeamline(event.target.value as string);
    };

    return (
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Beamline</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={beamline}
                label="Beamline"
                onChange={handleChange}
            >
                <MenuItem value="BL09I">BL09I</MenuItem>
                <MenuItem value="BL16I">BL16I</MenuItem>
            </Select>
        </FormControl>
    );
}
