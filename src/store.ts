
const ADD_FILE = "addFile";
const REMOVE_FILE = "removeFile";
const ADD_MACROS = "addMacros";
const REMOVE_MACROS = "removeMacros";

// An interface for our actions
interface AddFile {
    type: typeof ADD_FILE;
    payload: {
        name: string,
        file: FileInfo
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
        fileName: string,
        name: string,
        value: string
    }
}

interface RemoveMacros {
    type: typeof REMOVE_MACROS;
    payload: {
        fileName: string,
        name: string;
    };
}

type Action =
    | AddFile
    | RemoveFile
    | AddMacros
    | RemoveMacros

type FileInfo = {
    file?: string,
    fileIndex?: number,
    macros?: { [key: string]: string }
}

type FileState = { [key: string]: FileInfo }

export const initialState: FileState = {};

export function reducer(state: FileState, action: Action) {
    switch (action.type) {
        case ADD_FILE: {
            return { ...state, [action.payload.name]: action.payload.file };
        }
        case REMOVE_FILE: {
            const newState = { ...state };
            delete newState[action.payload.name]
            return newState;
        }
        case ADD_MACROS: {
            const file = { ...state[action.payload.fileName] }
            if (file.macros === undefined) file.macros = { [action.payload.name]: action.payload.value }
            file.macros[action.payload.name] = action.payload.value;
            return { ...state, [action.payload.fileName]: file };
        }
        case REMOVE_MACROS: {
            const file = { ...state[action.payload.fileName] }
            if (file.macros !== undefined) delete file.macros[action.payload.name];
            return { ...state, [action.payload.fileName]: file };
        }
    }
}