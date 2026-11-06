import { createContext } from "react";

export const MenuContext = createContext<{
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}>({
  menuOpen: true,
  setMenuOpen: () => null
});
