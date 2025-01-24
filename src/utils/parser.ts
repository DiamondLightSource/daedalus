import { TreeViewBaseItem } from "@mui/x-tree-view/models";
import { xml2js } from "xml-js";

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
    screen: TreeViewBaseItem[],
    parentDir: string
): Promise<TreeViewBaseItem[]> {
    // Check file is a valid .bob, otherwise abort
    const fileExt = filepath.split(".").at(-1);
    if (fileExt !== "bob") return screen;
    console.log(filepath);

    const fullFilepath = `${parentDir}/${filepath}`;
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
        widgets.forEach(async (widget: any) => {
            const actions = widget.actions;
            // If no action on widget, discard it
            if (actions === undefined) return;
            // Check if type is open_display
            if (actions.action._attributes.type === "open_display") {
                // Parse child file recursively
                const fileName: string = actions.action.file._text;
                const fileLabel: string = (fileName.split(".bob")[0]).split("/").pop()!;
                screen.push({ id: fileName, label: fileLabel, children: await parseChildren(fileName, [], parentDir) })
            }
        });
    } catch (error) {
        console.error(`Failed to load file ${fullFilepath}: ${error}`)
    }
    return screen;
}

/**
 * Parse the parent file and all child files into a
 * mui TreeViewBaseItem
 * @param filepath toplevel screen that links others together
 */
export async function parseScreenTree(filepath: string) {
    let parentScreen: TreeViewBaseItem = { id: filepath, label: filepath.split(".bob")[0], children: [] };
    const parentDir = filepath.substr(0, filepath.lastIndexOf("/"));
    const parentFile = filepath.substr(filepath.lastIndexOf("/") + 1);

    const screenTree = await parseChildren(parentFile, parentScreen.children!, parentDir)
    return screenTree
}