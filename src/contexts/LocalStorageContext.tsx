import { createContext } from "react";

export const StorageContext = createContext<{
  bobDisplayUuid?: string;
  setBobDisplayUuid: any;
  browsingMode?: string;
  setBrowsingMode: any;
  bobScreenUrlId?: string;
  setBobScreenUrlId: React.Dispatch<React.SetStateAction<string | undefined>>;
  quickScreenEditable: boolean;
  setQuickScreenEditable: React.Dispatch<React.SetStateAction<boolean>>;
  restoreQuickScreenSession: () => void;
}>({
  bobDisplayUuid: "",
  setBobDisplayUuid: () => null,
  browsingMode: "Load",
  setBrowsingMode: () => null,
  bobScreenUrlId: undefined,
  setBobScreenUrlId: () => null,
  quickScreenEditable: false,
  setQuickScreenEditable: () => null,
  restoreQuickScreenSession: () => {}
});
