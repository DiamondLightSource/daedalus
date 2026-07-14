import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import AddIcon from "@mui/icons-material/Add";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import SaveIcon from "@mui/icons-material/Save";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { ListItemText, Tooltip } from "@mui/material";
import { useNavigate } from "react-router";

const NEW_QUICK_SCREEN = {
  path: "/new.bob",
  macros: {},
  defaultProtocol: "ca"
};

const Drawer = styled(MuiDrawer)(() => ({
  overflowX: "hidden",
  width: "3%",
  minWidth: "50px",
  "& .MuiPaper-root": {
    position: "relative",
    overflowX: "hidden"
  }
}));

export default function QuickScreenSettings() {
  const theme = useTheme();
  const navigate = useNavigate();

  /**
   * Loads a new blank quick screen
   */
  const onClickNew = () => {
    //Change to a blank Quick Screen
    navigate("/quick-screens/", {
      state: { pageState: { quickScreen: NEW_QUICK_SCREEN } },
      replace: true
    });
  };

  /**
   * Adds a new screen to the current view to draw components from
   */
  const onClickAdd = () => {
    console.log("clicked add");
  };

  /**
   * Saves the current quick screen to local storage
   */
  const onClickSave = () => {
    console.log("clicked save");
  };

  /**
   * Loads a quick screen from local storage
   */
  const onClickLoad = () => {
    console.log("clicked load");
  };

  /**
   * Loads a quick screen from local storage
   */
  const onClickDelete = () => {
    console.log("clicked delete");
  };

  const SETTINGS_LIST = [
    {
      name: "New",
      text: "Create new blank Quick Screen",
      icon: <AddIcon />,
      onClick: onClickNew
    },
    {
      name: "Add",
      text: "Add a .bob file to the view",
      icon: <LibraryAddIcon />,
      onClick: onClickAdd
    },
    {
      name: "Save",
      text: "Save the current Quick Screen",
      icon: <SaveIcon />,
      onClick: onClickSave
    },
    {
      name: "Load",
      text: "Load a Quick Screen",
      icon: <UploadFileIcon />,
      onClick: onClickLoad
    },
    {
      name: "Delete",
      text: "Discard the current Quick Screen",
      icon: <DeleteIcon />,
      onClick: onClickDelete
    }
  ];

  return (
    <Drawer variant="permanent" open={true}>
      <List>
        {SETTINGS_LIST.map(item => (
          <ListItem key={item.name} disablePadding sx={{ display: "block" }}>
            <Tooltip title={item.text} placement="right">
              <ListItemButton
                sx={{
                  minHeight: 48,
                  flexDirection: "column"
                }}
                onClick={item.onClick}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    justifyContent: "center",
                    mr: "auto",
                    color: theme.palette.primary.main
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  sx={{
                    minWidth: 0,
                    textAlign: "center",
                    color: theme.palette.primary.main
                  }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
