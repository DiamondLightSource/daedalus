import { Box } from '@mui/material';
import MiniMenuBar from '../components/MenuBar';
import { createContext, useReducer } from 'react';
import { BeamlineTreeState, initialState, reducer } from '../store';
import DLSAppBar from '../components/AppBar';
import ScreenDisplay from '../components/ScreenDisplay';

const BeamlineTreeStateContext = createContext<{
    state: BeamlineTreeState;
    dispatch: React.Dispatch<any>;
}>({ state: initialState, dispatch: () => null });


export function MainPage() {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <BeamlineTreeStateContext.Provider value={{ state, dispatch }}>
                    <MiniMenuBar />
                    <DLSAppBar />
                    <ScreenDisplay />
                </BeamlineTreeStateContext.Provider>
            </Box>
        </>
    )
}

export default BeamlineTreeStateContext;