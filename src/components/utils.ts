import { TreeViewBaseItem, TreeViewItemId } from "@mui/x-tree-view";
import { Dispatch, SetStateAction } from "react";

/**
 * Sets the list of all tree items with children that should be expanded
 * @param screenTree
 * @param setExpandedScreens
 */
export const getAllScreensWithChildrenItemIds = (
  screenTree: TreeViewBaseItem[],
  setExpandedScreens: Dispatch<SetStateAction<TreeViewItemId[]>>
) => {
  const screenIds: TreeViewItemId[] = [];

  const registerScreenId = (item: TreeViewBaseItem): void => {
    if (item.children?.length) {
      screenIds.push(item.id);
      (item.children as TreeViewBaseItem[]).forEach(registerScreenId);
    }
  };

  for (const screen of screenTree) {
    registerScreenId(screen);
  }
  setExpandedScreens(screenIds);
};

/**
 * Find a node in the treeview when given its id
 * @param items treeviewitem list
 * @param id string to match
 * @returns a TreeViewBaseItem of the match, or undefined if none
 */
export const findNodeById = (
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
