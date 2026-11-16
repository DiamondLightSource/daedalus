import { createContext } from "react";
import { BeamlineTreeState, initialState } from "../store";

export const BeamlineTreeStateContext = createContext<{
  state: BeamlineTreeState;
  dispatch: React.Dispatch<any>;
}>({ state: initialState, dispatch: () => null });
