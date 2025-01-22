import { useContext } from 'react';
import BeamlineTreeStateContext from '../routes/MainPage';
import { Link, Paper, Typography } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function ScreenDisplay() {
    const { state, dispatch } = useContext(BeamlineTreeStateContext);

    const breadcrumbs = createBreadcrumbs(state.currentScreenId, state.currentBeamline)

    return (
        <Paper component="main" sx={{ p: 2, margin: "70px 5px 5px 5px" }}>
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
            >
                {breadcrumbs}
            </Breadcrumbs>
            <Typography sx={{ marginBottom: 2 }}>
                Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper
                eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim
                neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra
                tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis
                sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi
                tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit
                gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
                et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
                tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
                eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
                posuere sollicitudin aliquam ultrices sagittis orci a.
            </Typography>
        </Paper>
    );
}

/**
 * Navigates the screen Treeview to determine the correct
 * breadcrumb trail
 */
function createBreadcrumbs(screenId: string, beamline: string) {
    const breadcrumbs: any[] = [];
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