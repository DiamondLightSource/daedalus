import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { ReactNode, useContext } from "react";
import { Breadcrumbs, Link } from "@mui/material";
import { FileContext } from "@diamondlightsource/cs-web-lib";
import { BeamlineStateProperties } from "../store";
import { BeamlineTreeStateContext } from "../App";
import { executeOpenPageActionWithUrlId } from "../utils/csWebLibActions";

export const SynopticBreadcrumbs = () => {
  const { state } = useContext(BeamlineTreeStateContext);
  const fileContext = useContext(FileContext);

  const breadcrumbs = createBreadcrumbs(
    state.currentScreenUrlId,
    state.currentBeamline
  );

  return (
    <Breadcrumbs
      onClick={handleClick(
        state.currentBeamline,
        state.beamlines[state.currentBeamline],
        fileContext
      )}
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      sx={{
        marginBottom: "10px",
        p: 2,
        paddingBottom: 0,
        textAlign: "left",
        color: "white",
        display: "flex",
        flexGrow: 1
      }}
    >
      {breadcrumbs}
    </Breadcrumbs>
  );
};

const handleClick =
  (
    selectedBeamlineId: string,
    beamlineState: BeamlineStateProperties,
    fileContext: any
  ) =>
  (event: any) => {
    if (event.target.pathname) {
      event.preventDefault();
      const urlId = decodeURI(event.target.pathname)
        .split("/")
        .at(-1) as string;

      executeOpenPageActionWithUrlId(
        beamlineState,
        urlId,
        selectedBeamlineId,
        fileContext
      );
    }
  };

/**
 * Navigates the screen Treeview to determine the correct
 * breadcrumb trail
 */
const createBreadcrumbs = (
  screenUrlId: string,
  beamline: string
): ReactNode => {
  const breadcrumbs: ReactNode[] = [];
  if (beamline === "") return null;
  const breadcrumbLabels = screenUrlId.split("+");
  let linkUrl = `/synoptic/${beamline}/`;

  breadcrumbLabels.forEach((label, idx) => {
    if (idx !== 0) linkUrl += "+";
    linkUrl += label;
    breadcrumbs.push(
      idx === breadcrumbLabels.length - 1 ? (
        <Typography key="3" sx={{ color: "white" }}>
          {label}
        </Typography>
      ) : (
        <Link underline="hover" key={idx} color="white" href={linkUrl}>
          {label}
        </Link>
      )
    );
  });
  return breadcrumbs;
};
