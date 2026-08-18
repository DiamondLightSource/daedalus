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
  isOverwrite: boolean;
}

export default function OverwriteDialog({
  open,
  filename,
  onCancel,
  onConfirm,
  isOverwrite
}: OverwriteDialogProps) {
  return (
    <Dialog open={open} onClose={onConfirm}>
      <DialogTitle>{`${isOverwrite ? "Overwrite" : "Delete"} Quick Screen?`}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {isOverwrite ? (<>A Quick Screen named <strong>{filename}</strong> already exists.
          Saving will replace the existing content. Are you sure you want to continue?`</>) : 
          (<>You're about to delete the Quick Screen <strong>{filename}</strong>. 
          This action cannot be undone, and all data will be lost. Are you sure you want to continue?</>)}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="contained" color="warning" onClick={onConfirm}>
          {isOverwrite ? "Save and overwrite" : "Confirm and delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
