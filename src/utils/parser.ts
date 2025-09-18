import { TreeViewBaseItem } from "@mui/x-tree-view";
import { FileIDs } from "../store";

/**
 * Parse the parent file and all child files into a
 * mui TreeViewBaseItem
 * @param filepath toplevel screen that links others together
 */
export async function parseScreenTree(
  filepath: string
): Promise<[TreeViewBaseItem[], FileIDs, string]> {
  const response = await fetch(filepath);
  const json = await response.json();
  const topLevelScreen = json.file.split(".bob")[0].split("/").pop()!;

  let parentScreen: TreeViewBaseItem = {
    id: topLevelScreen,
    label: topLevelScreen,
    children: []
  };

  const [children, ids] = await parseChildren(
    json.children, 
    json.file,
    [],
    "",
    {},
    json.macros
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
 * @param screenIDs array of all file IDs and their filepaths and macros
 * @returns 
 */
async function parseChildren(
  fileList: any[], 
  filepath: string, 
  screen: TreeViewBaseItem[],
  parentId: string,
  screenIDs: FileIDs,
  macros: {[key: string]: string}
  ): Promise<[TreeViewBaseItem[], FileIDs]> {

  const id = `${parentId}${parentId === "" ? "" : "+"}${filepath.split(".bob")[0].split("/").pop()!}`;
  screenIDs[id] = {file: filepath};
  if (macros) screenIDs[id].macros = [macros];
  
  for (const child of fileList) {
    const fileLabel: string = child.file.split(".bob")[0].split("/").pop()!;
    const fileId = `${id}+${fileLabel}`;
    let newScreen: TreeViewBaseItem = {id: fileId, label: fileLabel};
    // Check if this has been parsed already
    if (child.duplicate) {
      if (child.macros) {
        for (const value of Object.values(screenIDs)) {
          if (value.file === filepath) {
            if (value.macros) {
              value.macros.push(child.macros);
            } else {
              value.macros = [child.macros];
            }
            
          };
        }
      }
    } else {
      // If not a duplicate, check for children
      if (child.children) {
        // If it has children, loop over recursively
        const [children, ids] = await parseChildren(
          child.children, 
          child.file, 
          [], 
          id, 
          screenIDs,
          child.macros
        )
        screenIDs = ids;
        newScreen.children = children;
      } else {
        // If it doesn't have children, add to the array
        screenIDs[fileId] = {file: child.file};
        if (child.macros) screenIDs[fileId].macros = [child.macros];
      }
      screen.push(newScreen);
    }
  }
  return [screen, screenIDs]
}