import { TreeViewBaseItem } from "@mui/x-tree-view";
import { FileIDs, Macros } from "../store";
import {
  CsWebLibHttpResponseError,
  httpRequest
} from "@diamondlightsource/cs-web-lib";

/**
 * Parse the parent file and all child files into a
 * mui TreeViewBaseItem
 * @param filepath toplevel screen that links others together
 */
export async function parseScreenTree(
  filepath: string
): Promise<[TreeViewBaseItem[], FileIDs, string]> {
  try {
    const response = await httpRequest(filepath);
    const json = await response.json();

    const { urlId, fileLabel: topLevelScreen } = buildUrlId(
      json.file,
      "",
      json.displayName
    );

    // Process the child items
    const { fileMap, treeViewItems } = RecursiveTreeViewBuilder(
      json.children,
      topLevelScreen
    );

    // Using a GUID guarantees that each TreeeViewItem has a unique id.
    const guid = crypto.randomUUID();

    // Append the top level screen to the fileMap
    fileMap[guid] = {
      file: json?.file,
      urlId: urlId,
      macros: json.macros ? [json.macros as Macros] : [],
      exists: json?.exists
    };

    // Now we have the initial fileMap with unique file entries, update fileMap with macros for duplicate files.
    RecursiveAppendDuplicateFileMacros(json.children, fileMap);

    const parentScreen: TreeViewBaseItem = {
      id: guid,
      label: topLevelScreen,
      children: treeViewItems
    };

    return [[parentScreen], fileMap, json.file];
  } catch (e) {
    if (e instanceof CsWebLibHttpResponseError) {
      console.error(`Failed to fetch the file: ${filepath}`);
    } else {
      console.error(`Failed to parse the file: ${filepath}`);
    }
    console.error(e);
    throw e;
  }
}

/**
 * Recursive function that parses an array of JSON objects from an beamline JsonMap.json file to find all non-duplicate files and
 * return a TreeViewBaseItem of all screens
 * @param jsonSiblings Array of JSON objects; each object contains the data for a screen file.
 * @param idPrefix Prefix for the ID.
 * @returns a file map and array of TreeViewItems for all sibling screens and all their descendants.
 */
export const RecursiveTreeViewBuilder = (
  jsonSiblings: any[],
  idPrefix: string
): { fileMap: FileIDs; treeViewItems: TreeViewBaseItem[] } => {
  let fileMap: FileIDs = {};
  const treeViewItems: TreeViewBaseItem[] = [];

  if (!jsonSiblings) {
    return { fileMap, treeViewItems };
  }

  for (const sibling of jsonSiblings) {
    const { urlId, fileLabel } = buildUrlId(
      sibling.file,
      idPrefix,
      sibling.displayName
    );
    const guid = crypto.randomUUID();

    const treeViewItem: TreeViewBaseItem = {
      id: guid,
      label: fileLabel,
      children: []
    };

    if (!sibling.duplicate) {
      fileMap[guid] = {
        file: sibling.file,
        exists: sibling?.exists,
        urlId: urlId,
        macros: sibling.macros ? [sibling.macros] : []
      };

      // If not a duplicate, check for children
      if (sibling.children) {
        // If it has children make recursive call
        const { fileMap: childFileMap, treeViewItems: childTreeViewItems } =
          RecursiveTreeViewBuilder(sibling.children, urlId);

        fileMap = { ...fileMap, ...childFileMap };
        treeViewItem.children = childTreeViewItems;
      }

      treeViewItems.push(treeViewItem);
    }
  }

  return { fileMap, treeViewItems };
};

/**
 * Recursive function that finds files flagged as duplicates with macros and appends these macros to the filemap entry for the duplicate.
 * @param jsonSiblings Array of JSON objects; each object contains the data for a screen file.
 * @param fileMap Prepopulated map of file metadata, this is modified in place.
 */
export const RecursiveAppendDuplicateFileMacros = (
  jsonSiblings: any[],
  fileMap: FileIDs
) => {
  if (!jsonSiblings) {
    return;
  }

  for (const sibling of jsonSiblings) {
    if (sibling.duplicate && sibling.macros) {
      const matchingFileKey = Object.keys(fileMap).find(
        key => fileMap[key].file === sibling.file
      );
      if (matchingFileKey) {
        fileMap[matchingFileKey].macros = fileMap[matchingFileKey].macros
          ? [...fileMap[matchingFileKey].macros, sibling.macros]
          : [sibling.macros];
      }
    }

    RecursiveAppendDuplicateFileMacros(sibling?.children, fileMap);
  }
};

/**
 *
 * @param filepath string path of bob file
 * @param idPrefix string prefix of all parent file IDs
 * @param displayName string alternate name of file to display
 * @returns string ID of url, label to display for current file
 */
export const buildUrlId = (
  filepath: string,
  idPrefix: string,
  displayName?: string
) => {
  const splitFilePath = filepath.split(".bob")[0].split("/");
  let fileLabel: string = displayName || splitFilePath.pop()!;
  if (fileLabel === "index") {
    const parentDir = splitFilePath.pop();
    if (parentDir) {
      fileLabel = `${parentDir}__${fileLabel}`;
    }
  }
  const urlId = `${idPrefix}${idPrefix === "" ? "" : "+"}${fileLabel}`;
  return { urlId, fileLabel };
};
