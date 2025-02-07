import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "success" | "error"; // Tipo de diálogo (éxito o error)
}

export default function ConfirmationDialog({ open, onClose, title, message, type = "success" }: ConfirmationDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title" sx={{ color: type === "error" ? "error.main" : "success.main" }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color={type === "error" ? "error" : "primary"} autoFocus>
          Entendido
        </Button>
      </DialogActions>
    </Dialog>
  );
}