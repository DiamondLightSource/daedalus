import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import { Box, CssBaseline, Divider, IconButton, TextField } from '@mui/material';
import Grid from "@mui/material/Grid";
import MenuIcon from '@mui/icons-material/Menu';
import { PROPERTIES_MENU_WIDTH } from '../utils/helper';

const MenuBarHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

export default function PropertiesSideBar() {

    const handleOpenSettings = () => {
        console.log("TO DO - create settings modal")
    };

    return (
        <>
            <CssBaseline />
            <MuiDrawer variant="permanent" open anchor="right" PaperProps={{ sx: { width: PROPERTIES_MENU_WIDTH, height: "100%" } }}>
                <MenuBarHeader sx={{ textAlign: "center" }}>
                    Widget Properties
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleOpenSettings}
                        sx={{ alignItems: "right" }}
                    >
                        <MenuIcon />
                    </IconButton>
                </MenuBarHeader>
                <Divider />
                WIDGET TYPE HERE
                <PropertiesGrid />
            </MuiDrawer>
        </>
    );
}

/**
 * Lists all properties of the component with editable values
 */
function PropertiesGrid() {
    // TO DO - pass in widget
    // get list of props expected
    return (
         <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    hello
                </Grid>
                <Grid item xs={6}>
                    <TextField variant="outlined" defaultValue="thing" />
                </Grid>
            </Grid>
         </Box>
        
    )
}