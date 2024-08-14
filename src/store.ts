import { MacroMap } from "./App";

export const LOAD_NEXT_FILE = "loadNextFile";
export const ADD_FILE = "addFile";
export const REMOVE_FILE = "removeFile";
export const ADD_MACROS = "addMacros";
export const REMOVE_MACROS = "removeMacros";

// An interface for our actions
interface LoadNextFile {
    type: typeof LOAD_NEXT_FILE;
    payload: {
        file: FileInfo
    };
}

interface AddFile {
    type: typeof ADD_FILE;
    payload: {
        name: string,
        display: JSX.Element,
    };
}

interface RemoveFile {
    type: typeof REMOVE_FILE;
    payload: {
        name: string
    }
}

interface AddMacros {
    type: typeof ADD_MACROS;
    payload: {
        name: string,
        value: string
    }
}

interface RemoveMacros {
    type: typeof REMOVE_MACROS;
    payload: {
        name: string;
    };
}

type Action =
    | LoadNextFile
    | AddFile
    | RemoveFile
    | AddMacros
    | RemoveMacros

// This is the basic file information
type FileInfo = {
    path?: string,
    macros?: MacroMap
}

type LoadedFile = {
    name: string
    display: JSX.Element,
}

export type FileState = {
    nextFile: FileInfo,
    files: LoadedFile[]
}

export const initialState: FileState = { nextFile: {}, files: [] };

export function reducer(state: FileState, action: Action) {
    switch (action.type) {
        case LOAD_NEXT_FILE: {
            // Load temporary file info into state
            return { ...state, nextFile: action.payload.file };
        }
        case ADD_FILE: {
            // Empty nextFile
            const newNextFile: FileInfo = {};
            const newFiles = [...state.files];
            const newFile: LoadedFile = { name: action.payload.name, display: action.payload.display };
            newFiles.push(newFile);
            // Create the Embedded Display json that we want
            return {
                ...state, nextFile: newNextFile, files: newFiles
            }
        }
        case REMOVE_FILE: {
            const newFiles = state.files.filter(function (file) { return file.name !== action.payload.name })
            return { ...state, files: newFiles };
        }
        case ADD_MACROS: {
            const file = { ...state.nextFile }
            if (file.macros === undefined) file.macros = { [action.payload.name]: action.payload.value }
            file.macros[action.payload.name] = action.payload.value;
            return { ...state, nextFile: file };
        }
        case REMOVE_MACROS: {
            const file = { ...state.nextFile }
            if (file.macros !== undefined) delete file.macros[action.payload.name];
            return { ...state, nextFile: file };
        }
    }
}