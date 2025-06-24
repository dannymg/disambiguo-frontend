import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface ErrorDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export default function ErrorDialog({ open, onClose, title, message }: ErrorDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="error-dialog-title"
      aria-describedby="error-dialog-description"
      maxWidth="xs"
      fullWidth>
      <DialogTitle id="error-dialog-title">
        <Box display="flex" alignItems="center" gap={1}>
          <ErrorOutlineIcon color="error" />
          <Typography variant="h6" component="span" color="error">
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="error-dialog-description" color="text.primary">
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="error" variant="contained" autoFocus>
          Entendido
        </Button>
      </DialogActions>
    </Dialog>
  );
}
