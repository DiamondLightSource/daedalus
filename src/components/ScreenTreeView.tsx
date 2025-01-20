import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';

interface ScreenListProps {
    open: boolean
    tree?: TreeViewBaseItem[]
}

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
    // const [open, setOpen] = React.useState(true);

    // const handleClick = (itemName: string) => {
    //     setOpen((o) => ({ ...initialState, [itemName]: !o[itemName] }));
    // };

    //


    return (
        <>
            {open ? <RichTreeView items={tree} /> : <></>}
        </>
    );
}