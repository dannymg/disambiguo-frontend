import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Box,
  Typography,
} from '@mui/material';
import {
  WarningAmber as WarningIcon,
  ErrorOutline as ErrorIcon,
  InfoOutlined as InfoIcon,
  CheckCircleOutline as SuccessIcon,
} from '@mui/icons-material';

type Severity = 'error' | 'warning' | 'info' | 'success';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  severity?: Severity;
}

const iconMap = {
  error: <ErrorIcon color="error" />,
  warning: <WarningIcon color="warning" />,
  info: <InfoIcon color="info" />,
  success: <SuccessIcon color="success" />,
};

const colorMap = {
  error: 'error',
  warning: 'warning',
  info: 'info',
  success: 'success',
} as const;

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  severity = 'info',
}: ConfirmDialogProps) {
  const icon = iconMap[severity];
  const color = colorMap[severity];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle id="confirm-dialog-title">
        <Box display="flex" alignItems="center" gap={1}>
          {icon}
          <Typography variant="h6" component="span" color={color}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="confirm-dialog-description" color="text.primary">
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color={color} variant="contained" autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
