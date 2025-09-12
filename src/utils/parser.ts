import { xml2js } from "xml-js";
import { FileIDs } from "../store";
import { ScreenTreeViewBaseItem } from "./helper";

export interface XmlDescription {
  _attributes: { [key: string]: string };
  x?: { _text: string };
  y?: { _text: string };
  height?: { _text: string };
  width?: { _text: string };
  widget?: XmlDescription;
  [key: string]: any;
}

/**
 * Recursive asynchronous function that loops over
 * open display actions in files to find all children.
 * Duplicates will be removed, and only locatable at the fewest
 * levels deep - TO DO?
 * @param filepath path to file to parse, without parentdirectory
 * @param screen the treeviewbaseitem we parse the screen tree into
 * @param parentDir the parent directory to fetch files from
 * @returns
 */
async function parseChildren(
  filepath: string,
  screen: ScreenTreeViewBaseItem[],
  parentDir: string,
  screenIDs: FileIDs,
  parentId: string
): Promise<[ScreenTreeViewBaseItem[], FileIDs]> {
  // Check file is a valid .bob, otherwise abort
  const fileExt = filepath.split(".").at(-1);
  if (fileExt !== "bob") return [screen, screenIDs];

  const fullFilepath = `${parentDir}/${filepath}`;
  const id = `${parentId}${parentId === "" ? "" : "-"}${filepath.split(".bob")[0].split("/").pop()!}`;
  screenIDs[id] = fullFilepath;

  // Otherwise fetch file
  try {
    const filePromise = await fetch(fullFilepath);
    const contents = await filePromise.text();

    // Returned if file not found
    if (contents.startsWith("<!DOCTYPE html>")) {
      throw new Error("File not found");
    }

    // Convert it to a "compact format"
    const compactJSON = xml2js(contents, {
      compact: true
    }) as XmlDescription;
    compactJSON.display._attributes.type = "display";

    // Iterate over all widgets to find child files
    const widgets = compactJSON.display.widget;
    for (const widget of widgets) {
      const actions = widget.actions;
      // If no action on widget, discard it
      if (actions !== undefined) {
        // Check if type is open_display
        if (actions.action._attributes.type === "open_display") {
          // Parse child file recursively
          const fileName: string = actions.action.file._text;
          const fileLabel: string = fileName.split(".bob")[0].split("/").pop()!;
          const fileId = `${id}-${fileLabel}`;
          const [children, ids] = await parseChildren(
            fileName,
            [],
            parentDir,
            screenIDs,
            id
          );
          screenIDs = ids;
          const isUnique = checkDuplicateFilePath(
            screenIDs,
            `${parentDir}/${fileName}`
          );
          if (isUnique)
            screen.push({ id: fileId, label: fileLabel, children: children, macros: [] });
        }
      }
    }
  } catch (error) {
    console.error(`Failed to load file ${fullFilepath}: ${error}`);
  }
  return [screen, screenIDs];
}

/**
 * Check if a given filepath already corresponds to a unique id
 */
function checkDuplicateFilePath(screenIDs: FileIDs, filepath: string) {
  let isFilepathUnique: boolean;
  const uniqueFilepaths = Object.values(screenIDs);
  isFilepathUnique = uniqueFilepaths.includes(filepath) ? true : false;
  return isFilepathUnique;
}

/**
 * Parse the parent file and all child files into a
 * mui TreeViewBaseItem
 * @param filepath toplevel screen that links others together
 */
export async function parseScreenTree(
  filepath: string
): Promise<[ScreenTreeViewBaseItem[], FileIDs]> {
  let topLevelScreen = "";
  let children: ScreenTreeViewBaseItem[];
  let ids: FileIDs;
  let parentFile: string;
  let fileList = []
  
  if (filepath.includes(".json")) {
    const response = await fetch(filepath);
    const json = await response.json();
    parentFile = json.file;
    fileList = json.children;
    topLevelScreen = parentFile.split(".bob")[0].split("/").pop()!
  } else {
    topLevelScreen = filepath.split(".bob")[0].split("/").pop()!;
    parentFile = filepath.substr(filepath.lastIndexOf("/") + 1);
  }

  const parentDir = filepath.substr(0, filepath.lastIndexOf("/"));
  let parentScreen: ScreenTreeViewBaseItem = {
    id: topLevelScreen,
    label: topLevelScreen,
    children: [],
    macros: []
  };

  if (filepath.includes(".json")) {
    [children, ids] = await parseJsonTree(
      fileList, 
      parentFile,
      parentScreen.children,
      "",
      {}
    );
  } else {
    [children, ids] = await parseChildren(
      parentFile,
      parentScreen.children!,
      parentDir,
      {},
      ""
    );
  }

  parentScreen.children = children;
  return [[parentScreen], ids];
}

/**
 * Parse JSON object to find all files and return a TreeViewBaseItem
 * @param children array of objects depicting child files of current file
 * @param filepath current filepath as a string
 * @param screen TreeViewBaseItem holding the currently parsed tree items
 * @param parentId string ID of the parent file
 * @param screenIDs array of all file IDs and their filepaths
 * @returns 
 */
async function parseJsonTree(
  fileList: any[], 
  filepath: string, 
  screen: ScreenTreeViewBaseItem[],
  parentId: string,
  screenIDs: FileIDs
  ): Promise<[ScreenTreeViewBaseItem[], FileIDs]> {

  const id = `${parentId}${parentId === "" ? "" : "-"}${filepath.split(".bob")[0].split("/").pop()!}`;
  screenIDs[id] = filepath;
  
  for (const child of fileList) {
    const fileLabel: string = child.file.split(".bob")[0].split("/").pop()!;
    const fileId = `${id}-${fileLabel}`;
    // Check if this has been parsed already
    if (child.note && child.note.includes("Already visited (cycle detected)")) {
      let duplicateId: string
      // Screen has already been parsed, check for macros
      if (child.macros) {
        for (const [key, value] of Object.entries(screenIDs)) {
          if (value === filepath) duplicateId = key;
        }
        const idx = screen.findIndex(item => item.id === duplicateId)
        // TO DO - add macros to existing ID
      }
      break;
    }
    if (child.children) {
      // If it has children, loop over recursively
      const [children, ids] = await parseJsonTree(
        child.children, 
        child.file, 
        [], 
        id, 
        screenIDs)
      screenIDs = ids;
      screen.push({ id: fileId, label: fileLabel, children: children, macros: [] });
    } else {
      screen.push({ id: fileId, label: fileLabel, children: [], macros: [] });
    }
  }
  return [screen, screenIDs]
}