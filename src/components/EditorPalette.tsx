import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import { Box, Button, ClickAwayListener, CssBaseline, IconButton, TextField, Typography, useTheme } from '@mui/material';
import Grid from "@mui/material/Grid";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useState } from 'react';
import { ActionButton, Arc, BoolButton, ChoiceButton, Color, DropDown, Ellipse, Input, Label, Line, MenuButton, Polygon, Readback, RelativePosition, Shape } from '@diamondlightsource/cs-web-lib';

const MenuBarHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
}));

export interface PaletteProps {
}

export default function EditorPalette(props: PaletteProps) {
    const [open, setOpen] = useState(false)
    const theme = useTheme();

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };


    return (
        <>
            <IconButton
                color="inherit"
                sx={{zIndex: 10, top: "90%", left: "93%"}}
                onClick={toggleDrawer(true)}
            >
                <AddCircleOutlineIcon sx={{width: "36px", height: "36px", color: theme.palette.primary.main}}/>
            </IconButton>
            <Drawer open={open} variant="temporary" anchor="bottom" onClose={toggleDrawer(false)} PaperProps={{ sx: { height: "300px", width: "100%"} } }>
                <MenuBarHeader sx={{ textAlign: "left",  justifyContent: "left"}}>
                    <Typography variant="h2" sx={{alignContent: "Center"}}>Palette</Typography>
                </MenuBarHeader>
                <PaletteGrid togglePalette={setOpen}/>
            </Drawer>     
        </>
    );
}

/**
 * A grid of all components
 */
function PaletteGrid(props: {togglePalette: any}) {
    const { togglePalette } = props;
    // This includes a label for each, and then a basic implementation of it

    const handleDrag = () => {
        togglePalette(false);
    }

    const components = [
        {
            name: "Label",
            components: (<Label position={new RelativePosition("120px", "20px")} text="Label Text" backgroundColor={Color.fromRgba(166, 166, 166)}/>)
        },
        {
            name: "Text Entry",
            component: (<Input position={new RelativePosition("120px", "20px")} />)
        },
        {
            name: "Text Update",
            component: (<Readback position={new RelativePosition("120px", "20px")} />)
        },
        {
            name: "ComboBox",
            component: (<MenuButton position={new RelativePosition("120px", "20px")} />)
        },
        {
            name: "Action Button",
            component: (<ActionButton position={new RelativePosition("120px", "20px")} text="Action Button"/>)
        },
        {
            name: "Boolean Button",
            component: (<BoolButton position={new RelativePosition("120px", "20px")} />)
        },
        {
            name: "Choice Button",
            component: (<ChoiceButton position={new RelativePosition("120px", "20px")} />)
        },
        {
            name: "Arc",
            component: (<Arc position={new RelativePosition("50px", "30px")} width={30} height={30} lineWidth={1}/>)
        },
        {
            name: "Ellipse",
            component: (<Ellipse position={new RelativePosition("70px", "20px")} />)
        },
        {
            name: "Polygon",
            component: (
              <Polygon 
                position={new RelativePosition("120px", "20px")} 
                points={{
                        values: [
                        { x: 0, y: 20 },
                        { x: 20, y: 0 },
                        { x: 70, y: 0 },
                        { x: 50, y: 20 },
                    ]
                    }}
              />)
        },
        {
            name: "Polyline",
            component: (
              <Line 
                position={new RelativePosition("120px", "20px")} 
                height={20} 
                width={70} 
                points={{
                    values: [
                        { x: 0, y: 10 },
                        { x: 20, y: 0 },
                        { x: 30, y: 10 },
                        { x: 50, y: 0 },
                        { x: 70, y: 10 }
                    ]
                }}
              />)
        },
        {
            name: "Rectangle",
            component: (<Shape position={new RelativePosition("120px", "20px")} />)
        }
    ]

    return (
        <>
        <Grid container spacing={2} rowGap={5}>
                {components.map((item) => (
                    <>
                        <Grid key={item.name} item xs={1}>
                            {item.name}
                        </Grid>
                        <Grid key={item.name + "Field"} item xs={1} sx={{justifyItems: "right"}}>
                            <div draggable onDrag={handleDrag}>
                                {item.component}
                            </div>
                        </Grid></>
                ))}
        </Grid>
        </>
    )
}