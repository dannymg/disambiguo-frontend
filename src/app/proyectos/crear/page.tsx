"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material"
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material"
import { PageHeader } from "@/components/common/PageHeader"
import DashboardLayout from '@/components/common/DashBoardLayout';
import { proyectoService } from "@/api/proyecto-service";
import { getCurrentUser } from "@/hooks/auth/auth-service"
import ConfirmationDialog from "@/components/common/ConfimationDialog"

export default function NewProjectPage() {
  const router = useRouter()
  
  // Estado para cada campo del formulario
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [contexto, setContexto] = useState("")
  const [specifications, setSpecifications] = useState<string[]>([])
  const [newSpec, setNewSpec] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [confirmationTitle, setConfirmationTitle] = useState("");
  const [confirmationType, setConfirmationType] = useState<"success" | "error">("success");  

  const handleAddSpec = () => {
    if (newSpec.trim()) {
      setSpecifications([...specifications, newSpec.trim()])
      setNewSpec("")
    }
  }

  const handleRemoveSpec = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index))
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault(); 
    setError(null);

    if (!titulo.trim() || !descripcion.trim()) {
      setError("El título y la descripción son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      const currentUser = await getCurrentUser();

      await proyectoService.createProyecto({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        contexto: contexto || "", // Asegurarse de que no sea undefined
        listaEspecificaciones: JSON.stringify(specifications),
        version: 1,
        esActivo: true,
        listaRequisitos: [],
        creadoPor: currentUser.email,
      });

      // Mostrar mensaje de éxito
      setConfirmationTitle("Proyecto creado");
      setConfirmationMessage("El proyecto se ha creado correctamente.");
      setConfirmationType("success");
      setConfirmationOpen(true);

      // Redirigir al dashboard después de cerrar el diálogo
      setTimeout(() => {
        router.push("/proyectos");
      }, 7000); // Redirige después de 2 segundos
    } catch (err) {
      console.error("Error al guardar el proyecto:", err);

      // Mostrar mensaje de error
      setConfirmationTitle("Error");
      setConfirmationMessage(
        (err as any).response?.data?.error?.message || "Hubo un error al guardar el proyecto."
      );
      setConfirmationType("error");
      setConfirmationOpen(true);
    } finally {
      setLoading(false);
    }
   }
   
  return (
    <DashboardLayout>
      <Container maxWidth="lg">
        <PageHeader title="Crear proyecto" />
        <Paper sx={{ p: 4 }}>
          <Box component="form" noValidate autoComplete="off">
            <TextField
              fullWidth
              label="Título"
              margin="normal"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
            <TextField
              fullWidth
              label="Descripción"
              margin="normal"
              multiline
              rows={2}
              required
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
            <TextField
              fullWidth
              label="Contexto"
              margin="normal"
              multiline
              rows={3}
              value={contexto}
              onChange={(e) => setContexto(e.target.value)}
            />
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Especificaciones
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Nueva especificación"
                  value={newSpec}
                  onChange={(e) => setNewSpec(e.target.value)}
                />
                <IconButton color="primary" onClick={handleAddSpec}>
                  <AddIcon />
                </IconButton>
              </Box>
              <List>
                {specifications.map((spec, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleRemoveSpec(index)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={spec} />
                  </ListItem>
                ))}
              </List>
            </Box>
            {error && <Typography color="error">{error}</Typography>}
            <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={() => router.push("/proyectos")}>
                Cancelar
              </Button>
              <Button variant="contained" onClick={handleSave} disabled={loading}>
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
