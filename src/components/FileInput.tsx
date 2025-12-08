import { useContext, useState } from "react";
import FileStateContext from "../routes/DemoPage";
import { Stack, Typography, TextField, Button } from "@mui/material";
import { isValidHttpUrl } from "../utils/helper";
import { LOAD_NEXT_FILE } from "../store";
import { httpRequest } from "@diamondlightsource/cs-web-lib";

export default function FileInput() {
  const { dispatch } = useContext(FileStateContext);
  const [filePath, setFilePath] = useState("");
  const [validFile, setValidFile] = useState<boolean | undefined>(true);
  const [helperText, setHelperText] = useState<string>("");

  function handleTextChange(e: any) {
    setFilePath(e.target.value);
  }

  async function handleLoadButtonClick(e: any) {
    // Check if file exists
    // If passes all checks, we load
    // If fails, we change colour and set a popover explaining issue
    if (filePath === "") setValidFile(true);
    const extension = filePath.split(".").pop();
    const validUrl = isValidHttpUrl(filePath);
    const validExtension =
      extension !== "bob" && extension !== "opi" && extension !== "json"
        ? false
        : true;
    let valid = false;
    try {
      const fileExists = await httpRequest(filePath, { method: "HEAD" }).then(
        res => {
          return res.ok;
        }
      );
      if (fileExists) {
        if (validUrl) {
          if (validExtension) {
            valid = true;
            setHelperText("");
            dispatch({
              type: LOAD_NEXT_FILE,
              payload: { file: { path: filePath, macros: {} } }
            });
          } else {
            setHelperText("Invalid file extension. Use .bob, .opi or .json");
            valid = false;
          }
        } else {
          setHelperText("Invalid URL protocol");
          valid = false;
        }
      } else {
        setHelperText("Invalid file could not be fetched from URL");
        valid = false;
      }
    } catch {
      valid = false;
      setHelperText("Invalid file could not be fetched from URL");
    }

    setValidFile(valid);
  }

  return (
    <Stack
      spacing={2}
      direction="row"
      sx={{ top: 20, left: 0, zIndex: 1299, width: "60%" }}
    >
      <Typography sx={{ display: "flex", alignItems: "center", height: 50 }}>
        File to load:
      </Typography>
      <TextField
        id="outlined-basic"
        value={filePath}
        label="URL"
        variant="outlined"
        onChange={handleTextChange}
        sx={{ height: 50, width: "100%" }}
        error={!validFile}
        helperText={helperText}
      />
      <Button
        sx={{ height: 50 }}
        variant="contained"
        onClick={handleLoadButtonClick}
      >
        Load
      </Button>
    </Stack>
  );
}
