import { createTheme } from "@mui/material/styles";

export const diamondTheme = createTheme({
  palette: {
    primary: {
      main: "#1d2945"
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
