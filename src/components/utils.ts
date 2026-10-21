import { TreeViewItemId } from "@mui/x-tree-view";
import { ScreenTreeViewBaseItem } from "../utils/parser";

/**
 * Sets the list of all tree items with children that should be expanded
 * @param screenTree
 */
export const getTopLevelChildIds = (
  screenTree: ScreenTreeViewBaseItem[]
): TreeViewItemId[] => {
  const screenIds: TreeViewItemId[] = [];

  for (const screen of screenTree) screenIds.push(screen.id);
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

/**
 * Returns a list of all parents of a given ID
 * @param items
 * @param targetId
 * @param ancestors
 * @returns
 */
export const getParentIds = (
  items: ScreenTreeViewBaseItem[],
  targetId: string,
  parents: string[] = []
): string[] => {
  for (const item of items) {
    if (item.id === targetId) return parents;

    if (item.children?.length) {
      const result = getParentIds(
        item.children as ScreenTreeViewBaseItem[],
        targetId,
        [...parents, item.id]
      );
      if (
        result.length > 0 ||
        item.children.some(child => child.id === targetId)
      )
        return result;
    }
  }
  return [];
};
