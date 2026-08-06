import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@mui/material";

interface OverwriteDialogProps {
  open: boolean;
  filename: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function OverwriteDialog({
  open,
  filename,
  onCancel,
  onConfirm
}: OverwriteDialogProps) {
  return (
    <Dialog open={open} onClose={onConfirm}>
      <DialogTitle>Overwrite Quick Screen?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          A Quick Screen named <strong>{filename}</strong> already exists.
          Saving will replace the existing content. Are you sure you want to
          continue?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="contained" color="warning" onClick={onConfirm}>
          Save and overwrite
        </Button>
      </DialogActions>
    </Dialog>
  );
}
