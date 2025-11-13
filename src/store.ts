import { TreeViewBaseItem } from "@mui/x-tree-view";
import { BeamlinesConfig } from "./config";
export const LOAD_NEXT_FILE = "loadNextFile";
export const ADD_FILE = "addFile";
export const REMOVE_FILE = "removeFile";
export const ADD_MACROS = "addMacros";
export const REMOVE_MACROS = "removeMacros";
export const CHANGE_PROTOCOL = "changeProtocol";

export interface MacroMap {
  [key: string]: string;
}

// An interface for our actions
interface LoadNextFile {
  type: typeof LOAD_NEXT_FILE;
  payload: {
    file: FileInfo;
  };
}

interface AddFile {
  type: typeof ADD_FILE;
  payload: {
    name: string;
    display: JSX.Element;
  };
}

interface RemoveFile {
  type: typeof REMOVE_FILE;
  payload: {
    name: string;
  };
}

interface AddMacros {
  type: typeof ADD_MACROS;
  payload: {
    name: string;
    value: string;
  };
}

interface RemoveMacros {
  type: typeof REMOVE_MACROS;
  payload: {
    name: string;
  };
}

interface ChangeProtocol {
  type: typeof CHANGE_PROTOCOL;
  payload: {
    value: string;
  };
}

type Action =
  | LoadNextFile
  | AddFile
  | RemoveFile
  | AddMacros
  | RemoveMacros
  | ChangeProtocol;

// This is the basic file information
type FileInfo = {
  protocol: string;
  path?: string;
  macros?: MacroMap;
};

type LoadedFile = {
  name: string;
  display: JSX.Element;
};

export type FileState = {
  nextFile: FileInfo;
  files: LoadedFile[];
};

export const demoInitialState: FileState = {
  nextFile: { protocol: "ca" },
  files: []
};

export function demoReducer(state: FileState, action: Action) {
  switch (action.type) {
    case LOAD_NEXT_FILE: {
      // Load temporary file info into state
      const file = { ...state.nextFile, ...action.payload.file };
      return { ...state, nextFile: file };
    }
    case ADD_FILE: {
      // Empty nextFile
      const newNextFile: FileInfo = { protocol: "ca" };
      const newFiles = [...state.files];
      const newFile: LoadedFile = {
        name: action.payload.name,
        display: action.payload.display
      };
      newFiles.push(newFile);
      // Create the Embedded Display json that we want
      return {
        ...state,
        nextFile: newNextFile,
        files: newFiles
      };
    }
    case REMOVE_FILE: {
      const newFiles = state.files.filter(function (file) {
        return file.name !== action.payload.name;
      });
      return { ...state, files: newFiles };
    }
    case ADD_MACROS: {
      const file = { ...state.nextFile };
      if (file.macros === undefined)
        file.macros = { [action.payload.name]: action.payload.value };
      file.macros[action.payload.name] = action.payload.value;
      return { ...state, nextFile: file };
    }
    case REMOVE_MACROS: {
      const file = { ...state.nextFile };
      if (file.macros !== undefined) delete file.macros[action.payload.name];
      return { ...state, nextFile: file };
    }
    case CHANGE_PROTOCOL: {
      const file = { ...state.nextFile };
      file.protocol = action.payload.value;
      return { ...state, nextFile: file };
    }
  }
}

export const APPEND_BEAMLINES = "appendBeamline";
export const CHANGE_BEAMLINE = "changeBeamline";
export const CHANGE_SCREEN = "changeScreen";
export const OPEN_MENU_BAR = "openMenuBar";
export const LOAD_SCREENS = "loadScreens";

// An interface for our actions
interface AppendBeamlines {
  type: typeof APPEND_BEAMLINES;
  payload: BeamlinesConfig;
}

interface ChangeBeamline {
  type: typeof CHANGE_BEAMLINE;
  payload: {
    beamline: string;
  };
}

interface ChangeScreen {
  type: typeof CHANGE_SCREEN;
  payload: {
    screenId: string;
  };
}

interface OpenMenuBar {
  type: typeof OPEN_MENU_BAR;
  payload: {
    page: string;
    open: boolean;
  };
}

interface LoadScreens {
  type: typeof LOAD_SCREENS;
  payload: {
    beamlines: BeamlineState;
    loadBeamline?: string;
    loadScreen?: string;
  };
}

type BeamlineAction = AppendBeamlines | ChangeBeamline | ChangeScreen | OpenMenuBar | LoadScreens;

export type FileIDs = {
  [id: string]: {
    file: string;
    macros?: [
      {
        [key: string]: string;
      }
    ];
  };
};

export type BeamlineStateProperties = {
  entryPoint: string;
  topLevelScreen: string;
  screenTree: TreeViewBaseItem[];
  filePathIds: FileIDs;
  host: string;
  loaded: boolean;
};

export type BeamlineState = {
  [key: string]: BeamlineStateProperties;
};

export type BeamlineTreeState = {
  filesLoaded: boolean;
  menuBarsOpen: {
    archiver: boolean;
    synoptic: boolean;
    traces: boolean;
  };
  currentBeamline: string;
  currentScreenId: string;
  currentScreenLabel: string;
  currentScreenFilepath: string;
  beamlines: BeamlineState;
};

