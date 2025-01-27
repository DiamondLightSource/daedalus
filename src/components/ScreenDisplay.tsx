import { useContext } from 'react';
import BeamlineTreeStateContext from '../routes/MainPage';
import { Box, Divider, Link, Paper, Typography } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useHistory } from 'react-router-dom';
import { EmbeddedDisplay, RelativePosition } from '@diamondlightsource/cs-web-lib';

export default function ScreenDisplay() {
    const { state, dispatch } = useContext(BeamlineTreeStateContext);
    const history = useHistory();

    const breadcrumbs = createBreadcrumbs(state.currentScreenId, state.currentBeamline)

    function handleClick(event: any) {
        event.preventDefault();
        history.push(event.target.pathname)
    }

    return (
        <Paper component="main" sx={{ margin: "70px 5px 5px 5px" }}>
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
                            {state.currentBeamline && state.currentScreenId ? <EmbeddedDisplay
                                height={800}
                                position={new RelativePosition()}
                                scroll={true}
                                resize={0}
                                file={
                                    {
                                        path: state.beamlines[state.currentBeamline].filePathIds[state.currentScreenId],
                                        macros: {},
                                        defaultProtocol: "ca"
                                    }
                                }
                            /> : <></>}
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