import { TreeViewItemId } from "@mui/x-tree-view";
import {
  ScreenTreeViewBaseItem,
  selectFileMetadataByFilePathAndMacros
} from "../utils/parser";
import {
  buildUrl,
  FileContextType,
  FileDescription
} from "@diamondlightsource/cs-web-lib";
import { BeamlineState } from "../store";

export const FILE_DESCRIPTION_SEARCH_PARAMETER_NAME = "file_description";
export const MACROS_SEARCH_PARAMETER_NAME = "macros";

export const addTabCallbackAction =
  (
    beamlines: BeamlineState,
    currentBeamline: string,
    windowLocation: Location
  ): FileContextType["addTab"] =>
  (fileLocation: string, tabName: string, fileDesc: FileDescription) => {
    void fileLocation; // unused, but required by the function interface.
    void tabName; // unused, but required by the function interface.

    // try and find a matching file entry in the JSON map
    const displayedPath = fileDesc?.path?.replace(
      beamlines[currentBeamline].host!,
      ""
    );

    const matchingFileMetadata = selectFileMetadataByFilePathAndMacros(
      beamlines[currentBeamline].filePathIds,
      displayedPath,
      fileDesc?.macros
    );

    // Build the URL for the new tab
    let newURL = new URL(windowLocation.origin);
    if (matchingFileMetadata?.urlId) {
      // we have a file mapping
      newURL.pathname = buildUrl(
        "",
        "synoptic",
        currentBeamline,
        matchingFileMetadata?.urlId
      );

      if (fileDesc?.macros) {
        newURL.searchParams.append(
          MACROS_SEARCH_PARAMETER_NAME,
          JSON.stringify(fileDesc?.macros)
        );
      }
    } else {
      // No file mapping
      newURL = new URL(windowLocation.href);
      newURL.searchParams.append(
        FILE_DESCRIPTION_SEARCH_PARAMETER_NAME,
        JSON.stringify(fileDesc)
      );
    }
    window.open(newURL, "_blank");
  };

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
