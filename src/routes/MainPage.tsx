import { Box } from '@mui/material';
import MiniMenuBar from '../components/MenuBar';
import { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import { BeamlineTreeState, CHANGE_BEAMLINE, CHANGE_SCREEN, initialState, LOAD_SCREENS, reducer } from '../store';
import DLSAppBar from '../components/AppBar';
import ScreenDisplay from '../components/ScreenDisplay';
import { useParams } from 'react-router-dom';
import { parseScreenTree } from '../utils/parser';
import { executeAction, FileContext } from '@diamondlightsource/cs-web-lib';
import { RotatingLines } from 'react-loader-spinner';

const BeamlineTreeStateContext = createContext<{
    state: BeamlineTreeState;
    dispatch: React.Dispatch<any>;
}>({ state: initialState, dispatch: () => null });


export function MainPage() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const params: { beamline?: string, screenId?: string } = useParams();
    const fileContext = useContext(FileContext);

    useEffect(() => {
        // Only trigger once
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
        if (params.beamline) {
            // If we navigated directly to a beamline and/or screen, load in display
            const newBeamlineState = newBeamlines[params.beamline];
            const newScreen = params.screenId ? newBeamlineState.filePathIds[params.screenId] : newBeamlineState.entryPoint
            executeAction({
                type: 'OPEN_PAGE',
                dynamicInfo: {
                    name: newScreen,
                    location: "main",
                    description: undefined,
                    file: {
                        path: newScreen,
                        macros: {},
                        defaultProtocol: "ca"
                    }
                }
            }, fileContext, undefined, {})
        }

    }, []);


    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <BeamlineTreeStateContext.Provider value={{ state, dispatch }}>
                    {
                        state.filesLoaded ?
                            <>
                                <DLSAppBar />
                                <MiniMenuBar />
                                <ScreenDisplay />
                            </> :
                            <>
                                <RotatingLines
                                    strokeColor="grey"
                                    strokeWidth="5"
                                    animationDuration="0.75"
                                    width="96"
                                    visible={true}
                                />
                            </>
                    }
                </BeamlineTreeStateContext.Provider>
            </Box>
        </>
    )
}

export default BeamlineTreeStateContext;