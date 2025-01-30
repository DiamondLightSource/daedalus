import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useContext } from 'react';
import BeamlineTreeStateContext from '../routes/MainPage';
import { APP_BAR_HEIGHT, DRAWER_WIDTH } from '../utils/helper';

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                marginLeft: DRAWER_WIDTH,
                width: `calc(100% - ${DRAWER_WIDTH}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
        {
            props: ({ open }) => !open,
            style: {
                marginLeft: `calc(${theme.spacing(7)} + 1px)`,
                width: `calc(100% - ${theme.spacing(7)} - 8px)`,
            },
        },
    ],
}));

export default function DLSAppBar() {
    const { state, dispatch } = useContext(BeamlineTreeStateContext);

    const handleOpenSettings = () => {
        console.log("TO DO - create settings modal")
    };

    return (
        <>
            <CssBaseline />
            <AppBar position="absolute" open={state.menuBarOpen} sx={{ height: APP_BAR_HEIGHT }}>
                <Toolbar>
                    <Typography variant="h1" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
                        Daedalus Demo
                    </Typography>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleOpenSettings}
                        edge="start"
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </>
    );
}