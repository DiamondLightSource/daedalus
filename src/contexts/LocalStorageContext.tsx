import { createContext } from "react";

export const StorageContext = createContext<{
  bobDisplayUuid?: string;
  setBobDisplayUuid: any;
  browsingMode?: string;
  setBrowsingMode: any;
  bobScreenUrlId?: string;
  setBobScreenUrlId: React.Dispatch<React.SetStateAction<string | undefined>>;
  restoreQuickScreenSession: () => void;
}>({
  bobDisplayUuid: "",
  setBobDisplayUuid: () => null,
  browsingMode: "Load",
  setBrowsingMode: () => null,
  bobScreenUrlId: undefined,
  setBobScreenUrlId: () => null,
  restoreQuickScreenSession: () => {}
});
