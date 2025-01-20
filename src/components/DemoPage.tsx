import { Box, AppBar, Toolbar, Typography, Stack } from '@mui/material';
import * as React from 'react';
import { reducer, initialState } from '../store';
import { useWindowWidth, useWindowHeight } from '../utils/helper';
import FileDisplay from './FileDisplay';
import FileNavigationBar from './FileNavigationBar';
import { FileStateContext } from '../App';

export function DemoPage() {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const width = useWindowWidth();
    const height = useWindowHeight();

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar sx={{ position: "absolute" }}>
                    <Toolbar>
                        <Typography variant="h1" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
                            Daedalus Demo
                        </Typography>
                    </Toolbar>
                </AppBar>
                <FileStateContext.Provider value={{ state, dispatch }}>
                    <Stack sx={{ alignItems: "center", position: "absolute", top: 80, width: width, height: height - 80 }} spacing={2}>
                        <FileNavigationBar />
                        <FileDisplay />
                    </Stack>
                </FileStateContext.Provider>
            </Box>
        </>
    )
}