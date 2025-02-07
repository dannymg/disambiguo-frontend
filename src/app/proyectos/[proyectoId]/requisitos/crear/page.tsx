"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
} from "@mui/material"
import { requisitoService } from "@/api/requisito-service"
import { versionService } from "@/api/version-service"
import DashboardLayout from "@/components/common/DashBoardLayout"
import ConfirmationDialog from "@/components/common/ConfimationDialog"

const prioridades = [
  { value: "ALTA", label: "ALTA", sx: { backgroundColor: "rgba(255,0,0,0.3)" } },
  { value: "MEDIA", label: "MEDIA", sx: { backgroundColor: "rgba(255,255,0,0.3)" } },
  { value: "BAJA", label: "BAJA", sx: { backgroundColor: "rgba(0,255,0,0.3)" } },
]

interface FormData {
  numeroID: string; 
  tipo: "FUNCIONAL" | "NO_FUNCIONAL";
  nombre: string;
  descripcion: string;
  version: number;
  prioridad: "ALTA" | "MEDIA" | "BAJA";
  estadoRevision: string;
}

export default function CrearRequisitoPage() {
  const { proyectoId } = useParams() as { proyectoId: string }
  const router = useRouter()

  // Estado inicial con tipos correctos
  const [formData, setFormData] = useState<FormData>({
    numeroID: "001", // Valor inicial como número
    tipo: "FUNCIONAL", // Valor predeterminado
    nombre: "",
    descripcion: "",
    version: 1, // Versión inicial
    prioridad: "ALTA", // Prioridad predeterminada
    estadoRevision: "PENDIENTE", // Estado predeterminado
  });

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [confirmationMessage, setConfirmationMessage] = useState("")
  const [confirmationTitle, setConfirmationTitle] = useState("")
  const [confirmationType, setConfirmationType] = useState<"success" | "error">("success")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "numeroID") {
      const valorPaddeado = value.replace(/\D/g, '').slice(0, 3)
      setFormData((prev) => ({ ...prev, [name]: valorPaddeado }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  const handleNumeroIDBlur = async () => {
    if (!formData.numeroID.trim()) return
    const paddedValue = formData.numeroID.padStart(3, '0')
    setFormData(prev => ({ ...prev, numeroID: paddedValue }))
    
    try {
    const identificador = prefixLabel.concat(paddedValue);
    const existe = await versionService.checkNumeroID(proyectoId, identificador)
    if (existe) {
    setError("Este número ya existe para el proyecto")
    } else {
    setError(null)
    }
    } catch (err) {
    setError("Error al verificar el número ID")
    console.error("Error al verificar el número ID:", err)
    }
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!formData.numeroID || !formData.nombre.trim() || !formData.descripcion.trim()) {
      setError("Todos los campos marcados son obligatorios");
      return;
    }

    try {
      setLoading(true)
      console.log("numeroID limpio:", Number(formData.numeroID))
      await requisitoService.createRequisito({
        ...formData,
        numeroID: Number(formData.numeroID),
        creadoPor: "",
      }, 
      proyectoId)

      setConfirmationTitle("Requisito creado")
      setConfirmationMessage("El requisito se ha creado correctamente")
      setConfirmationType("success")
      setConfirmationOpen(true)

      setTimeout(() => {
        router.push(`/proyectos/${proyectoId}`)
      }, 6000)
    } catch (err) {
      console.error("Error al guardar el requisito:", err)
      setConfirmationTitle("Error")
      setConfirmationMessage(
        (err as any).response?.data?.error?.message || "Hubo un error al guardar el requisito"
      )
      setConfirmationType("error")
      setConfirmationOpen(true)
    } finally {
      setLoading(false)
    }
  }

  const prefixLabel = formData.tipo === "FUNCIONAL" ? "RF-" : "RNF-"

  return (
    <DashboardLayout>
      <Container maxWidth="md">
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Crear requisito
          </Typography>
          <Box component="form" noValidate autoComplete="off" onSubmit={handleSave}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6">{prefixLabel}</Typography>
              <TextField
                margin="normal"
                required
                label="Número ID"
                name="numeroID"
                value={formData.numeroID}
                onChange={handleChange}
                onBlur={handleNumeroIDBlur}
                error={Boolean(error)}
                helperText={error}
                inputProps={{
                  maxLength: 3,
                  pattern: '[0-9]*',
                  inputMode: 'numeric'
                }}
              />
            </Box>

            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend">Tipo*</FormLabel>
              <RadioGroup row name="tipo" value={formData.tipo} onChange={handleChange}>
                <FormControlLabel value="FUNCIONAL" control={<Radio />} label="FUNCIONAL" />
                <FormControlLabel value="NO_FUNCIONAL" control={<Radio />} label="NO FUNCIONAL" />
              </RadioGroup>
            </FormControl>

            <TextField
              fullWidth
              label="Nombre"
              margin="normal"
              required
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Descripción"
              margin="normal"
              multiline
              rows={4}
              required
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
            />

            <TextField
              select
              fullWidth
              label="Prioridad"
              margin="normal"
              required
              name="prioridad"
              value={formData.prioridad}
              onChange={handleChange}
              sx={{
                backgroundColor: prioridades.find(option => option.value === formData.prioridad)?.sx.backgroundColor
              }}
            >
              {prioridades.map((option) => (
                <MenuItem key={option.value} value={option.value} sx={option.sx}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

            <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={() => router.push(`/proyectos/${proyectoId}`)}>
                Cancelar
              </Button>
              <Button variant="contained" type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar"}
              </Button>
            </Box>
          </Box>

          <ConfirmationDialog
            open={confirmationOpen}
            onClose={() => setConfirmationOpen(false)}
            title={confirmationTitle}
            message={confirmationMessage}
            type={confirmationType}
          />
        </Paper>
      </Container>
    </DashboardLayout>
  )
}