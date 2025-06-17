import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import {
  CheckCircleOutline as SuccessIcon,
  InfoOutlined as InfoIcon,
  WarningAmber as WarningIcon,
  ErrorOutline as ErrorIcon,
} from '@mui/icons-material';

type NoticeType = 'success' | 'info' | 'warning' | 'error';

interface NoticeDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: NoticeType;
  buttonText?: string;
}

const iconMap = {
  success: <SuccessIcon color="success" />,
  info: <InfoIcon color="info" />,
  warning: <WarningIcon color="warning" />,
  error: <ErrorIcon color="error" />,
};

const colorMap = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error',
} as const;

export default function NoticeDialog({
  open,
  onClose,
  title,
  message,
  type = 'info',
  buttonText = 'Entendido',
}: NoticeDialogProps) {
  const icon = iconMap[type];
  const color = colorMap[type];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="notice-dialog-title"
      aria-describedby="notice-dialog-description"
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle id="notice-dialog-title">
        <Box display="flex" alignItems="center" gap={1}>
          {icon}
          <Typography variant="h6" component="span" color={color}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="notice-dialog-description" color="text.primary">
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" sx={{ color: color as string }} autoFocus>
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
