import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';

interface ScreenListProps {
    open: boolean
    tree?: TreeViewBaseItem[]
}

// ID here should be the path of the file in whatever
// filesystem we end up using
const testScreen: TreeViewBaseItem[] = [{
    id: "TopLevel",
    label: "TopLevel",
    children: [
        {
            id: "DCM",
            label: "DCM",
            children: [{
                id: "FILTER 1",
                label: "FILTER 1",
            }]
        },
        {
            id: "MOTOR",
            label: "MOTOR",
        }
    ]
},
{
    id: "NextTopLevel",
    label: "nextTopLevel",
    children: [
        {
            id: "DCM2",
            label: "DCM2",
            children: [{
                id: "MYFILTER 1",
                label: "FMYILTER 1",
            }]
        },
        {
            id: "MOTOR2",
            label: "MOTOR2",
        }
    ]
}
]

export default function ScreenTreeView({ open, tree = testScreen }: ScreenListProps) {

    const handleClick = (itemId: string) => {
        console.log(itemId);
    };




    return (
        <>
            {open ? <RichTreeView items={tree} onItemClick={(event, itemId) => handleClick(itemId)} /> : <></>}
        </>
    );
}