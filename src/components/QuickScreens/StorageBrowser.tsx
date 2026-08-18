import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { useContext, useMemo, useState } from "react";
import {
  TreeItem2,
  TreeItem2Props,
  TreeViewItemId,
  useTreeItem2
} from "@mui/x-tree-view";
import { Box, Button, IconButton, Stack, TextField } from "@mui/material";
import { useDisplayInstance } from "@diamondlightsource/cs-web-lib";
import { StorageContext } from "./Display";
import { findNodeById } from "../utils";
import { useQuickScreens } from "../../hooks/useQuickScreens";
import OverwriteDialog from "./OverwriteDialog";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import DeleteIcon from "@mui/icons-material/Delete";

interface QuickScreenTreeItemProps extends TreeItem2Props {
  onDelete: (itemId: string) => void;
}

/**
 * Custom Tree Item that lets us change icon
 * @param props
 * @returns
 */
function QuickScreenTreeItem(props: QuickScreenTreeItemProps) {
  const { onDelete, ...treeItemProps } = props;
  const { status } = useTreeItem2({
    itemId: props.itemId,
    children: props.children
  });
  
  const isFolder = status.expandable;

  return (
    <TreeItem2
      {...treeItemProps}
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
      label={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            "& .quick-screen-delete": {
              opacity: 0,
              transition: "opacity 0.15s ease"
            },

            "&:hover .quick-screen-delete": {
              opacity: 1
            }
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            {props.label}
          </Box>

          {!isFolder && (
            <IconButton
              className="quick-screen-delete"
              size="small"
              color="error"
              aria-label={`Delete ${props.label}`}
              onClick={event => {
                // Prevent expansion on click
                event.stopPropagation();
                onDelete(props.itemId);
              }}
              onMouseDown={event => {
                // Prevent expansion on click
                event.stopPropagation();
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      }
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
    requestDelete,
    pendingAction,
    confirmPendingAction,
    cancelPendingAction
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

  const QuickScreenTreeItemWithDelete = (props: TreeItem2Props) => (
  <QuickScreenTreeItem
    {...props}
    onDelete={requestDelete}
  />
);
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
          slots={{ item: QuickScreenTreeItemWithDelete }}
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
        open={pendingAction !== null}
        filename={pendingAction?.name ?? ""}
        onCancel={cancelPendingAction}
        onConfirm={confirmPendingAction}
        isOverwrite={pendingAction?.type === "overwrite"}
      />
    </Stack>
  );
}
