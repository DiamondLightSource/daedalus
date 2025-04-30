import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import { Box, Button, Checkbox, CssBaseline, TextField, Typography } from '@mui/material';
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
            component: (<TextField sx={{ '& .MuiInputBase-input': {padding: "2px"},height: 20, lineHeight: "unset", padding: 0 }} variant="outlined" value={properties.x} />)
        }, 
        {
            label: "Y Position", 
            component: (<TextField sx={{ '& .MuiInputBase-input': {padding: "2px"},height: 20, lineHeight: "unset", padding: 0 }} variant="outlined" value={properties.y} />)
        }, 
        {
            label: "Width", 
            component: (<TextField sx={{ '& .MuiInputBase-input': {padding: "2px"},height: 20, lineHeight: "unset", padding: 0 }} variant="outlined" value={properties.w} />)
        }, 
        {
            label: "Height",
            component: (<TextField sx={{ '& .MuiInputBase-input': {padding: "2px"},height: 20, lineHeight: "unset", padding: 0 }} variant="outlined" value={properties.h} />)
        }
    ];
    const widgetPropList = [
        {
            label: "Type", 
            component: (<Typography variant="body1">{properties.display?.type ?? ""}</Typography>)
        }, 
        {
            label: "Name", 
            component: (<TextField sx={{ '& .MuiInputBase-input': {padding: "2px"},height: 20, lineHeight: "unset", padding: 0 }} variant="outlined" value={"Widget name"} />)
        }, 
        {
            label: "Class", 
            component: (<Typography>DEFAULT</Typography>)
        }, 
        {
            label: "PV Name", 
            component: (<TextField sx={{ '& .MuiInputBase-input': {padding: "2px"},height: 20, lineHeight: "unset", padding: 0 }} variant="outlined" value={"TEST-TEST-01:HELLO"} />)
        }, 
        {
            label: "Text",
            component: (<TextField sx={{ '& .MuiInputBase-input': {padding: "2px"},height: 20, lineHeight: "unset", padding: 0 }} variant="outlined" value={"Text on the widget"} />)
        }
    ];

    return (
        <>
            <CssBaseline />
            <MuiDrawer variant="permanent" open anchor="right" sx={{paddingTop: APP_BAR_HEIGHT}} PaperProps={{ sx: { width: PROPERTIES_MENU_WIDTH, height: "100%", paddingTop: `${APP_BAR_HEIGHT}px`}, elevation: 8 }}>
                <MenuBarHeader sx={{ textAlign: "center",  justifyContent: "Center"}}>
                    <Typography variant="h1" sx={{alignContent: "Center"}}>Widget Properties</Typography>
                </MenuBarHeader>
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
            component: (<Checkbox defaultChecked sx={{width: "20px", height: "20px", alignItems: "center"}}/>)
        }, 
        {
            label: "Font", 
            component: (<TextField sx={{ '& .MuiInputBase-input': {padding: "2px"},height: 20, lineHeight: "unset", padding: 0 }} variant="outlined" value={"Arial 14"} />)
        }, 
        {
            label: "Foreground Color", 
            component: (<TextField sx={{ '& .MuiInputBase-input': {padding: "2px"},height: 20, lineHeight: "unset", padding: 0 }} variant="outlined" value={"RGB(100, 109, 199)"} />)
        }, 
        {
            label: "Background Color",
            component: (<TextField sx={{ '& .MuiInputBase-input': {padding: "2px"},height: 20, lineHeight: "unset", padding: 0 }} variant="outlined" value={"RGB(100, 199, 199)"} />)
        }, 
        {
            label: "Transparent", 
            component: (<Checkbox sx={{width: "20px", height: "20px"}}/>)
        },
        {
            label: "Precision", 
            component: (<TextField sx={{ '& .MuiInputBase-input': {padding: "2px"},height: 20, lineHeight: "unset", padding: 0 }} variant="outlined" value={"-1"} />)
        }, 
        {
            label: "Wrap Words", 
            component: (<Checkbox sx={{width: "20px", height: "20px"}}/>)
        }, 
    ];

    const behaviourPropList = [
        {
            label: "Actions", 
            component: <Button variant="outlined" sx={{width: "100%", padding: 0}}>No actions</Button>
        }, 
        {
            label: "Rules", 
            component: <Button variant="outlined" sx={{width: "100%", padding: 0}}>No rules</Button>
        }, 
        {
            label: "Tool tip",
            component: (<TextField sx={{ '& .MuiInputBase-input': {padding: "2px"},height: 20, lineHeight: "unset", padding: 0 }} variant="outlined" value={'${pv_name}\n${pv_name}'} />)
        }, 
        {
            label: "Alarm Border", 
            component: (<Checkbox sx={{width: "20px", height: "20px"}}/>)
        }, 
        {
            label: "Enabled", 
            component: (<Checkbox sx={{width: "20px", height: "20px"}} defaultChecked />)
        }, 
    ];

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h3" sx={{margin: "10px 0px 10px 0px", color: "black", backgroundColor: "#ffe4b5", paddingLeft: "5px" }}>Widget</Typography>
            <Grid container spacing={1} padding={"0px 5px 0px 5px"}>
                {widgetProps.map((item) => (
                    <>
                        <Grid key={item.label} item xs={5}>
                            {item.label}
                        </Grid>
                        <Grid key={item.label + "Field"} item xs={7} sx={{justifyItems: "right"}}>
                            {item.component}
                        </Grid></>
                ))}
            </Grid>
            <Typography variant="h3" sx={{margin: "10px 0px 10px 0px", color: "black", backgroundColor: "#ffe4b5", paddingLeft: "5px" }}>Position</Typography>
            <Grid container spacing={1} padding={"0px 5px 0px 5px"}>
                {positionProps.map((item) => (
                    <>
                        <Grid key={item.label} item xs={5}>
                            {item.label}
                        </Grid>
                        <Grid key={item.label + "Field"} item xs={7} sx={{justifyItems: "right"}}>
                            {item.component}
                        </Grid></>
                ))}
            </Grid>
            <Typography variant="h3" sx={{margin: "10px 0px 10px 0px", color: "black", backgroundColor: "#ffe4b5", paddingLeft: "5px" }}>Display</Typography>
            <Grid container spacing={1} padding={"0px 5px 0px 5px"}>
                {displayPropList.map((item) => (
                    <>
                        <Grid key={item.label} item xs={5}>
                            {item.label}
                        </Grid>
                        <Grid key={item.label + "Field"} item xs={7} justifyContent={"center"} sx={{display: "flex"}}>
                            {item.component}
                        </Grid></>
                ))}
            </Grid>
             <Typography variant="h3" sx={{margin: "10px 0px 10px 0px", color: "black", backgroundColor: "#ffe4b5", paddingLeft: "5px" }}>Behaviour</Typography>
            <Grid container spacing={1} padding={"0px 5px 0px 5px"}>
                {behaviourPropList.map((item) => (
                    <>
                        <Grid key={item.label} item xs={5}>
                            {item.label}
                        </Grid>
                        <Grid key={item.label + "Field"} item xs={7} justifyContent={"center"} sx={{display: "flex"}}>
                            {item.component}
                        </Grid></>
                ))}
            </Grid>
        </Box></>
        
    )
}