import { Box, CssBaseline } from "@mui/material";
import { useEffect } from "react";
import QuickScreenDisplay from "../components/QuickScreens/Display";

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
        <CssBaseline />
        <QuickScreenDisplay />
      </Box>
    </>
  );
}
