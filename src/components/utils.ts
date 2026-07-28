import { TreeViewBaseItem, TreeViewItemId } from "@mui/x-tree-view";
import { Dispatch, SetStateAction } from "react";

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
