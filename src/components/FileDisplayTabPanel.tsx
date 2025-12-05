import { EmbeddedDisplay, RelativePosition } from "@diamondlightsource/cs-web-lib";
import Box from "@mui/material/Box";
import { MacroMap } from "../store";
interface FileDisplayTabPanelProps {
  index: number;
  value: number;
  file: {name: string, protocol: string, macros?: MacroMap};
}

export default function FileDisplayTabPanel(props: FileDisplayTabPanelProps) {
  const { index, value, file } = props;
  // Here is where we load our files
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ height: "100%", overflowY: "scroll" }}
    >
      {value === index && <Box>
        <EmbeddedDisplay
          height={800}
          position={new RelativePosition()}
          scroll={true}
          resize={0}
          file={{
            path: file.name,
            macros: { ...file.macros },
            defaultProtocol: file.protocol
          }}
        />
        </Box>}
    </div>
  );
}
