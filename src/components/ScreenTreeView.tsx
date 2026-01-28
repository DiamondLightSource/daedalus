import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { useContext, useEffect, useMemo, useState } from "react";
import { TreeViewBaseItem, TreeViewItemId } from "@mui/x-tree-view";
import { FileContext } from "@diamondlightsource/cs-web-lib";
import { BeamlineTreeStateContext } from "../App";
import { MenuContext } from "../routes/SynopticPage";
import { executeOpenPageActionWithFileGuid } from "../utils/csWebLibActions";
import { FileIDs } from "../store";

export default function ScreenTreeView() {
  const { state } = useContext(BeamlineTreeStateContext);
  const { menuOpen } = useContext(MenuContext);
  const fileContext = useContext(FileContext);
  const [expandedScreens, setExpandedScreens] = useState<string[]>([]);

  const handleExpandedScreensChange = (screenIds: string[]) => {
    setExpandedScreens(screenIds);
  };

  const handleClick = (itemId: string) => {
    const selectedBeamlineId = state.currentBeamline;
    const beamlineState = state.beamlines[selectedBeamlineId];

    executeOpenPageActionWithFileGuid(
      beamlineState,
      itemId,
      selectedBeamlineId,
      fileContext
    );
  };

  const currentScreenTree: TreeViewBaseItem[] = useMemo(() => {
    const currentBeamline = state.beamlines[state.currentBeamline];
    return currentBeamline?.screenTree ?? [];
  }, [state.currentBeamline, state.beamlines]);

  const currentFileMetadata: FileIDs = useMemo(() => {
    const currentBeamline = state.beamlines[state.currentBeamline];
    return currentBeamline?.filePathIds ?? [];
  }, [state.currentBeamline, state.beamlines]);

  // When beamline is updated, trigger refresh of expanded screens to fully expand all
  useEffect(() => {
    const getAllScreensWithChildrenItemIds = async (
      screenTree: TreeViewBaseItem[]
    ) => {
      const screenIds: TreeViewItemId[] = [];

      const registerScreenId = (item: TreeViewBaseItem): void => {
        if (item.children?.length) {
          screenIds.push(item.id);
          (item.children as TreeViewBaseItem[]).forEach(registerScreenId);
        }
      };

      for (const screen of screenTree) {
        await registerScreenId(screen);
      }
      setExpandedScreens(screenIds);
    };
    getAllScreensWithChildrenItemIds(currentScreenTree);
  }, [state.currentBeamline, state.beamlines, currentScreenTree]);

  return (
    <>
      {menuOpen ? (
        <RichTreeView
          items={currentScreenTree}
          selectedItems={state.currentScreenId}
          expandedItems={expandedScreens}
          onExpandedItemsChange={(_event, itemIds) =>
            handleExpandedScreensChange(itemIds)
          }
          onItemClick={(_event, itemId) => {
            // if (!itemId || currentFileMetadata[itemId]?.exists === false) {
            if (!itemId) {
              return;
            }
            handleClick(itemId);
          }}
          expansionTrigger="iconContainer"
          // isItemDisabled={item =>
          //   currentFileMetadata[item.id]?.exists === false
          // }
        />
      ) : (
        <></>
      )}
    </>
  );
}
