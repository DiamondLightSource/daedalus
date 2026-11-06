import {
  Tooltip,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List,
  Theme,
  Box
} from "@mui/material";
import { useNavigate, useLocation } from "react-router";
import { PageRouteInfo } from "../routes/PageRouteInfo";
import { ListItem } from "@mui/material";

function NavRow({
  icon,
  label,
  ariaLabel,
  selected,
  collapsed,
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  ariaLabel?: string;
  selected?: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  const iconEl = (
    <ListItemIcon
      sx={{
        minWidth: 32,
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
        color: collapsed ? "text.primary" : "text.secondary"
      }}
    >
      {icon}
    </ListItemIcon>
  );

  return (
    <ListItem disablePadding sx={{ mb: 0.5 }}>
      <ListItemButton
        selected={selected}
        onClick={onClick}
        aria-label={ariaLabel ?? label}
        sx={{
          p: 1,
          gap: 1.5,
          borderRadius: 2,
          "&.Mui-selected": { bgcolor: "action.selected" }
        }}
      >
        {collapsed ? (
          <Tooltip title={label} placement="right">
            {iconEl}
          </Tooltip>
        ) : (
          iconEl
        )}
        <ListItemText
          primary={label}
          sx={{
            overflow: "hidden",
            opacity: collapsed ? 0 : 1,
            transition: (theme: Theme) =>
              theme.transitions.create("opacity", {
                duration: theme.transitions.duration.shorter
              })
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}

export default function PageNavigationList({
  collapsed
}: {
  collapsed: boolean;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ overflow: "auto", flexShrink: 0 }}>
      <List sx={{ p: 1 }}>
        {PageRouteInfo.map(page => (
          <NavRow
            key={page.name}
            icon={page.icon}
            label={page.name}
            ariaLabel={page.ariaLabel}
            collapsed={collapsed}
            selected={
              page.route === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(page.route)
            }
            onClick={() => navigate(page.route, { state: location.state })}
          />
        ))}
      </List>
    </Box>
  );
}
