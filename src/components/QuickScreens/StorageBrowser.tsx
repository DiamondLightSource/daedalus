import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { useContext, useMemo, useState } from "react";
import {
  TreeItem2,
  TreeItem2Props,
  TreeViewItemId,
  useTreeItem2
} from "@mui/x-tree-view";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useDisplayInstance } from "@diamondlightsource/cs-web-lib";
import { StorageContext } from "./Display";
import { findNodeById } from "../utils";
import { useQuickScreens } from "../../hooks/useQuickScreens";
import OverwriteDialog from "./OverwriteDialog";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";

/**
 * Custom Tree Item that lets us change icon
 * @param props
 * @returns
 */
function QuickScreenTreeItem(props: TreeItem2Props) {
  const { status } = useTreeItem2({
    itemId: props.itemId,
    children: props.children
  });

  return (
    <TreeItem2
      {...props}
      slots={{
        icon: () =>
          status.expandable ? (
            status.expanded ? (
              <FolderOpenIcon fontSize="small" />
            ) : (
              <FolderIcon fontSize="small" />
            )
          ) : (
            <SubdirectoryArrowRightIcon fontSize="small" />
          )
      }}
    />
  );
}

export default function LocalStorageBrowser(props: { setModalOpen: any }) {
  const storage = useContext(StorageContext);
  const [quickScreenName, setQuickScreenName] = useState("");
  const { displayInstance, addDisplayInstanceByDescription } =
    useDisplayInstance(storage.bobDisplayUuid!);

  const {
    tree,
    expanded,
    setExpanded,
    save,
    load,
    pendingOverwrite,
    confirmOverwrite,
    cancelOverwrite
  } = useQuickScreens({
    displayInstance,
    addDisplayInstanceByDescription,
    onCompleted: () => props.setModalOpen(false)
  });

  const selectedNode = useMemo(
    () => findNodeById(tree, quickScreenName),
    [tree, quickScreenName]
  );

  const selectedIsFolder = !!selectedNode?.children?.length;

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          height: 300
        }}
      >
        <RichTreeView
          items={tree}
          onSelectedItemsChange={(_, id) => setQuickScreenName(id as string)}
          selectedItems={quickScreenName}
          expandedItems={expanded}
          onExpandedItemsChange={(_, ids) =>
            setExpanded(ids as TreeViewItemId[])
          }
          slots={{ item: QuickScreenTreeItem }}
        />
      </Box>
      <Stack direction="row" spacing={2}>
        <TextField
          label="Quick Screen Name"
          value={quickScreenName}
          onChange={e => setQuickScreenName(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={() =>
            storage.browsingMode === "Save"
              ? save(quickScreenName)
              : load(quickScreenName)
          }
          disabled={!quickScreenName || selectedIsFolder}
        >
          {storage.browsingMode}
        </Button>
      </Stack>
      <OverwriteDialog
        open={pendingOverwrite !== null}
        filename={pendingOverwrite ?? ""}
        onCancel={cancelOverwrite}
        onConfirm={confirmOverwrite}
      />
    </Stack>
  );
}
