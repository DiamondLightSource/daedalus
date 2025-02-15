import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useContext } from 'react';
import BeamlineTreeStateContext from '../routes/MainPage';
import { useHistory } from 'react-router-dom';

export default function BeamlineSelect() {
    const { state, dispatch } = useContext(BeamlineTreeStateContext);
    const history = useHistory();

    const handleChange = (event: SelectChangeEvent) => {
        history.push(`/${event.target.value}`)
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
                {Object.keys(state.beamlines).map(function (beamline) {
                    return (<MenuItem key={beamline} value={beamline}>{beamline}</MenuItem>)
                }
                )}
            </Select>
        </FormControl>
    );
}
