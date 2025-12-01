import { Box } from "@mui/material";
import MiniMenuBar from "../components/MenuBar";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import { CHANGE_BEAMLINE, CHANGE_SCREEN, LOAD_SCREENS } from "../store";
import DLSAppBar from "../components/AppBar";
import ScreenDisplay from "../components/ScreenDisplay";
import { useParams } from "react-router-dom-v5-compat";
import { parseScreenTree } from "../utils/parser";
import { executeAction, FileContext } from "@diamondlightsource/cs-web-lib";
import { RotatingLines } from "react-loader-spinner";
import { SynopticBreadcrumbs } from "../components/SynopticBreadcrumbs";
import { BeamlineTreeStateContext } from "../App";

export const MenuContext = createContext<{
  menuOpen: boolean;
  setMenuOpen: any;
}>({ menuOpen: true, setMenuOpen: () => null });

export function MainPage() {
  const { state, dispatch } = useContext(BeamlineTreeStateContext);
  const params: { beamline?: string; screenId?: string } = useParams();
  const fileContext = useContext(FileContext);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Only trigger once
    if (state.filesLoaded) {
      if (params.beamline && params.beamline !== state.currentBeamline)
        dispatch({
          type: CHANGE_BEAMLINE,
          payload: { beamline: params.beamline }
        });
      if (params.screenId && params.screenId !== state.currentScreenId)
        dispatch({
          type: CHANGE_SCREEN,
          payload: { screenId: params.screenId }
        });
    }
  }, [params.beamline, params.screenId]);

  // Only run once on mount
  useEffect(() => {
    loadScreens();
  }, []);

  const loadScreens = useCallback(async () => {
    const newBeamlines = { ...state.beamlines };
    for (const [beamline, item] of Object.entries(newBeamlines)) {
      try {
        const [tree, fileIDs, firstFile] = await parseScreenTree(
          item.host + item.entryPoint
        );
        item.screenTree = tree;
        item.filePathIds = fileIDs;
        item.topLevelScreen = firstFile;
        item.loaded = true;
      } catch (e) {
        console.error(
          `Unable to load JSON map for ${beamline}. Check file is available at ${item.host + item.entryPoint} and reload.`
        );
      }
    }
    dispatch({
      type: LOAD_SCREENS,
      payload: {
        beamlines: newBeamlines,
        loadBeamline: params.beamline,
        loadScreen: params.screenId
      }
    });
    if (params.beamline) {
      // If we navigated directly to a beamline and/or screen, load in display
      const newBeamlineState = newBeamlines[params.beamline];
      const newScreen =
        newBeamlineState.host +
        (params.screenId
          ? newBeamlineState.filePathIds[params.screenId].file
          : newBeamlineState.topLevelScreen);
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
        {state.filesLoaded ? (
          <>
            <MenuContext.Provider value={{ menuOpen, setMenuOpen }}>
              <DLSAppBar fullScreen={false} open={menuOpen}>
                <SynopticBreadcrumbs />
              </DLSAppBar>
              <MiniMenuBar />
              <ScreenDisplay />
            </MenuContext.Provider>
          </>
        ) : (
          <>
            <RotatingLines
              strokeColor="grey"
              strokeWidth="5"
              animationDuration="0.75"
              width="96"
              visible={true}
            />
          </>
        )}
      </Box>
    </>
  );
}
