import { TreeViewItemId } from "@mui/x-tree-view";
import { ScreenTreeViewBaseItem } from "../utils/parser";

/**
 * Sets the list of all tree items with children that should be expanded
 * @param screenTree
 */
export const getAllScreensWithChildrenItemIds = (
  screenTree: ScreenTreeViewBaseItem[]
): TreeViewItemId[] => {
  const screenIds: TreeViewItemId[] = [];

  const registerScreenId = (item: ScreenTreeViewBaseItem): void => {
    if (item.children?.length) {
      screenIds.push(item.id);
      (item.children as ScreenTreeViewBaseItem[]).forEach(registerScreenId);
    }
  };

  for (const screen of screenTree) {
    registerScreenId(screen);
  }
  return screenIds;
};

/**
 * Find a node in the treeview when given its id
 * @param items treeviewitem list
 * @param id string to match
 * @returns a TreeViewBaseItem of the match, or undefined if none
 */
export const findNodeById = (
  items: ScreenTreeViewBaseItem[],
  id: string
): ScreenTreeViewBaseItem | undefined => {
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
