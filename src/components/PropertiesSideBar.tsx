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
    const widgetPropList = [
        {
            label: "Type", 
            value: properties.display?.type ?? ""
        }, 
        {
            label: "Name", 
            value: properties.y
        }, 
        {
            label: "Class", 
            value: "DEFAULT"
        }, 
        {
            label: "Actions",
            value: "None"
        }, 
        {
            label: "PV Name", 
            value: "TEST-TEST-01:HELLO"
        }, 
        {
            label: "Text",
            value: "Text on the widget"
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
                <PropertiesGrid positionProps={positionPropList} widgetProps={widgetPropList} />
            </MuiDrawer>
        </>
    );
}

/**
 * Lists all properties of the component with editable values
 */
function PropertiesGrid(props: {positionProps: any[], widgetProps: any[]}) {
    const { positionProps, widgetProps } = props;

    const displayPropList = [
        {
            label: "Visible", 
            value: "True"
        }, 
        {
            label: "Font", 
            value: "Arial 14"
        }, 
        {
            label: "Foreground Color", 
            value: "RGB(100, 109, 199)"
        }, 
        {
            label: "Background Color",
            value: "RGB(100, 199, 199)"
        }, 
        {
            label: "Transparent", 
            value: "False"
        }, 
    ];
    // TO DO - pass in widget
    // get list of props expected
    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
            <Typography sx={{margin: "5px 0px 5px 0px", fontWeight: "bold", color: "black", backgroundColor: "#ffe4b5" }}>Widget</Typography>
            <Grid container spacing={2}>
                {widgetProps.map((item) => (
                    <>
                        <Grid key={item.label} item xs={5}>
                            {item.label}
                        </Grid>
                        <Grid key={item.label + "Field"} item xs={7} sx={{justifyItems: "right"}}>
                            <TextField sx={{ '& .MuiInputBase-input': {padding: "2px"},height: 20, lineHeight: "unset", padding: 0 }} variant="outlined" value={item.value} />
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
                {displayPropList.map((item) => (
                    <>
                        <Grid key={item.label} item xs={5}>
                            {item.label}
                        </Grid>
                        <Grid key={item.label + "Field"} item xs={7} sx={{justifyItems: "right"}}>
                            <TextField sx={{ '& .MuiInputBase-input': {padding: "2px"},height: 20, lineHeight: "unset", padding: 0 }} variant="outlined" value={item.value} />
                        </Grid></>
                ))}
            </Grid>
        </Box></>
        
    )
}