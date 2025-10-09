import { Box, Grid, Stack, Typography } from "@mui/material";
import DLSAppBar from "../components/AppBar";
import { useWindowHeight, APP_BAR_HEIGHT } from "../utils/helper";
import LinkCard from "../components/LinkCard";

const CARD_INFO = [
  {
    name: "Screen Demo",
    route: "/demo",
    text: "A page to test out the .bob screen display capabilities of Daedalus.\n\nPass in the URL to a file, add any macros you might need and see how the screen looks rendered with cs-web-lib."
  },
  {
    name: "Synoptic View",
    route: "/synoptic",
    text: "A demonstration of beamline synoptic views, allowing you to navigate the system of files via in-screen buttons, breadcrumbs or a generated map of the available files.\n\nSelect a beamline from the dropdown to begin."
  },
  {
    name: "Editor View",
    route: "/editor",
    text: "A demonstration of the Daedalus Editor functionality. This will eventually allow editing of .bob files inside the web.\n\nOpen files, view widget properties and drag-and-drop new widgets from the palette."
  },
  {
    name: "Data Browser",
    route: "/data-browser",
    text: "A demo recreation of Phoebus' Data Browser, this allows you to view archived PV data plotted against time.\n\nType in the name of a PV, select an archiver and view the plot as it updates with real-time data."
  }
];

export function LandingPage() {
  // get width
  return (
    <>
      <DLSAppBar fullScreen={true}/>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: `calc(${useWindowHeight()}px - ${APP_BAR_HEIGHT}px - 10px)`,
          margin: `calc(${APP_BAR_HEIGHT}px + 5px) 5px 5px 5px`
        }}
      >
        <Stack sx={{ alignItems: "center" }}>
          <Typography variant="h1" sx={{ margin: "10px", textAlign: "center" }}>
            Welcome to Daedalus!
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            <br />
            Daedalus is a demo web application for EPICS, modelled on Phoebus
            .bob files.
            <br />
            It comprises multiple separate demos, including a beamline synoptic,
            an editor and a Data Browser.
            <br />
            You can explore the demos below.
          </Typography>
          <Grid sx={{ marginTop: "3%", width: "85%" }} container>
            <Grid item md={3} sm={0} />
            <Grid item md={6} sm={12}>
              <Grid container spacing={2}>
                {CARD_INFO.map(card => {
                  return (
                    <Grid key={card.name} item xs={12} sm={6}>
                      <LinkCard info={card} />
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
            <Grid item md={3} sm={0} />
          </Grid>
        </Stack>
      </Box>
    </>
  );
}
