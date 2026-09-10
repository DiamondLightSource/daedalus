import { useCallback, useContext, useEffect, useState } from "react";
import { TreeViewBaseItem, TreeViewItemId } from "@mui/x-tree-view";
import { FileContext, useNotification } from "@diamondlightsource/cs-web-lib";
import { getAllScreensWithChildrenItemIds } from "../components/utils";
import {
  executeCloseQuickScreen,
  executeOpenQuickScreen
} from "../utils/csWebLibActions";

interface UseQuickScreensProps {
  displayInstance?: any;
  addDisplayInstanceByDescription: (
    file: string,
    macros: any,
    description: any
  ) => void;
  onCompleted: () => void;
}

type PendingAction =
  | { type: "overwrite"; name: string }
  | { type: "delete"; name: string }
  | null;

/**
 * Hook for loading and parsing Quick Screens from the local storage tree
 * @param displayInstance
 * @param addDisplayInstanceByDescription
 * @param onCompleted
 * @returns
 */
export function useQuickScreens({
  displayInstance,
  addDisplayInstanceByDescription,
  onCompleted
}: UseQuickScreensProps) {
  const fileContext = useContext(FileContext);
  const { showWarning, showError } = useNotification();
  const [tree, setTree] = useState<TreeViewBaseItem[]>([]);
  const [expanded, setExpanded] = useState<TreeViewItemId[]>([]);
  // Name of the file we are currently overwriting
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  // Reloads all files in the tree
  const refreshTree = useCallback(() => {
    const screens = getQuickScreens();
    setTree(screens);
    const allScreens = getAllScreensWithChildrenItemIds(screens);
    setExpanded(allScreens);
  }, []);

  useEffect(() => {
    refreshTree();
  }, [refreshTree]);

  // Creates the Quick Screen to be saved as a string
  const createScreen = useCallback(() => {
    return JSON.stringify({
      macros: displayInstance?.macros ?? {},
      description: displayInstance?.description
    });
  }, [displayInstance]);

  // Saves the Quick Screen to local storage
  const save = useCallback(
    (name: string) => {
      if (!name.trim()) {
        showWarning("Unable to save: no Quick Screen name given.");
        return;
      }

      if (!displayInstance) {
        showError("Unable to save: no Quick Screen content found.");
        return;
      }

      const existing = localStorage.getItem(`quickScreens/${name}`);
      const newContent = createScreen();
      if (existing && existing !== newContent) {
        setPendingAction({
          type: "overwrite",
          name
        });
        return;
      }
      localStorage.setItem(`quickScreens/${name}`, newContent);
      refreshTree();
      onCompleted();
    },
    [
      displayInstance,
      createScreen,
      refreshTree,
      showError,
      showWarning,
      onCompleted
    ]
  );

  // Loading a Quick Screen from local storage
  const load = useCallback(
    (name: string) => {
      const stored = localStorage.getItem(`quickScreens/${name}`);
      if (!stored) {
        showWarning("Unable to load: no Quick Screen found.");
        return;
      }

      const screen = JSON.parse(stored);
      addDisplayInstanceByDescription(name, screen.macros, screen.description);
      executeOpenQuickScreen(
        name,
        "quickScreen",
        structuredClone(screen.macros) ?? {},
        fileContext,
        ""
      );
    },
    [fileContext, showWarning]
  );

  const requestDelete = useCallback((name: string) => {
    setPendingAction({
      type: "delete",
      name
    });
  }, []);

  // Called when the user wants to do the action
  const confirmPendingAction = useCallback(() => {
    if (!pendingAction) return;

    if (pendingAction.type === "overwrite") {
      // Overwrite the current file
      localStorage.setItem(
        `quickScreens/${pendingAction.name}`,
        createScreen()
      );
      onCompleted();
    } else {
      // Delete the current file
      const stored = localStorage.getItem(`quickScreens/${pendingAction.name}`);
      if (stored) {
        const screen = JSON.parse(stored);
        executeCloseQuickScreen(
          pendingAction.name,
          "quickScreen",
          screen.macros,
          fileContext
        );
        localStorage.removeItem(`quickScreens/${pendingAction.name}`);
      }
    }

    setPendingAction(null);
    refreshTree();
  }, [pendingAction, createScreen, onCompleted, refreshTree]);

  // Called when the user cancels the action
  const cancelPendingAction = useCallback(() => {
    setPendingAction(null);
  }, []);

  return {
    tree,
    expanded,
    setExpanded,
    save,
    load,
    requestDelete,
    pendingAction,
    confirmPendingAction,
    cancelPendingAction
  };
}

/**
 * Gets all Quick Screens currently in local storage and
 * converts them to Tree View Items
 * @returns
 */
export function getQuickScreens(): TreeViewBaseItem[] {
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
