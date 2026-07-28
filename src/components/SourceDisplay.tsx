import {EmbeddedDisplay, newRelativePosition} from "@diamondlightsource/cs-web-lib";
import {Box, Typography} from "@mui/material";
import {FileMetadata} from "../store";
import FileStateContext from "../routes/DemoPage";
import {useContext} from "react";

interface SourceDisplayProps {
    file?: FileMetadata;
}

export default function SourceDisplay({file}: SourceDisplayProps) {
    const {state} = useContext(FileStateContext);

    if (!file) {
        return (
            <Box sx={{flex:1, display: "flex", justifyContent: "center", alignItems: "center"}}>
                <Typography variant="h6">Select a screen</Typography>
            </Box>
        );
    }

    const displayFile = state.files.find(
        f => f.name.endsWith(file.file)
    );
    
    console.log("Selected:", file);
    console.log("Resolved:", displayFile);
    return (
        <Box sx={{flex:1, overflowY: "auto", height: "100%"}}>
            <EmbeddedDisplay
                height={800}
                position={newRelativePosition()}
                scroll={true}
                resize={0}
                file={{
                    path: displayFile?.name || file.file,
                    macros: displayFile?.macros || {},
                    defaultProtocol: displayFile?.protocol || "ca"
                }}
            />
        </Box>
    );
}