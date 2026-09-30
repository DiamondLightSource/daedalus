import { createTheme } from "@mui/material/styles";

export const diamondTheme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#202740",
          light: "#6a86e4",
          dark: "#1f3d96",
          contrastText: "#ffffff"
        },
        secondary: {
          main: "#ffffff"
        },
        error: {
          main: "#ea0b16"
        },
        warning: {
          main: "#ffe51d"
        },
        success: {
          main: "#38ce38"
        }
      }
    },
    dark: {
      palette: {
        primary: {
          main: "#a5bcff",
          light: "#8aa7ff",
          dark: "#c4d4ff",
          contrastText: "#0b1638"
        },
        secondary: {
          main: "#facf07",
          light: "#FBD838",
          dark: "#AF9004",
          contrastText: "#000000"
        },
        text: {
          secondary: "#8090CA"
        }
      }
    }
  },
  typography: {
    fontSize: 14,
    fontFamily: "Arial",
    h1: {
      fontSize: 32,
      fontWeight: 700
    },
    h2: {
      fontSize: 24,
      fontWeight: 700
    },
    h3: {
      fontSize: 18,
      fontWeight: 700
    },
    button: {
      fontSize: 14,
      fontWeight: 400,
      textTransform: "none"
    }
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: "#1d2945",
            fontWeight: 600
          }
        }
      }
    }
  }
});
