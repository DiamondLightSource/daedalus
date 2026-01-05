import { Box } from "@mui/material";
import { useCallback, useContext, useEffect, useReducer } from "react";
import {
  CHANGE_BEAMLINE,
  CHANGE_SCREEN,
  initialState,
  LOAD_SCREENS,
  reducer
} from "../store";
import { parseScreenTree } from "../utils/parser";
import { executeAction, FileContext } from "@diamondlightsource/cs-web-lib";
import Editor from "../components/Editor";
import { useParams } from "react-router-dom";
import { buildUrl } from "../utils/urlUtils";

/**
 * Displays a mock editor page with palette and Phoebus
 * property menu bars
 * @returns
 */
export function EditorPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const params: { beamline?: string; screenUrlId?: string } = useParams();
  const fileContext = useContext(FileContext);

  useEffect(() => {
    // Only trigger once
    if (state.filesLoaded) {
      if (params.beamline && params.beamline !== state.currentBeamline)
        dispatch({
          type: CHANGE_BEAMLINE,
          payload: { beamline: params.beamline }
        });
      if (params.screenUrlId && params.screenUrlId !== state.currentScreenUrlId)
        dispatch({
          type: CHANGE_SCREEN,
          payload: { screenUrlId: params.screenUrlId }
        });
    }
  }, [params.beamline, params.screenUrlId]);

  // Only run once on mount
  useEffect(() => {
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
    if (params.beamline) {
      // If we navigated directly to a beamline and/or screen, load in display
      const newBeamlineState = newBeamlines[params.beamline];
      const newScreen = params.screenUrlId
        ? newBeamlineState.filePathIds[params.screenUrlId].file
        : buildUrl(newBeamlineState.host, newBeamlineState.topLevelScreen);
      executeAction(
        {
          type: "OPEN_PAGE",
          dynamicInfo: {
            name: newScreen,
            location: "main",
            description: undefined,
            file: {
              path: newScreen,
              macros: {},
              defaultProtocol: "ca"
            }
          }
        },
        fileContext,
        undefined,
        {}
      );
    }
  }, []);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Editor />
      </Box>
    </>
  );
}
