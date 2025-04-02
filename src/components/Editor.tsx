import { useState } from 'react';
import { AppBar, Box, ClickAwayListener, CssBaseline, Paper as MuiPaper, PaperProps as MuiPaperProps, styled, Toolbar } from '@mui/material';
import { EmbeddedDisplay, RelativePosition } from '@diamondlightsource/cs-web-lib';
import { useWindowWidth, APP_BAR_HEIGHT, useWindowHeight, PROPERTIES_MENU_WIDTH } from '../utils/helper';


interface PaperProps extends MuiPaperProps {
    open?: boolean;
}

const Paper = styled(MuiPaper)<PaperProps>(({ theme }) => ({
    height: `calc(${useWindowHeight()}px - 30px - ${theme.spacing(7)})`,
    width: `calc(${useWindowWidth()}px - ${PROPERTIES_MENU_WIDTH}px - ${theme.spacing(7)})`,
    margin: `calc(${APP_BAR_HEIGHT}px + 10px) ${PROPERTIES_MENU_WIDTH}px 5px 5px`,
}));

export default function Editor() {
    const [widgetProperties, setWidgetProperties] = useState({})
    const [selected, setSelected] = useState(false);
    const [displaySelected, setDisplaySelected] = useState(false);
    const [selectedBorder, setSelectedBorder] = useState({x: null, y: null, w: null, h: null})
    

    function handleClick(event: any) {
        // Get coordinates and dimensions
        const target = event.target;
        console.log(target.className);
        setDisplaySelected((target.className as string) === "display" ? true : false);
        getWidgetCoords(target);
        setSelected(true);
    }

    const handleClickAway = () => {
        setSelected(false);
        setDisplaySelected(false);
    };


    function getWidgetCoords(widget: any) {
        if (widget.tagName === "DIV" && (widget.className as string).includes("Widget")) {
            // This is our parent div
            const style = widget.style;
            setSelectedBorder({x: style.left, y: style.top, w: style.width, h: style.height})
            return;
        } else {
            getWidgetCoords(widget.parentNode)
        }
    }

    return (
         <>
            <CssBaseline />
            <AppBar position="absolute" sx={{ height: APP_BAR_HEIGHT, width: `calc(100% - ${PROPERTIES_MENU_WIDTH})`, marginRight: "15%" }}>
                <Toolbar>
                   
                </Toolbar>
            </AppBar>
            <Paper component="main">
                <ClickAwayListener onClickAway={handleClickAway}>
                    <Box sx={{ position: "absolute" }} onClick={handleClick}>
                        {selected ? <Box
                            className={"selected-border"}
                            sx={{
                                position: "absolute",
                                zIndex: displaySelected ? 0 : 1,
                                top: selectedBorder.y,
                                left: selectedBorder.x,
                                height: selectedBorder.h,
                                width: selectedBorder.w,
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
        </>       
    );
}