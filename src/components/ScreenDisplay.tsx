import { useContext, useEffect } from 'react';
import BeamlineTreeStateContext from '../routes/MainPage';
import { Box, Divider, Link, Paper as MuiPaper, PaperProps as MuiPaperProps, styled, Typography } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useHistory, useLocation } from 'react-router-dom';
import { DynamicPageWidget, executeAction, FileContext, RelativePosition } from '@diamondlightsource/cs-web-lib';
import { useWindowWidth, useWindowHeight, DRAWER_WIDTH, APP_BAR_HEIGHT } from '../utils/helper';


interface PaperProps extends MuiPaperProps {
    open?: boolean;
}

const Paper = styled(MuiPaper, {
    shouldForwardProp: (prop) => prop !== 'open',
})<PaperProps>(({ theme }) => ({
    height: `calc(${useWindowHeight()}px - ${APP_BAR_HEIGHT}px - 10px)`,
    margin: `calc(${APP_BAR_HEIGHT}px + 5px) 5px 5px 5px`,
    variants: [
        {
            props: ({ open }) => open,
            style: {
                width: `calc(${useWindowWidth()}px - 10px - ${DRAWER_WIDTH}px)`,
            },
        },
        {
            props: ({ open }) => !open,
            style: {
                width: `calc(${useWindowWidth()}px - 10px - ${theme.spacing(7)} - 8px)`,
            },
        },
    ],
}));

export default function ScreenDisplay() {
    const { state } = useContext(BeamlineTreeStateContext);
    const fileContext = useContext(FileContext)
    const history = useHistory();
    const location = useLocation();

    const breadcrumbs = createBreadcrumbs(state.currentScreenId, state.currentBeamline)

    function handleClick(event: any) {
        event.preventDefault();
        const screenId = decodeURI(event.target.pathname).split("/").at(-1) as string;
        const newScreen = state.beamlines[state.currentBeamline].filePathIds[screenId];
        executeAction({
            type: 'OPEN_PAGE',
            dynamicInfo: {
                name: newScreen,
                location: "main",
                description: undefined,
                file: {
                    path: newScreen,
                    macros: {},
                    defaultProtocol: "ca"
                }
            }
        }, fileContext, undefined, {}, event.target.pathname)
    }

    useEffect(() => {
        // This catches file changes done inside the file by actionbuttons
        // and updates the URL to match the fileroute
        if (state.currentBeamline) {
            const pathname = location.pathname.replace(`/${state.currentBeamline}/`, "");
            const allFiles = state.beamlines[state.currentBeamline].filePathIds
            const currentPath = Object.keys(allFiles).find(key => allFiles[key] === fileContext.pageState.main.path)
            if (currentPath !== pathname) {
                // URL and state are out of sync with file displayed, update accordingly
                history.replace(`/${state.currentBeamline}/${currentPath}`, location.state)
            }
        }
    }, [fileContext.pageState.main])

    return (
        <Paper component="main" open={state.menuBarOpen} >
            <Box>
                {breadcrumbs.length === 0 ?
                    <Typography sx={{ marginBottom: 2 }}>
                        Homepage! You have no file loaded
                    </Typography>
                    :
                    <>
                        <Breadcrumbs
                            onClick={handleClick}
                            separator={<NavigateNextIcon fontSize="small" />}
                            aria-label="breadcrumb"
                            sx={{ marginBottom: "10px", p: 2, paddingBottom: 0 }}
                        >
                            {breadcrumbs}
                        </Breadcrumbs>
                        <Divider variant="fullWidth" sx={{ width: "100%" }} />
                        <Box>
                            {state.currentBeamline && state.currentScreenId ?
                                <DynamicPageWidget
                                    location={"main"}
                                    position={new RelativePosition()}
                                    scroll={false}
                                    showCloseButton={false}
                                />
                                : <></>}
                        </Box>
                    </>
                }
            </Box>
        </Paper >
    );
}

/**
 * Navigates the screen Treeview to determine the correct
 * breadcrumb trail
 */
function createBreadcrumbs(screenId: string, beamline: string) {

    const breadcrumbs: any[] = [];
    if (beamline === "") return [];

    const breadcrumbLabels = screenId.split("-")
    let linkUrl = `/${beamline}/`
    breadcrumbLabels.forEach((label, idx) => {
        if (idx !== 0) linkUrl += "-"
        linkUrl += label;
        breadcrumbs.push(
            (idx === breadcrumbLabels.length - 1) ?
                <Typography key="3" sx={{ color: 'text.primary' }}>
                    {label}
                </Typography>
                :
                <Link underline="hover" key={idx} color="inherit" href={linkUrl}>
                    {label}
                </Link>
        )
    })
    return breadcrumbs;
}