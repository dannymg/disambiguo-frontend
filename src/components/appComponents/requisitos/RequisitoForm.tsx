"use client";

import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Stack,
  Divider,
  Chip,
  Tooltip,
  IconButton,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useRequisitoForm } from "@/hooks/requisitos";
import NoticeDialog from "@/components/common/Dialogs/NoticeDialog";

interface Props {
  open: boolean;
  onClose: () => void;
  proyectoId: string;
  modo: "crear" | "editar";
  initialValues?: any;
  onSuccess: () => void;
}

const prioridades = [
  { value: "ALTA", label: "Alta", color: "error" },
  { value: "MEDIA", label: "Media", color: "warning" },
  { value: "BAJA", label: "Baja", color: "success" },
] as const;

export default function RequisitoForm({
  open,
  onClose,
  proyectoId,
  modo,
  initialValues,
  onSuccess,
}: Props) {
  const form = useRequisitoForm({
    modo,
    proyectoId,
    initialValues,
    onSuccess,
  });

  const handleClose = () => {
    form.resetForm();
    onClose();
  };

  const prefix = form.formData.tipo === "FUNCIONAL" ? "RF-" : "RNF-";

  const prioridadActual = prioridades.find((p) => p.value === form.formData.prioridad);

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {modo === "crear" ? "Crear requisito" : "Editar requisito"}
        </DialogTitle>

        <DialogContent>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}>
            <Stack spacing={4}>
              {/* 🔹 IDENTIFICADOR Y TIPO */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Identificador
                </Typography>

                {modo === "crear" ? (
                  <>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {prefix}
                      </Typography>

                      <TextField
                        label="Número ID"
                        name="numeroID"
                        value={form.formData.numeroID}
                        onChange={form.handleChange}
                        onBlur={form.handleNumeroIDBlur}
                        error={Boolean(form.error)}
                        helperText={form.error}
                        inputProps={{
                          maxLength: 3,
                          inputMode: "numeric",
                        }}
                        placeholder="000"
                        size="small"
                      />
                    </Stack>

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Tipo de requisito
                      </Typography>

                      <RadioGroup
                        row
                        name="tipo"
                        value={form.formData.tipo}
                        onChange={form.handleChange}>
                        <FormControlLabel value="FUNCIONAL" control={<Radio />} label="Funcional" />

                        <FormControlLabel
                          value="NO_FUNCIONAL"
                          control={<Radio />}
                          label="No funcional"
                        />
                      </RadioGroup>
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "grey.100",
                      border: "1px solid",
                      borderColor: "divider",
                    }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                        }}>
                        {prefix}
                        {form.formData.numeroID}
                      </Typography>

                      <Tooltip
                        arrow
                        placement="right"
                        title={
                          <>
                            El identificador y el tipo del requisito no pueden modificarse porque
                            representan la identidad única del requisito dentro del proyecto.
                            <br />
                            <br />
                            Las ediciones generan una nueva versión manteniendo el mismo
                            identificador.
                          </>
                        }>
                        <IconButton size="small">
                          <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>

                    <Chip
                      label={
                        form.formData.tipo === "FUNCIONAL"
                          ? "Requisito Funcional"
                          : "Requisito No Funcional"
                      }
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ mt: 2 }}
                    />
                  </Box>
                )}
              </Box>

              <Divider />

              {/* 🔹 CONTENIDO */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Detalle del requisito
                </Typography>

                <TextField
                  fullWidth
                  label="Nombre"
                  name="nombre"
                  value={form.formData.nombre}
                  onChange={form.handleChange}
                  placeholder="Nombre del requisito"
                  required
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Descripción"
                  name="descripcion"
                  value={form.formData.descripcion}
                  onChange={form.handleChange}
                  placeholder="Descripción clara del requisito"
                  multiline
                  rows={4}
                  required
                />
              </Box>

              <Divider />

              {/* 🔹 PRIORIDAD */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Prioridad
                </Typography>

                <TextField
                  select
                  fullWidth
                  name="prioridad"
                  value={form.formData.prioridad}
                  onChange={form.handleChange}
                  required>
                  {prioridades.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>

                {/* 🔥 INDICADOR VISUAL SUAVE */}
                {prioridadActual && (
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={`Prioridad ${prioridadActual.label}`}
                      color={prioridadActual.color}
                      variant="outlined"
                    />
                  </Box>
                )}
              </Box>

              {/* 🔹 ACCIONES */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button variant="outlined" onClick={handleClose}>
                  Cancelar
                </Button>

                <Button
                  variant="contained"
                  type="submit"
                  disabled={form.loading}
                  sx={{ px: 4, borderRadius: 2 }}>
                  {form.loading ? "Guardando..." : "Guardar"}
                </Button>
              </Box>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>

      <NoticeDialog
        open={form.noticeOpen}
        onClose={() => form.setNoticeOpen(false)}
        title={form.noticeType === "success" ? "Éxito" : "Error"}
        message={form.noticeType === "success" ? form.successMessage : form.errorMessage}
        type={form.noticeType}
      />
    </>
  );
}
