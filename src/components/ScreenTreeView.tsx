import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { useContext, useEffect, useState } from "react";
import { TreeViewBaseItem, TreeViewItemId } from "@mui/x-tree-view";
import { executeAction, FileContext } from "@diamondlightsource/cs-web-lib";
import { BeamlineTreeStateContext } from "../App";

export default function ScreenTreeView() {
  const { state } = useContext(BeamlineTreeStateContext);
  const fileContext = useContext(FileContext);
  const [expandedScreens, setExpandedScreens] = useState<string[]>([]);

  const handleExpandedScreensChange = (screenIds: string[]) => {
    setExpandedScreens(screenIds);
  };

  const handleClick = (itemId: string) => {
    const newScreen =
      state.beamlines[state.currentBeamline].host +
      state.beamlines[state.currentBeamline].filePathIds[itemId].file;
    executeAction(
      {
        type: "OPEN_PAGE",
        dynamicInfo: {
          name: newScreen,
          location: "main",
          description: undefined,
          file: {
            path: newScreen,
            macros: {},
            defaultProtocol: "ca"
          }
        }
      },
      fileContext,
      undefined,
      {},
      `/synoptic/${state.currentBeamline}/${itemId}`
    );
  };

  let currentScreenTree: TreeViewBaseItem[] = [];
  const currentBeamline = state.beamlines[state.currentBeamline];
  if (currentBeamline) currentScreenTree = currentBeamline.screenTree;

  // When beamline is updated, trigger refresh of expanded screens to fully expand all
  useEffect(() => {
    const getAllScreensWithChildrenItemIds = async (
      screenTree: TreeViewBaseItem[]
    ) => {
      const screenIds: TreeViewItemId[] = [];

      const registerScreenId = (item: TreeViewBaseItem) => {
        if (item.children?.length) {
          screenIds.push(item.id);
          item.children.forEach(registerScreenId);
        }
      };

      for (const screen of screenTree) {
        await registerScreenId(screen);
      }
      setExpandedScreens(screenIds);
    };
    getAllScreensWithChildrenItemIds(currentScreenTree);
  }, [state.currentBeamline, state.beamlines]);

  return (
    <>
      {state.menuBarsOpen.synoptic ? (
        <RichTreeView
          items={currentScreenTree}
          expandedItems={expandedScreens}
          onExpandedItemsChange={_event => handleExpandedScreensChange}
          onItemClick={(_event, itemId) => handleClick(itemId)}
        />
      ) : (
        <></>
      )}
    </>
  );
}
