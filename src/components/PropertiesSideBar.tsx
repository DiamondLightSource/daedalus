import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import { Box, CssBaseline, Divider, TextField, Typography } from '@mui/material';
import Grid from "@mui/material/Grid";
import { APP_BAR_HEIGHT, PROPERTIES_MENU_WIDTH } from '../utils/helper';
import { WidgetProps } from './Editor';

const MenuBarHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

export default function PropertiesSideBar(props: {properties: WidgetProps}) {
    const { properties } = props;
    const positionPropList = [
        {
            label: "X Position", 
            value: properties.x
        }, 
        {
            label: "Y Position", 
            value: properties.y
        }, 
        {
            label: "Width", 
            value: properties.w
        }, 
        {
            label: "Height",
            value: properties.h
        }
    ];
    return (
        <>
            <CssBaseline />
            <MuiDrawer variant="permanent" open anchor="right" sx={{paddingTop: APP_BAR_HEIGHT}} PaperProps={{ sx: { width: PROPERTIES_MENU_WIDTH, height: "100%", paddingTop: `${APP_BAR_HEIGHT}px`} }}>
                <MenuBarHeader sx={{ textAlign: "center",  justifyContent: "Center"}}>
                    <Typography variant="h2" sx={{alignContent: "Center"}}>Widget Properties</Typography>
                </MenuBarHeader>
                <Divider />
                <PropertiesGrid positionProps={positionPropList}/>
            </MuiDrawer>
        </>
    );
}

/**
 * Lists all properties of the component with editable values
 */
function PropertiesGrid(props: {positionProps: any[]}) {
    const { positionProps } = props;
    const widgetPropList = ["Type", "Name", "Class", "Actions", "PV Name", "Text"];
    const displayPropList = ["Visible", "Font", "Foreground Color", "Background Color", "Transparent"];
    // TO DO - pass in widget
    // get list of props expected
    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
            <Typography sx={{margin: "5px 0px 5px 0px", fontWeight: "bold", color: "black", backgroundColor: "#ffe4b5" }}>Widget</Typography>
            <Grid container spacing={2}>
                {widgetPropList.map((prop) => (
                    <>
                        <Grid key={prop} item xs={5}>
                            {prop}
                        </Grid>
                        <Grid key={prop + "Field"} item xs={7} sx={{justifyItems: "right"}}>
                            <TextField sx={{ '& .MuiInputBase-input': {padding: "2px"},height: 20, lineHeight: "unset", padding: 0 }} variant="outlined" defaultValue="thing" />
                        </Grid></>
                ))}
            </Grid>
            <Typography sx={{margin: "5px 0px 5px 0px", fontWeight: "bold", color: "black", backgroundColor: "#ffe4b5" }}>Position</Typography>
            <Grid container spacing={2}>
                {positionProps.map((item) => (
                    <>
                        <Grid key={item.label} item xs={5}>
                            {item.label}
                        </Grid>
                        <Grid key={item.label + "Field"} item xs={7} sx={{justifyItems: "right"}}>
                            <TextField sx={{ '& .MuiInputBase-input': {padding: "2px"},height: 20, lineHeight: "unset", padding: 0 }} variant="outlined" value={(item.value as string).replace("px", "")} />
                        </Grid></>
                ))}
            </Grid>
            <Typography sx={{margin: "5px 0px 5px 0px", fontWeight: "bold", color: "black", backgroundColor: "#ffe4b5" }}>Display</Typography>
            <Grid container spacing={2}>
                {displayPropList.map((prop) => (
                    <>
                        <Grid key={prop} item xs={5}>
                            {prop}
                        </Grid>
                        <Grid key={prop + "Field"} item xs={7} sx={{justifyItems: "right"}}>
                            <TextField sx={{ '& .MuiInputBase-input': {padding: "2px"},height: 20, lineHeight: "unset", padding: 0 }} variant="outlined" defaultValue="thing" />
                        </Grid></>
                ))}
            </Grid>
        </Box></>
        
    )
}