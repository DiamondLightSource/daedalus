import { Box, Grid, Stack, Typography } from "@mui/material";
import DLSAppBar from "../components/AppBar";
import { useWindowHeight, APP_BAR_HEIGHT } from "../utils/helper";
import LinkCard from "../components/LinkCard";
import {PageRouteInfo} from "./PageRouteInfo"

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
                {PageRouteInfo.filter(card => card.showCard).map(card => {
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
