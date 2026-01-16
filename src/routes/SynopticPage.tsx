import { Box } from "@mui/material";
import MiniMenuBar from "../components/MenuBar";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import {
  BeamlineState,
  CHANGE_BEAMLINE,
  CHANGE_SCREEN,
  LOAD_SCREENS
} from "../store";
import DLSAppBar from "../components/AppBar";
import ScreenDisplay from "../components/ScreenDisplay";
import { parseScreenTree } from "../utils/parser";
import {
  buildUrl,
  FileContext,
  FileContextType,
  FileDescription
} from "@diamondlightsource/cs-web-lib";
import { RotatingLines } from "react-loader-spinner";
import { SynopticBreadcrumbs } from "../components/SynopticBreadcrumbs";
import { BeamlineTreeStateContext } from "../App";
import { useParams, useSearchParams, useLocation } from "react-router-dom";
import {
  executeOpenPageActionWithUrlId,
  executeOpenPageAction
} from "../utils/csWebLibActions";

const FILE_DESCRIPTION_SEARCH_PARAMETER_NAME = "file_description";
const MACROS_SEARCH_PARAMETER_NAME = "macros";

export const MenuContext = createContext<{
  menuOpen: boolean;
  setMenuOpen: any;
}>({ menuOpen: true, setMenuOpen: () => null });

export function SynopticPage() {
  const { state, dispatch } = useContext(BeamlineTreeStateContext);
  const params: { beamline?: string; screenUrlId?: string } = useParams();
  const fileContext = useContext(FileContext);
  const [searchParams] = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(true);
  const location = useLocation();

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
    for (const [beamline, item] of Object.entries(newBeamlines)) {
      try {
        const [tree, fileIDs, firstFile] = await parseScreenTree(
          buildUrl(item.host, item.entryPoint)
        );
        item.screenTree = tree;
        item.filePathIds = fileIDs;
        item.topLevelScreen = firstFile;
        item.loaded = true;
      } catch (e) {
        console.error(
          `Unable to process JSON map for ${beamline}. Check file is available at ${item.host + item.entryPoint} and reload.`
        );
        console.error(e);
      }
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
          location.pathname
        );
      } else {
        const macrosParameter = searchParams.get(MACROS_SEARCH_PARAMETER_NAME);
        const macrosMap = macrosParameter
          ? JSON.parse(macrosParameter)
          : undefined;
        executeOpenPageActionWithUrlId(
          newBeamlineState,
          params.screenUrlId,
          params.beamline,
          fileContext,
          macrosMap
        );
      }
    }
  }, []);

  // override the default addTab method used by the cs-web-lib open tab actions
  const addTab = useCallback(
    addTabCallbackAction(
      state.beamlines,
      state.currentBeamline,
      window.location
    ),
    [state.beamlines, state.currentBeamline, window.location]
  );

  const updatedFileContext = useMemo(
    () => ({ ...fileContext, addTab }),
    [fileContext, addTab]
  );

  return (
    <>
      <Box sx={{ display: "flex" }}>
        {state.filesLoaded ? (
          <>
            <FileContext.Provider value={updatedFileContext}>
              <MenuContext.Provider value={{ menuOpen, setMenuOpen }}>
                <DLSAppBar fullScreen={false} open={menuOpen}>
                  <SynopticBreadcrumbs />
                </DLSAppBar>
                <MiniMenuBar />
                <ScreenDisplay />
              </MenuContext.Provider>
            </FileContext.Provider>
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

export const addTabCallbackAction =
  (
    beamlines: BeamlineState,
    currentBeamline: string,
    windowLocation: Location
  ): FileContextType["addTab"] =>
  (fileLocation: string, tabName: string, fileDesc: FileDescription) => {
    void fileLocation; // unused, but required by the function interface.
    void tabName; // unused, but required by the function interface.

    // try and find a matching file entry in the JSON map
    const displayedPath = fileDesc?.path?.replace(
      beamlines[currentBeamline].host!,
      ""
    );

    const allFiles = beamlines[currentBeamline].filePathIds;
    const currentFile = Object.values(allFiles).find(
      values => values.file === displayedPath
    );

    // Build the URL for the new tab
    let newURL = new URL(windowLocation.origin);
    if (currentFile?.urlId) {
      // we have a file mapping
      newURL.pathname = buildUrl(
        "",
        "synoptic",
        currentBeamline,
        currentFile?.urlId
      );
      if (fileDesc?.macros) {
        newURL.searchParams.append(
          MACROS_SEARCH_PARAMETER_NAME,
          JSON.stringify(fileDesc?.macros)
        );
      }
    } else {
      // No file mapping
      newURL = new URL(windowLocation.href);
      newURL.searchParams.append(
        FILE_DESCRIPTION_SEARCH_PARAMETER_NAME,
        JSON.stringify(fileDesc)
      );
    }
    window.open(newURL, "_blank");
  };
