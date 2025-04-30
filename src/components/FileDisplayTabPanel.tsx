import Box from "@mui/material/Box";
interface FileDisplayTabPanelProps {
  index: number;
  value: number;
  display: JSX.Element;
}

export default function FileDisplayTabPanel(props: FileDisplayTabPanelProps) {
  const { index, value, display } = props;
  // Here is where we load our files
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ height: "100%", overflowY: "scroll" }}
    >
      {value === index && <Box>{display}</Box>}
    </div>
  );
}
