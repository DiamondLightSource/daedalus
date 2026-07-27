import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { useContext, useEffect, useState } from "react";
import { TreeViewBaseItem } from "@mui/x-tree-view";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField
} from "@mui/material";
import {
  useDisplayInstance,
  useNotification
} from "@diamondlightsource/cs-web-lib";
import { StorageContext } from "./Display";

/**
 * Gets all Quick Screens currently in local storage and
 * converts them to Tree View Items
 * @returns
 */
function getQuickScreens(): TreeViewBaseItem[] {
  const children: TreeViewBaseItem[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)!;

    children.push({
      id: key,
      label: key
    });
  }

  children.sort((a, b) => a.label.localeCompare(b.label));
  return children;
}

export default function LocalStorageBrowser(props: { setModalOpen: any }) {
  const [quickScreens, setQuickScreens] = useState<TreeViewBaseItem[]>([]);
  const quickScreenStorage = useContext(StorageContext);
  const [selectedKey, setSelectedKey] = useState("");
  const [quickScreenName, setQuickScreenName] = useState("");
  const fileContent = useDisplayInstance(quickScreenStorage.bobDisplayUuid!);
  const { showWarning, showError } = useNotification();
  const [confirmOverwrite, setConfirmOverwrite] = useState(false);

  useEffect(() => {
    setQuickScreens(getQuickScreens());
  }, []);

  const handleSelection = (_: any, itemId: any) => {
    const storedValue = localStorage.getItem(itemId) ?? "";
    console.log(storedValue);
    setSelectedKey(itemId);
    setQuickScreenName(itemId);
  };

  const handleSave = () => {
    // If no file name or file content, show notification
    if (!quickScreenName.trim() || !fileContent) {
      if (!quickScreenName.trim())
        showWarning("Unable to save: no Quick Screen name given.");
      if (!fileContent)
        showError("Unable to save: no Quick Screen content found.");
      return;
    }

    const oldScreen = localStorage.getItem(quickScreenName);
    const newScreen = createNewScreen();
    // Check if content already exists for this name
    if (oldScreen && oldScreen !== newScreen) {
      // User confirmation to overwrite
      setConfirmOverwrite(true);
      return;
    }
    saveQuickScreen();
  };

  /**
   * Creates the new Quick Screen instance
   */
  const createNewScreen = () =>
    JSON.stringify({
      macros: fileContent?.macros ?? {},
      description: fileContent?.description
    });

  const saveQuickScreen = () => {
    const newScreen = createNewScreen();
    localStorage.setItem(quickScreenName, newScreen);
    props.setModalOpen(false);
  };

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          height: 300
        }}
      >
        <RichTreeView
          items={quickScreens}
          onSelectedItemsChange={handleSelection}
          selectedItems={selectedKey}
        />
      </Box>
      <Stack direction="row" spacing={2}>
        <TextField
          label="Quick Screen Name"
          value={quickScreenName}
          onChange={e => setQuickScreenName(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </Stack>
      <Dialog
        open={confirmOverwrite}
        onClose={() => setConfirmOverwrite(false)}
      >
        <DialogTitle>Overwrite Quick Screen?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A Quick Screen named <strong>{quickScreenName}</strong> already
            exists. Saving will replace the existing content. Are you sure you
            want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOverwrite(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              setConfirmOverwrite(false);
              saveQuickScreen();
            }}
          >
            Save and overwrite
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
