import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { ReactNode, useContext } from "react";
import { Breadcrumbs, Link } from "@mui/material";
import { executeAction, FileContext } from "@diamondlightsource/cs-web-lib";
import { BeamlineStateProperties } from "../store";
import { BeamlineTreeStateContext } from "../App";
import { buildUrl } from "../utils/urlUtils";

export const SynopticBreadcrumbs = () => {
  const { state } = useContext(BeamlineTreeStateContext);
  const fileContext = useContext(FileContext);

  const breadcrumbs = createBreadcrumbs(
    state.currentScreenUrlId,
    state.currentBeamline
  );

  return (
    <Breadcrumbs
      onClick={handleClick(state.beamlines[state.currentBeamline], fileContext)}
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
  (currentBeamlineState: BeamlineStateProperties, fileContext: any) =>
  (event: any) => {
    if (event.target.pathname) {
      event.preventDefault();
      const urlId = decodeURI(event.target.pathname)
        .split("/")
        .at(-1) as string;

      const fileMetadata = Object.values(currentBeamlineState.filePathIds).find(
        x => x.urlId === urlId
      );
      const newScreen = buildUrl(
        currentBeamlineState.host,
        fileMetadata?.file
      );

      executeAction(
        {
          type: "OPEN_PAGE",
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
        },
        fileContext,
        undefined,
        {},
        event.target.pathname
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
