import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useContext } from 'react';
import BeamlineTreeStateContext from '../routes/MainPage';
import { CHANGE_SCREEN } from '../store';


export default function ScreenTreeView() {
    const { state, dispatch } = useContext(BeamlineTreeStateContext);

    const handleClick = (itemId: string) => {
        dispatch({ type: CHANGE_SCREEN, payload: { screenId: itemId } });
    };

    return (
        <>
            {state.menuBarOpen ? <RichTreeView items={state.beamlines[0].screenTree} onItemClick={(event, itemId) => handleClick(itemId)} /> : <></>}
        </>
    );
}