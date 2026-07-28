import { Box } from "@mui/material";
import SourceDisplay from "./SourceDisplay";
import ScreenTreeView from "./ScreenTreeView";
import {useState} from "react";
import { FileMetadata } from "../store";
import BeamlineSelect from "./BeamlineSelect";

interface SourcePanelProps {
  onScreenSelected: (file: FileMetadata) => void;
}

export default function SourcePanel({onScreenSelected}: SourcePanelProps){


    const [selectedFile, setSelectedFile] =
    useState<FileMetadata>();


    const handleSelect = (file: FileMetadata) => {
    setSelectedFile(file);
    onScreenSelected(file);
    };

    return (
    <Box
        sx={{
            width: "40%",
            display: "flex",
            flexDirection: "column",
            borderRight: 1,
            borderColor: "divider",
            overflow: "hidden"
        }}
    >
        <Box sx={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
            <Box sx={{ width: 150, overflow: "auto" }}>
                <BeamlineSelect />
                <ScreenTreeView
                    onScreenSelected={handleSelect}
                />
            </Box>
            <SourceDisplay file={selectedFile} />
        </Box>

    </Box>
    );
}