import { Box } from "@mui/material";
import { useCallback, useContext, useEffect, useReducer } from "react";
import {
  initialState,
  LOAD_SCREENS,
  reducer
} from "../store";
import { parseScreenTree } from "../utils/parser";
import { FileContext } from "@diamondlightsource/cs-web-lib";
import { useParams } from "react-router";
import { executeOpenPageActionWithUrlId } from "../utils/csWebLibActions";
import QuickScreens from "../components/QuickScreens";

/**
 * Displays a Quick Screens file editor
 */
export function QuickScreensPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const params: { beamline?: string; screenUrlId?: string } = useParams();
  const fileContext = useContext(FileContext);

  // Only run once on mount
  useEffect(() => {
    document.title = "Quick Screens | Daedalus";
    loadScreens();
  }, []);

  const loadScreens = useCallback(async () => {
    const newBeamlines = { ...state.beamlines };
    for (const item of Object.values(newBeamlines)) {
      const [tree, fileIDs] = await parseScreenTree(item.entryPoint);
      item.screenTree = tree;
      item.filePathIds = fileIDs;
    }
    dispatch({
      type: LOAD_SCREENS,
      payload: {
        beamlines: newBeamlines,
        loadBeamline: params.beamline,
        loadScreen: params.screenUrlId
      }
    });
    if (params.beamline && params.screenUrlId) {
      // If we navigated directly to a beamline and/or screen, load in display
      const beamlineState = newBeamlines[params.beamline];
      executeOpenPageActionWithUrlId(
        beamlineState,
        params.screenUrlId,
        params.beamline,
        fileContext
      );
    }
  }, []);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <QuickScreens />
      </Box>
    </>
  );
}
