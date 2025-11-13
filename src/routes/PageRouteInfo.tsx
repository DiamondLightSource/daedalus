import HomeIcon from "@mui/icons-material/Home";
import FlareIcon from "@mui/icons-material/Flare";
import MonitorIcon from "@mui/icons-material/Monitor";
import EditIcon from "@mui/icons-material/Edit";
import ShowChartIcon from "@mui/icons-material/ShowChart";

export const PageRouteInfo = [
  {
    name: "Home page",
    ariaLabel: "open home page",
    route: "/",
    text: "",
    icon: <HomeIcon />,
    showCard: false
  },
  {
    name: "Screen Demo",
    ariaLabel: "open demo screen page",
    route: "/demo",
    text: "A page to test out the .bob screen display capabilities of Daedalus.\n\nPass in the URL to a file, add any macros you might need and see how the screen looks rendered with cs-web-lib.",
    icon: <MonitorIcon />,
    showCard: true
  },
  {
    name: "Synoptic View",
    ariaLabel: "open the beamline synoptic screens",
    route: "/synoptic",
    text: "A demonstration of beamline synoptic views, allowing you to navigate the system of files via in-screen buttons, breadcrumbs or a generated map of the available files.\n\nSelect a beamline from the dropdown to begin.",
    icon: <FlareIcon />,
    showCard: true
  },
  {
    name: "Editor View",
    ariaLabel: "open screen editor",
    route: "/editor",
    text: "A demonstration of the Daedalus Editor functionality. This will eventually allow editing of .bob files inside the web.\n\nOpen files, view widget properties and drag-and-drop new widgets from the palette.",
    icon: <EditIcon />,
    showCard: true
  },
  {
    name: "Data Browser",
    ariaLabel: "open data browser",
    route: "/data-browser",
    text: "A demo recreation of Phoebus' Data Browser, this allows you to view archived PV data plotted against time.\n\nType in the name of a PV, select an archiver and view the plot as it updates with real-time data.",
    icon: <ShowChartIcon />,
    showCard: true
  }
];
