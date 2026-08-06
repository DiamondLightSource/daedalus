import { styled, useColorScheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog as MuiDialog,
  DialogContent,
  DialogTitle,
  Typography,
  Switch,
  Grid,
  Stack
} from "@mui/material";
import { setCurrentClass } from "@diamondlightsource/cs-web-lib";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

const Dialog = styled(MuiDialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2)
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1)
  }
}));

export default function SettingsModal(props: { open: boolean; setOpen: any }) {
  const dispatch = useDispatch();
  const { mode, setMode } = useColorScheme();

  const handleClose = (_event: any) => {
    props.setOpen(false);
  };

  useEffect(() => {
    if (!mode) {
      return;
    }

    dispatch(setCurrentClass(mode === "dark" ? "DARKMODE" : "DEFAULT"));
  }, [mode, dispatch]);

  const handleChange = (_event: any, checked: boolean) => {
    setMode(checked ? "dark" : "light");
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="settings-menu-title"
      open={props.open}
      fullWidth={true}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="settings-menu-title">
        Settings
      </DialogTitle>
      <DialogContent dividers>
        <Grid container>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Typography>Enable Dark Mode</Typography>
            <Switch
              checked={mode === "dark" ? true : false}
              onChange={handleChange}
              sx={{
                "& .MuiSwitch-track": {
                  backgroundColor: `turquoise !important`,
                  opacity: "1 !important"
                },
                "& .Mui-checked + .MuiSwitch-track": {
                  backgroundColor: `black !important`
                }
              }}
            />
          </Stack>
        </Grid>
      </DialogContent>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={theme => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.primary.main
        })}
      >
        <CloseIcon />
      </IconButton>
    </Dialog>
  );
}
