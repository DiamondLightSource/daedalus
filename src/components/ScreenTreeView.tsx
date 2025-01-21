import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useContext } from 'react';
import BeamlineTreeStateContext from '../routes/MainPage';
import { CHANGE_SCREEN } from '../store';

interface ScreenListProps {
    open: boolean
}

export default function ScreenTreeView({ open }: ScreenListProps) {
    const { state, dispatch } = useContext(BeamlineTreeStateContext);

    const handleClick = (itemId: string) => {
        dispatch({ type: CHANGE_SCREEN, payload: { screenId: itemId } });
        console.log(state.currentScreenId);
    };

    return (
        <>
            {open ? <RichTreeView items={state.beamlines[0].screenTree} onItemClick={(event, itemId) => handleClick(itemId)} /> : <></>}
        </>
    );
}