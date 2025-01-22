import { Box } from '@mui/material';
import MiniMenuBar from '../components/MenuBar';
import { createContext, useEffect, useReducer } from 'react';
import { BeamlineTreeState, CHANGE_BEAMLINE, CHANGE_SCREEN, initialState, reducer } from '../store';
import DLSAppBar from '../components/AppBar';
import ScreenDisplay from '../components/ScreenDisplay';
import { useParams } from 'react-router-dom';

const BeamlineTreeStateContext = createContext<{
    state: BeamlineTreeState;
    dispatch: React.Dispatch<any>;
}>({ state: initialState, dispatch: () => null });


export function MainPage() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const params: { beamline?: string, screenId?: string } = useParams()

    useEffect(() => {
        if (params.beamline && params.beamline !== state.currentBeamline) dispatch({ type: CHANGE_BEAMLINE, payload: { beamline: params.beamline } });
        if (params.screenId && params.screenId !== state.currentScreenId) dispatch({ type: CHANGE_SCREEN, payload: { screenId: params.screenId } });
    })


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