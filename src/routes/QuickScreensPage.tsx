import { Box } from "@mui/material";
import { useEffect } from "react";
import QuickScreens from "../components/QuickScreens";

/**
 * Displays a Quick Screens file editor
 */
export function QuickScreensPage() {
  // Only run once on mount
  useEffect(() => {
    document.title = "Quick Screens | Daedalus";
  }, []);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <QuickScreens />
      </Box>
    </>
  );
}
