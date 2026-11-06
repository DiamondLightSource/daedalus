import { Theme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { APP_BAR_HEIGHT } from "../utils/helper";
import { Box, Divider, Typography } from "@mui/material";
import { Navbar, Logo } from "@diamondlightsource/sci-react-ui";
import { Link as RouterLink } from "react-router";
import { Menu } from "lucide-react";
import BeamlineSelect from "./BeamlineSelect";

type Props = {
  title: string;
  open: boolean;
  synopticView: boolean;
  setOpen: (open: boolean) => void;
  children?: React.ReactNode;
  showMenuButton?: boolean;
};

export function DLSAppBar({
  title,
  open,
  setOpen,
  synopticView = false,
  children,
  showMenuButton = true
}: Props) {
  return (
    <Navbar
      surface="surface"
      variant="base"
      containerWidth={false}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: APP_BAR_HEIGHT,
        zIndex: (theme: Theme) => theme.zIndex.drawer + 1
      }}
      leftSlot={
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {showMenuButton && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => setOpen(!open)}
            >
              <Menu />
            </IconButton>
          )}
          <Box
            component={RouterLink}
            to="/"
            aria-label="Go to home page"
            sx={{
              mr: 2,
              width: 100,
              display: "flex",
              alignItems: "center",
              color: "inherit",
              textDecoration: "none"
            }}
          >
            <Logo />
          </Box>

          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ borderColor: "currentColor", opacity: 0.3 }}
          />
          {title && (
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ ml: 1.5, mr: 1.25 }}
            >
              {title}
            </Typography>
          )}
          {synopticView && (
            <Box sx={{ ml: 1.5, mr: 1.5 }}>
              <BeamlineSelect />
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              minWidth: 0
            }}
          >
            {children}
          </Box>
        </Box>
      }
    />
  );
}

export default DLSAppBar;
