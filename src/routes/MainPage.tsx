import { Box } from '@mui/material';
import MiniMenuBar from '../components/MenuBar';
import { createContext, useCallback, useEffect, useReducer } from 'react';
import { BeamlineTreeState, CHANGE_BEAMLINE, CHANGE_SCREEN, initialState, LOAD_SCREENS, reducer } from '../store';
import DLSAppBar from '../components/AppBar';
import ScreenDisplay from '../components/ScreenDisplay';
import { useParams } from 'react-router-dom';
import { parseScreenTree } from '../utils/parser';
import { FileProvider } from '@diamondlightsource/cs-web-lib';

const INITIAL_SCREEN_STATE = {
    main: {
        path: "/json/start.json",
        macros: {},
        defaultProtocol: "ca"
    }
}

const BeamlineTreeStateContext = createContext<{
    state: BeamlineTreeState;
    dispatch: React.Dispatch<any>;
}>({ state: initialState, dispatch: () => null });


export function MainPage() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const params: { beamline?: string, screenId?: string } = useParams();

    useEffect(() => {
        if (state.filesLoaded) {
            if (params.beamline && params.beamline !== state.currentBeamline) dispatch({ type: CHANGE_BEAMLINE, payload: { beamline: params.beamline } });
            if (params.screenId && params.screenId !== state.currentScreenId) dispatch({ type: CHANGE_SCREEN, payload: { screenId: params.screenId } });
        }
    }, [params.beamline, params.screenId])

    // Only run once on mount
    useEffect(() => {
        loadScreens()
    }, [])

    const loadScreens = useCallback(async () => {
        const newBeamlines = { ...state.beamlines };
        for (const item of Object.values(newBeamlines)) {
            const [tree, fileIDs] = await parseScreenTree(item.entryPoint);
            item.screenTree = tree;
            item.filePathIds = fileIDs
        }
        dispatch({
            type: LOAD_SCREENS,
            payload: {
                beamlines: newBeamlines,
                loadBeamline: params.beamline,
                loadScreen: params.screenId
            }
        });
    }, []);


    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <FileProvider initialPageState={INITIAL_SCREEN_STATE}>
                    <BeamlineTreeStateContext.Provider value={{ state, dispatch }}>
                        <DLSAppBar />
                        <MiniMenuBar />
                        <ScreenDisplay />
                    </BeamlineTreeStateContext.Provider>
                </FileProvider>
            </Box>
        </>
    )
}

export default BeamlineTreeStateContext;