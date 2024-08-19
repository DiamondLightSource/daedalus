import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useContext, useState } from 'react';
import { FileStateContext } from '../App';
import { CHANGE_PROTOCOL } from '../store';

export default function ProtocolButton() {
    const { state, dispatch } = useContext(FileStateContext);
    const [value, setValue] = useState(state.nextFile.protocol);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
        dispatch({ type: CHANGE_PROTOCOL, payload: { value: (event.target as HTMLInputElement).value } })
    };

    return (
        <FormControl>
            <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={value}
                onChange={handleChange}
                sx={{ height: 50 }}
            >
                <FormControlLabel value="ca" control={<Radio size="small" />} label="CA" />
                <FormControlLabel value="pva" control={<Radio size="small" />} label="PVA" />
            </RadioGroup>
        </FormControl>
    );
}
