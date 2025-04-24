import { useState } from 'react';
import { AppBar, Box, ClickAwayListener, CssBaseline, IconButton, Paper as MuiPaper, PaperProps as MuiPaperProps, styled, Toolbar } from '@mui/material';
import { EmbeddedDisplay, RelativePosition } from '@diamondlightsource/cs-web-lib';
import { useWindowWidth, APP_BAR_HEIGHT, useWindowHeight, PROPERTIES_MENU_WIDTH } from '../utils/helper';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PropertiesSideBar from './PropertiesSideBar';
import MenuIcon from '@mui/icons-material/Menu';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';


export interface WidgetProps {
    x: string,
    y: string,
    w: string,
    h: string,
    display?: {
        [key: string]: string
    }
}

const Paper = styled(MuiPaper)(({ theme }) => ({
    height: `calc(${useWindowHeight()}px - 30px - ${theme.spacing(7)})`,
    width: `calc(${useWindowWidth()}px - ${PROPERTIES_MENU_WIDTH}px - ${theme.spacing(7)})`,
    margin: `calc(${APP_BAR_HEIGHT}px + 10px) ${PROPERTIES_MENU_WIDTH}px 5px 5px`,
}));

export default function Editor() {
    const [widgetProperties, setWidgetProperties] = useState<WidgetProps>({x: "", y: "", w: "", h: ""})
    const [selected, setSelected] = useState(false);
    const [displaySelected, setDisplaySelected] = useState(false);
    

    function handleClick(event: any) {
        // Get coordinates and dimensions
        const target = event.target;
        setDisplaySelected((target.className as string) === "display" ? true : false);
        getWidgetCoords(target);
        setSelected(true);
    }

    const handleClickAway = () => {
        setSelected(false);
        setDisplaySelected(false);
        setWidgetProperties({x: "", y: "", w: "", h: ""})
    };


    function getWidgetCoords(widget: any) {
        // This is our parent div
        if (widget.tagName === "DIV" && (widget.className as string).includes("Widget")) {
            // Fetch type of widget, remove "Widget" and "Component" as part of names
            let widgetType = (widget.className as string).split(" ").pop()
            widgetType = (widget.className as string).replaceAll("Widget", "");
            widgetType = widgetType.replace("Component", "")
            const style = widget.style;
            setWidgetProperties({x: style.left, y: style.top, w: style.width, h: style.height, display: { type: widgetType}})
            return;
        } else {
            getWidgetCoords(widget.parentNode)
        }
    }

    const handleOpenSettings = () => {
        console.log("TO DO - create settings modal")
    };

    return (
         <>
            <CssBaseline />
            <AppBar position="absolute" sx={{ height: APP_BAR_HEIGHT, width: "100%", zIndex: (theme) => theme.zIndex.drawer + 1}}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        
                    >
                        <UndoIcon />
                    </IconButton>
                    <IconButton
                        color="inherit"
                    >
                        <RedoIcon />
                    </IconButton>
                    <IconButton
                        color="inherit"
                    >
                        <FormatAlignCenterIcon/>
                    </IconButton>
                     <IconButton
                        color="inherit"
                    >
                        <ZoomInIcon/>
                    </IconButton>
                    <IconButton
                        color="inherit"
                    >
                        <ZoomOutIcon/>
                    </IconButton>
                     <IconButton
                        color="inherit"
                        sx={{position: "absolute", left: `calc(96% - ${PROPERTIES_MENU_WIDTH}px)`}}
                    >
                        <PlayArrowIcon/>
                    </IconButton>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleOpenSettings}
                        sx={{ position: "absolute", left: "96%" }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Paper >
                <ClickAwayListener onClickAway={handleClickAway}>
                    <Box sx={{ position: "absolute" }} onClick={handleClick}>
                        {selected ? <Box
                            className={"selected-border"}
                            sx={{
                                position: "absolute",
                                zIndex: displaySelected ? 0 : 1,
                                top: widgetProperties.y,
                                left: widgetProperties.x,
                                height: widgetProperties.h,
                                width: widgetProperties.w,
                                outline: "2px dashed #6661fa"
                            }} /> : null}
                        <EmbeddedDisplay
                            file={{
                                path: "/BOBs/TopLevel.bob",
                                defaultProtocol: "ca",
                                macros: {}
                            }}
                            position={new RelativePosition()}
                            scroll={false} />
                    </Box>
                </ClickAwayListener>
            </Paper> 
            <PropertiesSideBar properties={widgetProperties}/>
        </>       
    );
}