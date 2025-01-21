import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useContext } from 'react';
import BeamlineTreeStateContext from '../routes/MainPage';
import { CHANGE_SCREEN } from '../store';
import { TreeViewBaseItem } from '@mui/x-tree-view';


export default function ScreenTreeView() {
    const { state, dispatch } = useContext(BeamlineTreeStateContext);

    const handleClick = (itemId: string) => {
        dispatch({ type: CHANGE_SCREEN, payload: { screenId: itemId } });
    };

    let currentScreenTree: TreeViewBaseItem[] = [];
    const currentBeamline = state.beamlines.filter(item => item.beamline === state.currentBeamline)
    if (currentBeamline.length > 0) currentScreenTree = currentBeamline[0].screenTree;

    return (
        <>
            {state.menuBarOpen ? <RichTreeView items={currentScreenTree} onItemClick={(event, itemId) => handleClick(itemId)} /> : <></>}
        </>
    );
}