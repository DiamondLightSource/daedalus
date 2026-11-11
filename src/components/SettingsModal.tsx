import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog as MuiDialog,
  DialogContent,
  DialogTitle,
  Typography
} from "@mui/material";
import { CS_WEB_LIB_VERSION } from "@diamondlightsource/cs-web-lib";
import pkg from "../../package.json" with { type: "json" };

const DAEDALUS_VERSION = pkg.version;

const Dialog = styled(MuiDialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2)
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1)
  }
}));

export default function SettingsModal(props: { open: boolean; setOpen: any }) {
  const handleClose = (_event: any) => {
    props.setOpen(false);
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
      <DialogContent
        dividers
        sx={{ position: "relative", pb: 5, minHeight: "50px" }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            position: "absolute",
            right: 16,
            bottom: 8,
            textAlign: "right"
          }}
        >
          Daedalus: v{DAEDALUS_VERSION}
          <br />
          cs-web-lib: v{CS_WEB_LIB_VERSION}
        </Typography>
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
