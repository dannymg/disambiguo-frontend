// pages/requisitos/importar/page.tsx

'use client'

import { useState } from "react"
import Papa, { ParseResult } from "papaparse"
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Input,
  Alert,
} from "@mui/material"
import DashboardLayout from "@/components/layouts/DashboardLayout"
import { requisitoService } from "@/api/requisito-service"
import { useParams, useRouter } from "next/navigation"

interface CsvRequisito {
  numeroID: string;
  tipo: "FUNCIONAL" | "NO_FUNCIONAL";
  nombre: string;
  descripcion: string;
  prioridad: "ALTA" | "MEDIA" | "BAJA";
}

export default function ImportarRequisitosPage() {
  const { proyectoId } = useParams() as { proyectoId: string }
  const router = useRouter()

  const [archivo, setArchivo] = useState<File | null>(null)
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setArchivo(file)
  }

  const handleImportar = () => {
    if (!archivo) return setError("Debes seleccionar un archivo .csv válido")

    Papa.parse<CsvRequisito>(archivo, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: ParseResult<CsvRequisito>) => {
        const datos = results.data
        try {
          for (const item of datos) {
            await requisitoService.createRequisito({
              numeroID: Number(item.numeroID),
              tipo: item.tipo,
              nombre: item.nombre,
              descripcion: item.descripcion,
              version: 1,
              prioridad: item.prioridad,
              estadoRevision: "PENDIENTE",
              creadoPor: "",
            }, proyectoId)
          }
          setMensaje(`${datos.length} requisitos importados correctamente.`)
          setError(null)
        } catch (err) {
          console.error("Error al importar requisitos:", err)
          setError("Ocurrió un error al importar los requisitos.")
          setMensaje(null)
        }
      },
      error: (err) => {
        setError("Error al leer el archivo: " + err.message)
      },
    })
  }

  return (
    <DashboardLayout>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Importar requisitos desde CSV
          </Typography>

          <Box>
            <Input type="file" inputProps={{ accept: ".csv" }} onChange={handleArchivoChange} />

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="contained" onClick={handleImportar}>
                Importar
              </Button>
              <Button variant="outlined" onClick={() => router.back()}>
                Cancelar
              </Button>
            </Box>
          </Box>

          {mensaje && <Alert severity="success" sx={{ mt: 3 }}>{mensaje}</Alert>}
          {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
        </Paper>
      </Container>
    </DashboardLayout>
  )
}
