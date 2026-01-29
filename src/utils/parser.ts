import { TreeViewBaseItem } from "@mui/x-tree-view";
import { FileIDs, FileMetadata, MacroMap, Macros } from "../store";
import {
  CsWebLibHttpResponseError,
  resolveMacros,
  httpRequest
} from "@diamondlightsource/cs-web-lib";

/**
 * Select a file metadata record from a set of records, using the file path and the macro set
 * to identify the record.
 * @param allFileMetadata File metadata to be searched
 * @param targetFilePath Path of the file to find
 * @param targetMacros The set of macros to match
 * @returns A file metadata record or undefined if no match is found
 */
export const selectFileMetadataByFilePathAndMacros = (
  allFileMetadata: FileIDs,
  targetFilePath: string,
  targetMacros?: MacroMap
): FileMetadata | undefined => {
  // remove macros injected by cs-web-lib
  const filteredMacros = Object.fromEntries(
    Object.entries(targetMacros ?? {}).filter(
      ([key]) => key !== "LCID" && key !== "DID"
    )
  );

  const filteredMacrosKeys = Object.keys(filteredMacros);

  return Object.values(allFileMetadata)
    .filter(fileMetadata => fileMetadata.file === targetFilePath)
    .find(fileMetadata => {
      // Check for matching macros
      if (!fileMetadata?.macros || fileMetadata?.macros.length === 0) {
        return filteredMacrosKeys.length === 0;
      }
      return (fileMetadata?.macros ?? []).some(metadataMacroMap => {
        const macroSetKeys = Object.keys(metadataMacroMap);
        // Check has identical set of keys
        if (macroSetKeys.length !== filteredMacrosKeys.length) return false;
        if (macroSetKeys.length === 0) return true;
        if (!macroSetKeys.every(key => filteredMacrosKeys.includes(key)))
          return false;
        // Check has equal values for each key
        return macroSetKeys.every(
          key => metadataMacroMap[key] === filteredMacros[key]
        );
      });
    });
};

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

    // Substitute macros in fileMap
    Object.keys(fileMap).forEach(key => {
      const entry = fileMap[key];
      
      if (entry.macros && entry.macros.length > 0 && entry.file) {
        // Use the first macro set
        const macros = entry.macros[0];

        // Use resolveMacros
        entry.file = resolveMacros(entry.file, macros);
      }
    });

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
    if (sibling.macros) {

      // Match against unresolved filename
      const matchingFileKey = Object.keys(fileMap).find(
        key => fileMap[key].file === sibling.file
      );
      if (matchingFileKey) {

        if (matchingFileKey && sibling.duplicate) {
          // Attach macros
          fileMap[matchingFileKey].macros = fileMap[matchingFileKey].macros
            ? [...fileMap[matchingFileKey].macros, sibling.macros]
            : [sibling.macros];
        }
      }
    }

    RecursiveAppendDuplicateFileMacros(sibling?.children, fileMap);
  }
};

/**
 * Builds the ID to display in the URL, based on the file name
 * and/or a given display name
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