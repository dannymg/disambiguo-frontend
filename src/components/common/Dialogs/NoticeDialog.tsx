import { Dialog, DialogContent, DialogActions, Button, Box, Typography } from "@mui/material";
import {
  CheckCircleOutline as SuccessIcon,
  InfoOutlined as InfoIcon,
  WarningAmber as WarningIcon,
  ErrorOutline as ErrorIcon,
} from "@mui/icons-material";

type NoticeType = "success" | "info" | "warning" | "error";

interface NoticeDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: NoticeType;
  buttonText?: string;
}

const configMap = {
  success: {
    icon: <SuccessIcon />,
    color: "#16a34a",
    bg: "rgba(22,163,74,0.1)",
  },
  info: {
    icon: <InfoIcon />,
    color: "#2563eb",
    bg: "rgba(37,99,235,0.1)",
  },
  warning: {
    icon: <WarningIcon />,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
  },
  error: {
    icon: <ErrorIcon />,
    color: "#dc2626",
    bg: "rgba(220,38,38,0.1)",
  },
};

export default function NoticeDialog({
  open,
  onClose,
  title,
  message,
  type = "info",
  buttonText = "Entendido",
}: NoticeDialogProps) {
  const config = configMap[type];

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
        {/* 🔥 ICONO PROTAGONISTA */}
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
            color: "text.primary",
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
      <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
        <Button
          onClick={onClose}
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
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
