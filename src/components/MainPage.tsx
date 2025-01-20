import { Box, AppBar, Toolbar, Typography } from '@mui/material';

export function MainPage() {

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar sx={{ position: "absolute" }}>
                    <Toolbar>
                        <Typography variant="h1" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
                            Wireframe Demo
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    )
}