const defaultBeamline: BeamlineStateProperties = {
  host: "",
  entryPoint: "",
  topLevelScreen: "",
  screenTree: [],
  filePathIds: {},
  loaded: false
};

// ID here should be the path of the file in whatever
// filesystem we end up using
export const initialState: BeamlineTreeState = {
  filesLoaded: true,
  menuBarsOpen: {
    archiver: false,
    traces: false,
    synoptic: true
  },
  currentBeamline: "",
  currentScreenId: "",
  currentScreenLabel: "",
  currentScreenFilepath: "",
  beamlines: {
    BLTEST: {
      host: "",
      entryPoint: "/BOBs/BLTEST/json_map.json",
      topLevelScreen: "",
      screenTree: [],
      filePathIds: {},
      loaded: false
    },
    BLFAKE: {
      host: "",
      entryPoint: "/BOBs/BLFAKE/json_map.json",
      topLevelScreen: "",
      screenTree: [],
      filePathIds: {},
      loaded: false
    }
  }
};

export function reducer(state: BeamlineTreeState, action: BeamlineAction) {
  switch (action.type) {
    case APPEND_BEAMLINES: {
      let newBeamlineState = state.beamlines;
      Object.keys(action.payload).forEach((beamline) => {
        newBeamlineState = { ...newBeamlineState, [beamline]: { ...defaultBeamline, ...action.payload[beamline] } };
      });

      return {
        ...state,
        beamlines: newBeamlineState,
      };
    }
    case CHANGE_BEAMLINE: {
      let newID = state.currentScreenId;
      // Set current screen to top level screen of new beamline
      const newBeamlineState = state.beamlines[action.payload.beamline];
      // Fetch top level screen
      Object.entries(newBeamlineState.filePathIds).forEach(([key, value]) => {
        if (value.file === newBeamlineState.topLevelScreen) newID = key;
      });
      return {
        ...state,
        currentBeamline: action.payload.beamline,
        currentScreenId: newID,
        currentScreenFilepath: newBeamlineState.topLevelScreen,
        currentScreenLabel: newBeamlineState.topLevelScreen
          .split(".bob")[0]
          .split("/")
          .pop()!
      };
    }
    case CHANGE_SCREEN: {
      // Parse the label from the end of the ID. This is the specific screen name
      const newLabel = action.payload.screenId.split("+").pop() || "";
      return {
        ...state,
        currentScreenId: action.payload.screenId,
        currentScreenLabel: newLabel
      };
    }
    case OPEN_MENU_BAR: {
      const newMenuBarState = {
        ...state.menuBarsOpen,
        [action.payload.page]: action.payload.open
      };
      return { ...state, menuBarsOpen: newMenuBarState };
    }
    case LOAD_SCREENS: {
      const newState = {
        ...state,
        filesLoaded: true,
        beamlines: action.payload.beamlines
      };

      if (action.payload.loadBeamline) {
        newState.currentBeamline = action.payload.loadBeamline;
        const newBeamlineState =
          action.payload.beamlines[action.payload.loadBeamline];
        Object.entries(newBeamlineState.filePathIds).forEach(([key, value]) => {
          // If the screen ID we've been passed matches
          if (action.payload.loadScreen === key) {
            newState.currentScreenFilepath = value.file;
            newState.currentScreenId = key;
            newState.currentScreenLabel = key.split(".").pop()!;
            // If no loadscreen match, use
          } else if (
            !action.payload.loadScreen &&
            value.file === newBeamlineState.topLevelScreen
          ) {
            newState.currentScreenFilepath = value.file;
            newState.currentScreenId = key;
            newState.currentScreenLabel = key.split(".").pop()!;
          }
        });
      }
      // Load the tree and the array of filepaths associated with IDs
      return newState;
    }
  }
}

// Data browser state

export const TOGGLE_TRACES_PANEL = "toggleTracesPanel";
export const TOGGLE_ARCHIVER_MENU_BAR = "toggleArchiverMenuBar";

// An interface for our actions
interface ToggleTracesPanel {
  type: typeof TOGGLE_TRACES_PANEL;
  payload: {
    open: boolean;
  };
}

interface ToggleArchiverMenuBar {
  type: typeof TOGGLE_ARCHIVER_MENU_BAR;
  payload: {
    open: boolean;
  };
}

type DataBrowserAction = ToggleTracesPanel | ToggleArchiverMenuBar;

export type DataBrowserState = {
  tracesPanelOpen: boolean;
  archiverMenuBarOpen: boolean;
};

export const initialDataBrowserState: DataBrowserState = {
  tracesPanelOpen: false,
  archiverMenuBarOpen: false
};

export function dataBrowserReducer(
  state: DataBrowserState,
  action: DataBrowserAction
) {
  switch (action.type) {
    case TOGGLE_TRACES_PANEL: {
      return { ...state, tracesPanelOpen: action.payload.open };
    }
    case TOGGLE_ARCHIVER_MENU_BAR: {
      return { ...state, archiverMenuBarOpen: action.payload.open };
    }
  }
}
