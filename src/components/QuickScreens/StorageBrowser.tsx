import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { useContext, useEffect, useState } from "react";
import {
  TreeItem2,
  TreeItem2Props,
  TreeViewBaseItem,
  TreeViewItemId,
  useTreeItem2
} from "@mui/x-tree-view";
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
import { getAllScreensWithChildrenItemIds } from "../utils";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";

/**
 * Custom Tree Item that lets us change icon
 * @param props
 * @returns
 */
function QuickScreenTreeItem(props: TreeItem2Props) {
  const { status } = useTreeItem2({
    itemId: props.itemId,
    children: props.children
  });

  return (
    <TreeItem2
      {...props}
      slots={{
        icon: () =>
          status.expandable ? (
            status.expanded ? (
              <FolderOpenIcon fontSize="small" />
            ) : (
              <FolderIcon fontSize="small" />
            )
          ) : (
            <SubdirectoryArrowRightIcon fontSize="small" />
          )
      }}
    />
  );
}

/**
 * Gets all Quick Screens currently in local storage and
 * converts them to Tree View Items
 * @returns
 */
function getQuickScreens(): TreeViewBaseItem[] {
  const tree: TreeViewBaseItem[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)!;

    // Check the item is part of Quick Screens
    if (!key || !key.startsWith("quickScreens/")) continue;
    // Fetch content
    const screenName = key.substring("quickScreens/".length);
    const parts = screenName.split("/");
    // Check if screen is in folder
    let currentLevel = tree;
    // For each folder, create child file labels/folders
    for (let j = 0; j < parts.length; j++) {
      const part = parts[j];
      const id = parts.slice(0, j + 1).join("/");

      let branch = currentLevel.find(item => item.id === id);
      const isFolder = j < parts.length - 1;

      // Create new branch
      if (!branch) {
        branch = {
          id,
          label: part,
          ...(isFolder ? { children: [] } : {})
        };

        currentLevel.push(branch);
      }

      if (branch.children) {
        currentLevel = branch.children;
      }
    }
  }

  // Recursively sort tree alphabetically
  const sortTree = (items: TreeViewBaseItem[]) => {
    items.sort((a, b) => a.label.localeCompare(b.label));

    for (const item of items) {
      if (item.children) {
        sortTree(item.children);
      }
    }
  };
  sortTree(tree);
  return tree;
}

/**
 * Find a node in the treeview when given its id
 * @param items
 * @param id
 * @returns
 */
const findNodeById = (
  items: TreeViewBaseItem[],
  id: string
): TreeViewBaseItem | undefined => {
  for (const item of items) {
    if (item.id === id) {
      return item;
    }
    if (item.children) {
      const found = findNodeById(item.children, id);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
};

export default function LocalStorageBrowser(props: { setModalOpen: any }) {
  const [quickScreens, setQuickScreens] = useState<TreeViewBaseItem[]>([]);
  const [selectedKey, setSelectedKey] = useState("");
  const [quickScreenName, setQuickScreenName] = useState("");
  const [selectedIsFolder, setSelectedIsFolder] = useState(false);
  const [expandedScreens, setExpandedScreens] = useState<TreeViewItemId[]>([]);
  const [confirmOverwrite, setConfirmOverwrite] = useState(false);
  const quickScreenStorage = useContext(StorageContext);
  const fileContent = useDisplayInstance(quickScreenStorage.bobDisplayUuid!);
  const { showWarning, showError } = useNotification();

  useEffect(() => {
    const screens = getQuickScreens();
    setQuickScreens(screens);
    // Set list of expanded screens
    getAllScreensWithChildrenItemIds(screens, setExpandedScreens);
  }, []);

  const handleSelection = (_: any, itemId: any) => {
    setSelectedKey(itemId);
    setQuickScreenName(itemId);
    // Check if the item selected is a folder
    const selectedNode = findNodeById(quickScreens, itemId);
    setSelectedIsFolder(!!selectedNode?.children?.length);
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
    // Check if user is trying to save as folder and prevent
    const oldScreen = localStorage.getItem(`quickScreens/${quickScreenName}`);
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

  /**
   * Save the Quick Screen to local storage
   */
  const saveQuickScreen = () => {
    const newScreen = createNewScreen();
    localStorage.setItem(`quickScreens/${quickScreenName}`, newScreen);
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
          expandedItems={expandedScreens}
          onExpandedItemsChange={(_event, _itemIds) =>
            getAllScreensWithChildrenItemIds(quickScreens, setExpandedScreens)
          }
          slots={{ item: QuickScreenTreeItem }}
        />
      </Box>
      <Stack direction="row" spacing={2}>
        <TextField
          label="Quick Screen Name"
          value={quickScreenName}
          onChange={e => {
            const selectedNode = findNodeById(quickScreens, e.target.value);
            setSelectedIsFolder(!!selectedNode?.children?.length);
            setQuickScreenName(e.target.value)
        }}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={quickScreenName === "" || selectedIsFolder}
        >
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
