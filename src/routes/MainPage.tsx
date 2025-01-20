import { Box } from '@mui/material';
import MiniMenuBar from '../components/MenuBar';

export function MainPage() {

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <MiniMenuBar />
            </Box>
        </>
    )
}