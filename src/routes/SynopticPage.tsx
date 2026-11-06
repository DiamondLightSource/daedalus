import { Box } from "@mui/material";
import { useCallback, useContext, useEffect, useMemo } from "react";
import { CHANGE_BEAMLINE, CHANGE_SCREEN, LOAD_SCREENS } from "../store";
import ScreenDisplay from "../components/ScreenDisplay";
import { parseScreenTree } from "../utils/parser";
import {
  buildUrl,
  FileContext,
  FileDescription,
  useNotification
} from "@diamondlightsource/cs-web-lib";
import { RotatingLines } from "react-loader-spinner";
import { useParams, useSearchParams, useLocation } from "react-router";
import {
  executeOpenPageActionWithUrlId,
  executeOpenPageAction
} from "../utils/csWebLibActions";
import { BeamlineTreeStateContext } from "../contexts/BeamlineTreeStateContext";

const FILE_DESCRIPTION_SEARCH_PARAMETER_NAME = "file_description";
const MACROS_SEARCH_PARAMETER_NAME = "macros";

export function SynopticPage() {
  const { state, dispatch } = useContext(BeamlineTreeStateContext);
  const { beamline: paramsBeamline, "*": paramsScreenUrlId } = useParams();
  const fileContext = useContext(FileContext);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { showWarning } = useNotification();

  useEffect(() => {
    // Only trigger once
    document.title = `${paramsBeamline ?? ""} Synoptic | Daedalus`;
    if (state.filesLoaded) {
      if (paramsBeamline && paramsBeamline !== state.currentBeamline)
        dispatch({
          type: CHANGE_BEAMLINE,
          payload: { beamline: paramsBeamline }
        });
      if (paramsScreenUrlId && paramsScreenUrlId !== state.currentScreenUrlId)
        dispatch({
          type: CHANGE_SCREEN,
          payload: { screenUrlId: paramsScreenUrlId }
        });
    }
  }, [paramsBeamline, paramsScreenUrlId]);

  // Only run once on mount
  useEffect(() => {
    document.title = "Synoptic | Daedalus";
    loadScreens();
  }, []);

  const loadScreens = useCallback(async () => {
    const newBeamlines = { ...state.beamlines };
    for (const [newBeamline, item] of Object.entries(newBeamlines)) {
      if (item.loaded) continue;

      try {
        const [tree, fileIDs, firstFile] = await parseScreenTree(
          buildUrl(item.host, item.entryPoint)
        );
        item.screenTree = tree;
        item.filePathIds = fileIDs;
        item.topLevelScreen = firstFile;
        item.loaded = true;
      } catch (e) {
        showWarning(
          `Unable to process the beamline: ${newBeamline}. JsonMap file is not found where expected: ${item.host + item.entryPoint}.`
        );
        console.error(
          `Unable to process JSON map for ${newBeamline}. Check file is available at ${item.host + item.entryPoint} and reload.`
        );
        console.error(e);
      }
    }
    dispatch({
      type: LOAD_SCREENS,
      payload: {
        beamlines: newBeamlines,
        loadBeamline: paramsBeamline,
        loadScreen: paramsScreenUrlId
      }
    });
    if (paramsBeamline) {
      // If we navigated directly to a beamline and/or screen, load in display
      const newBeamlineState = newBeamlines[paramsBeamline];

      const fileDescriptionParam = searchParams.get(
        FILE_DESCRIPTION_SEARCH_PARAMETER_NAME
      );
      if (fileDescriptionParam) {
        // handle case where we have no JsonMap entry, which will contain a full screen file definition
        const fileDescription = JSON.parse(
          fileDescriptionParam
        ) as FileDescription;
        executeOpenPageAction(
          fileDescription.path,
          fileDescription.macros,
          fileDescription.defaultProtocol,
          fileContext,
          location.pathname,
          newBeamlineState.pvwsHost
        );
      } else {
        const macrosParameter = searchParams.get(MACROS_SEARCH_PARAMETER_NAME);
        const macrosMap = macrosParameter
          ? JSON.parse(macrosParameter)
          : undefined;

        executeOpenPageActionWithUrlId(
          newBeamlineState,
          paramsScreenUrlId,
          paramsBeamline,
          fileContext,
          macrosMap
        );
      }
    }
  }, []);

  return state.filesLoaded ? (
    <ScreenDisplay />
  ) : (
    <>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <RotatingLines
          strokeColor="grey"
          strokeWidth="5"
          animationDuration="0.75"
          width="96"
          visible={true}
        />
      </Box>
    </>
  );
}
