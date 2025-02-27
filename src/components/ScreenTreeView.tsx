import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useContext, useEffect, useState } from 'react';
import BeamlineTreeStateContext from '../routes/MainPage';
import { TreeViewBaseItem, TreeViewItemId } from '@mui/x-tree-view';
import { executeAction, FileContext } from '@diamondlightsource/cs-web-lib';
import { CHANGE_SCREEN } from '../store';


export default function ScreenTreeView() {
    const { state, dispatch } = useContext(BeamlineTreeStateContext);
    const fileContext = useContext(FileContext)
    const [expandedScreens, setExpandedScreens] = useState<string[]>([]);

    const handleExpandedScreensChange = (
        event: React.SyntheticEvent,
        screenIds: string[],
    ) => {
        setExpandedScreens(screenIds);
    };

    const handleClick = (itemId: string) => {
        const newScreen = state.beamlines[state.currentBeamline].filePathIds[itemId];
        dispatch({ type: CHANGE_SCREEN, payload: { screenId: itemId } })
        executeAction({
            type: 'OPEN_PAGE',
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
        }, fileContext, undefined, {}, `/${state.currentBeamline}/${itemId}`)

    };

    let currentScreenTree: TreeViewBaseItem[] = [];
    const currentBeamline = state.beamlines[state.currentBeamline]
    if (currentBeamline) currentScreenTree = currentBeamline.screenTree;

    // When beamline is updated, trigger refresh of expanded screens to fully expand all
    useEffect(() => {
        setExpandedScreens(getAllScreensWithChildrenItemIds(currentScreenTree))
    }, [currentScreenTree]);

    return (
        <>
            {state.menuBarOpen ? <RichTreeView items={currentScreenTree} expandedItems={expandedScreens} onExpandedItemsChange={handleExpandedScreensChange} onItemClick={(event, itemId) => handleClick(itemId)} /> : <></>}
        </>
    );
}

const getAllScreensWithChildrenItemIds = (screenTree: TreeViewBaseItem[]) => {
    const screenIds: TreeViewItemId[] = []
    const registerScreenId = (item: TreeViewBaseItem) => {
        if (item.children?.length) {
            screenIds.push(item.id);
            item.children.forEach(registerScreenId);
        }
    };

    screenTree.forEach(registerScreenId)

    return screenIds;
};