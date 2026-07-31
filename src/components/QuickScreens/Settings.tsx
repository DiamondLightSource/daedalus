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
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog as MuiDialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  ListItemText,
  Stack,
  Tooltip
} from "@mui/material";
import { useNavigate } from "react-router";
import { useContext, useState } from "react";
import LocalStorageBrowser from "./StorageBrowser";
import { StorageContext } from "./Display";

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

const Dialog = styled(MuiDialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2)
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1)
  }
}));

export default function QuickScreenSettings() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [storageModalOpen, setStorageModalOpen] = useState(false);
  const quickScreenStorage = useContext(StorageContext);

  const handleCloseModal = (_event: any) => {
    setStorageModalOpen(false);
  };

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
    setStorageModalOpen(true);
    quickScreenStorage.setBrowsingMode("Save");
  };

  /**
   * Loads a quick screen from local storage
   */
  const onClickLoad = () => {
    setStorageModalOpen(true);
    quickScreenStorage.setBrowsingMode("Load");
  };

  /**
   * Loads a quick screen from local storage
   */
  const onClickDelete = () => {
    console.log("clicked delete");
    quickScreenStorage.setBrowsingMode("Delete");
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
    <>
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
      <Dialog
        onClose={handleCloseModal}
        aria-labelledby="settings-menu-title"
        open={storageModalOpen}
        fullWidth={true}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="settings-menu-title">
          Quick Screen Browser
        </DialogTitle>
        <DialogContent dividers>
          <Grid container>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <LocalStorageBrowser setModalOpen={setStorageModalOpen} />
            </Stack>
          </Grid>
        </DialogContent>
        <IconButton
          aria-label="close"
          onClick={handleCloseModal}
          sx={theme => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.primary.main
          })}
        >
          <CloseIcon />
        </IconButton>
      </Dialog>
    </>
  );
}
