import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  TreeItem2,
  TreeItem2Props,
  TreeViewItemId,
  useTreeItem2
} from "@mui/x-tree-view";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { BeamlineTreeStateContext } from "../../App";
import { Stack, Box, TextField, Button } from "@mui/material";
import { findNodeById, getAllScreensWithChildrenItemIds } from "../utils";
import { buildUrl, FileContext, useNotification } from "@diamondlightsource/cs-web-lib";
import { LOAD_SCREENS } from "../../store";
import { parseScreenTree, ScreenTreeViewBaseItem } from "../../utils/parser";
import { useDispatch } from "react-redux";
import { executeOpenPageActionWithFileGuid } from "../../utils/csWebLibActions";


/**
 * Custom Tree Item that lets us change icon
 * @param props
 * @returns
 */
function QuickScreenTreeItem(props: TreeItem2Props) {
  const { state } = useContext(BeamlineTreeStateContext);
  const { status } = useTreeItem2({
    itemId: props.itemId,
    children: props.children
  });

  const isBeamline = props.itemId in state.beamlines;
  return (
    <TreeItem2
      {...props}
      slots={
        isBeamline
          ? {
              icon: () =>
                status.expanded ? (
                  <FolderOpenIcon fontSize="small" />
                ) : (
                  <FolderIcon fontSize="small" />
                )
            }
          : undefined
      }
    />
  );
}

export default function BobFileBrowser() {
  const dispatch = useDispatch();
  const fileContext = useContext(FileContext);
  const { state } = useContext(BeamlineTreeStateContext);
  const { showWarning } = useNotification();
  const [bobFileTree, setBobFileTree] = useState<ScreenTreeViewBaseItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const [selectedBeamline, setSelectedBeamline] = useState<string | undefined>("");
  const [expanded, setExpanded] = useState<TreeViewItemId[]>([]);

  console.log(state);
  const isBeamlineSelected =
    !!selectedItemId && selectedItemId in state.beamlines;

  const handleClick = () => {
    if (!selectedBeamline) return;
    // Get current beamline
    const beamlineState = state.beamlines[selectedBeamline];
    executeOpenPageActionWithFileGuid(
      beamlineState,
      selectedItemId,
      selectedBeamline,
      fileContext,
      "bobQuickScreen"
    );
  };

  const handleExpandedItemsChange = (
    _: React.SyntheticEvent,
    ids: TreeViewItemId[]
  ) => {
    const expandedIds = [...ids];
    for (const beamline of bobFileTree) {
      if (ids.includes(beamline.id)) {
        expandedIds.push(
          ...getAllScreensWithChildrenItemIds(
            beamline.children as ScreenTreeViewBaseItem[]
          )
        );
      }
    }

    setExpanded([...new Set(expandedIds)]);
  };

  const loadScreens = useCallback(async () => {
    const tree: ScreenTreeViewBaseItem[] = [];
    const newBeamlines = { ...state.beamlines };
    for (const [newBeamline, item] of Object.entries(newBeamlines)) {
      try {
        console.log(newBeamline)
        const [tree, fileIDs, firstFile] = await parseScreenTree(
          buildUrl(item.host, item.entryPoint), newBeamline
        );
        item.screenTree = tree;
        item.filePathIds = fileIDs;
        item.topLevelScreen = firstFile;
        item.loaded = true;
      } catch (e) {
        showWarning(
          `Unable to process the beamline: ${newBeamline}. JsonMap file is not found where expected: ${item.host + item.entryPoint}.`
        );
        console.error(
          `Unable to process JSON map for ${newBeamline}. Check file is available at ${item.host + item.entryPoint} and reload.`
        );
        console.error(e);
      }
    }
    dispatch({
      type: LOAD_SCREENS,
      payload: {
        beamlines: newBeamlines,
        loadBeamline: undefined,
        loadScreen: undefined
      }
    });
    // Now add to tree
    for (const [beamline, beamlineState] of Object.entries(newBeamlines)) {
      tree.push({
        id: beamline,
        label: beamline,
        children: beamlineState.screenTree,
      });
    }
    setBobFileTree(tree);
  }, []);

  useEffect(() => {
    // On change of beamlines, reload
    loadScreens();
  }, [state.beamlines]);

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          height: 300,
          overflow: "scroll"
        }}
      >
        <RichTreeView
          items={bobFileTree}
          onSelectedItemsChange={(_, id) => {
            const itemId = id as string;
            const item = findNodeById(bobFileTree, itemId);
            setSelectedItemId(itemId);
            setSelectedLabel(item?.label?.toString() ?? "");
            setSelectedBeamline(item?.beamline);
          }}
          selectedItems={selectedItemId}
          expandedItems={expanded}
          onExpandedItemsChange={handleExpandedItemsChange}
          slots={{ item: QuickScreenTreeItem }}
        />
      </Box>
      <Stack direction="row" spacing={2}>
        <TextField
          label=".bob File Name"
          value={selectedLabel}
          onChange={e => setSelectedLabel(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          disabled={isBeamlineSelected || !selectedItemId}
          onClick={handleClick}
        >
          Load
        </Button>
      </Stack>
    </Stack>
  );
}
