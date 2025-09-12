import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { useContext, useEffect, useState } from "react";
import BeamlineTreeStateContext from "../routes/MainPage";
import { TreeViewItemId } from "@mui/x-tree-view";
import { executeAction, FileContext } from "@diamondlightsource/cs-web-lib";
import { ScreenTreeViewBaseItem } from "../utils/helper";

export default function ScreenTreeView() {
  const { state } = useContext(BeamlineTreeStateContext);
  const fileContext = useContext(FileContext);
  const [expandedScreens, setExpandedScreens] = useState<string[]>([]);

  const handleExpandedScreensChange = (
    event: React.SyntheticEvent,
    screenIds: string[]
  ) => {
    setExpandedScreens(screenIds);
  };

  const handleClick = (itemId: string) => {
    const newScreen =
      state.beamlines[state.currentBeamline].filePathIds[itemId];
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
      `/${state.currentBeamline}/${itemId}`
    );
  };

  let currentScreenTree: ScreenTreeViewBaseItem[] = [];
  const currentBeamline = state.beamlines[state.currentBeamline];
  if (currentBeamline) currentScreenTree = currentBeamline.screenTree;

  // When beamline is updated, trigger refresh of expanded screens to fully expand all
  useEffect(() => {
    const getAllScreensWithChildrenItemIds = async (
      screenTree: ScreenTreeViewBaseItem[]
    ) => {
      const screenIds: TreeViewItemId[] = [];

      const registerScreenId = (item: ScreenTreeViewBaseItem) => {
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
      {state.menuBarOpen ? (
        <RichTreeView
          items={currentScreenTree}
          expandedItems={expandedScreens}
          onExpandedItemsChange={handleExpandedScreensChange}
          onItemClick={(event, itemId) => handleClick(itemId)}
        />
      ) : (
        <></>
      )}
    </>
  );
}
