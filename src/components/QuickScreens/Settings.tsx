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
import CloseIcon from "@mui/icons-material/Close";
import ReplayIcon from "@mui/icons-material/Replay";
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
import { useContext, useId, useState } from "react";
import LocalStorageBrowser from "./StorageBrowser";
import { StorageContext } from "./Display";
import BobFileBrowser from "./FileBrowser";
import { executeOpenQuickScreen } from "../../utils/csWebLibActions";
import {
  FileContext,
  newRelativePosition,
  useDisplayInstance
} from "@diamondlightsource/cs-web-lib";

// Template for new quick scree
// This might allow us to modify props in future
const NEW_QUICK_SCREEN = {
  type: "displayGridLayout",
  position: newRelativePosition(0, 0, "100%", "100%"),
  children: [],
  editable: true,
  fileId: "",
  name: "",
  id: "displayGridLayout",
  backgroundColor: { colorString: "rgba(240, 240, 240, 1)" },
  border: { style: "None", width: 0, color: { colorString: "rgba(0,0,0,1)" } },
  actions: { actions: [] },
  rules: [],
  scripts: []
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
  const fileContext = useContext(FileContext);
  const [storageModalOpen, setStorageModalOpen] = useState(false);
  const [bobModalOpen, setBobModalOpen] = useState(false);
  const quickScreenStorage = useContext(StorageContext);
  const { addDisplayInstanceByDescription, removeDisplayInstance } =
    useDisplayInstance("");
  const id = useId();

  const handleCloseModal = (_event: any) => {
    setStorageModalOpen(false);
    setBobModalOpen(false);
  };

  /**
   * Loads a new blank quick screen
   */
  const onClickNew = () => {
    const macros = { LCID: id };
    // Add new display, use default width for now
    // Use empty string for name, so user has to name to save
    removeDisplayInstance("");
    addDisplayInstanceByDescription("", macros, NEW_QUICK_SCREEN);
    executeOpenQuickScreen("", "quickScreen", macros, fileContext, "");
  };

  /**
   * Adds a new screen to the current view to draw components from
   */
  const onClickAdd = () => {
    setBobModalOpen(true);
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
   * Reloads the latest autosaved quickscreen from local storage
   */
  const onClickRestore = () => {
    quickScreenStorage.restoreQuickScreenSession();
  };

  const SETTINGS_LIST = [
    {
      name: "New",
      text: "Create new blank Quick Screen",
      icon: <AddIcon />,
      onClick: onClickNew
    },
    {
      name: "Load",
      text: "Browse and Load Quick Screens",
      icon: <UploadFileIcon />,
      onClick: onClickLoad
    },
    {
      name: "Save",
      text: "Save the current Quick Screen",
      icon: <SaveIcon />,
      onClick: onClickSave
    },
    {
      name: "Add",
      text: "Add a .bob file to the view",
      icon: <LibraryAddIcon />,
      onClick: onClickAdd
    },
    {
      name: "Restore",
      text: "Restore last quickScreen session",
      icon: <ReplayIcon />,
      onClick: onClickRestore
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
      <Dialog
        onClose={handleCloseModal}
        aria-labelledby="bob-file-browser"
        open={bobModalOpen}
        fullWidth={true}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="settings-menu-title">
          Bob File Browser
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
              <BobFileBrowser />
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
