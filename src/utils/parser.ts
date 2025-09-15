import { FileIDs } from "../store";
import { ScreenTreeViewBaseItem } from "./helper";

/**
 * Parse the parent file and all child files into a
 * mui TreeViewBaseItem
 * @param filepath toplevel screen that links others together
 */
export async function parseScreenTree(
  filepath: string
): Promise<[ScreenTreeViewBaseItem[], FileIDs, string]> {
  const response = await fetch(filepath);
  const json = await response.json();
  const topLevelScreen = json.file.split(".bob")[0].split("/").pop()!;

  let parentScreen: ScreenTreeViewBaseItem = {
    id: topLevelScreen,
    label: topLevelScreen,
    children: [],
    macros: []
  };

  const [children, ids] = await parseChildren(
    json.children, 
    json.file,
    parentScreen.children,
    "",
    {}
  );
  parentScreen.children = children;
  return [[parentScreen], ids, json.file];
}

/**
 * Recursive synchronous function that parses JSON object to find all files and 
 * return a TreeViewBaseItem of all screens
 * @param children array of objects depicting child files of current file
 * @param filepath current filepath as a string
 * @param screen TreeViewBaseItem holding the currently parsed tree items
 * @param parentId string ID of the parent file
 * @param screenIDs array of all file IDs and their filepaths
 * @returns 
 */
async function parseChildren(
  fileList: any[], 
  filepath: string, 
  screen: ScreenTreeViewBaseItem[],
  parentId: string,
  screenIDs: FileIDs
  ): Promise<[ScreenTreeViewBaseItem[], FileIDs]> {

  const id = `${parentId}${parentId === "" ? "" : "+"}${filepath.split(".bob")[0].split("/").pop()!}`;
  screenIDs[id] = filepath;
  
  for (const child of fileList) {
    const fileLabel: string = child.file.split(".bob")[0].split("/").pop()!;
    const fileId = `${id}+${fileLabel}`;
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
      const [children, ids] = await parseChildren(
        child.children, 
        child.file, 
        [], 
        id, 
        screenIDs)
      screenIDs = ids;
      screen.push({ id: fileId, label: fileLabel, children: children, macros: [] });
    } else {
      screenIDs[fileId] = child.file;
      screen.push({ id: fileId, label: fileLabel, children: [], macros: [] });
    }
  }
  return [screen, screenIDs]
}