import { Dialog, DialogContent, DialogActions, Button, Box, Typography } from "@mui/material";
import {
  WarningAmber as WarningIcon,
  ErrorOutline as ErrorIcon,
  InfoOutlined as InfoIcon,
  CheckCircleOutline as SuccessIcon,
} from "@mui/icons-material";

type Severity = "error" | "warning" | "info" | "success";

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

const configMap = {
  error: {
    icon: <ErrorIcon />,
    color: "#dc2626",
    bg: "rgba(220,38,38,0.1)",
  },
  warning: {
    icon: <WarningIcon />,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
  },
  info: {
    icon: <InfoIcon />,
    color: "#2563eb",
    bg: "rgba(37,99,235,0.1)",
  },
  success: {
    icon: <SuccessIcon />,
    color: "#16a34a",
    bg: "rgba(22,163,74,0.1)",
  },
};

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  severity = "info",
}: ConfirmDialogProps) {
  const config = configMap[severity];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        },
      }}>
      <DialogContent sx={{ textAlign: "center", pt: 4 }}>
        {/* 🔥 ICONO */}
        <Box
          sx={{
            width: 64,
            height: 64,
            mx: "auto",
            mb: 2,
            borderRadius: "50%",
            backgroundColor: config.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: config.color,
            fontSize: 32,
          }}>
          {config.icon}
        </Box>

        {/* 🔥 TÍTULO */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 1,
          }}>
          {title}
        </Typography>

        {/* 🔥 MENSAJE */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            maxWidth: 320,
            mx: "auto",
          }}>
          {message}
        </Typography>
      </DialogContent>

      {/* 🔥 ACCIONES */}
      <DialogActions
        sx={{
          justifyContent: "center",
          gap: 2,
          pb: 3,
        }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            px: 3,
            borderRadius: 2,
          }}>
          {cancelText}
        </Button>

        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            px: 4,
            borderRadius: 2,
            backgroundColor: config.color,
            "&:hover": {
              backgroundColor: config.color,
              opacity: 0.9,
            },
          }}
          autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
