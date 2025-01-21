import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useContext } from 'react';
import BeamlineTreeStateContext from '../routes/MainPage';
import { CHANGE_BEAMLINE } from '../store';

export default function BeamlineSelect() {
    const { state, dispatch } = useContext(BeamlineTreeStateContext);

    const handleChange = (event: SelectChangeEvent) => {
        dispatch({ type: CHANGE_BEAMLINE, payload: { beamline: event.target.value as string } });
    };

    return (
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Beamline</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={state.currentBeamline}
                label="Beamline"
                onChange={handleChange}
            >
                {state.beamlines.map((item) => {
                    return <MenuItem key={item.beamline} value={item.beamline}>{item.beamline}</MenuItem>
                })}
            </Select>
        </FormControl>
    );
}
