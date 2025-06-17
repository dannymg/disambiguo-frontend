"use client"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"

import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  Chip,
} from "@mui/material"
import { proyectoService } from "@/api/proyectoService"
import { requisitoService } from "@/api/requisito-service"
import type { Proyecto, VersionRequisito } from "@/types/entities"
import DashboardLayout from "@/components/layouts/DashboardLayout"
import Loading from "@/components/common/Dialogs/Loading"

export default function AnalizarRequisitoPage() {
  const { proyectoId } = useParams() as { proyectoId: string }
  const router = useRouter()
  const [proyecto, setProyecto] = useState<Proyecto | null>(null)
  const [requisitos, setRequisitos] = useState<VersionRequisito[]>([])
  const [selectedRequisitos, setSelectedRequisitos] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const proyectoData = await proyectoService.getProyectoById(proyectoId)
        console.log('Proyecto actual:', proyectoData)
        setProyecto(proyectoData)
        const requisitosData = await requisitoService.getAllRequisitos(proyectoId)
        console.log('Requisitos obtenidos:', requisitosData)
        setRequisitos(requisitosData)
      } catch (error) {
        console.error("Error al cargar datos:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [proyectoId])

  const handleToggleRequisito = (requisitoId: string) => {
    setSelectedRequisitos((prev) =>
      prev.includes(requisitoId) ? prev.filter((documentId) => documentId !== requisitoId) : [...prev, requisitoId]
    )
  }

  const handleAnalizar = () => {
    if (selectedRequisitos.length === 0) {
      alert("Por favor, seleccione al menos un requisito para analizar")
      return
    }
    router.push(`/ambiguedades/${proyectoId}/deteccion?requisitos=${selectedRequisitos.join(",")}`)
  }

  if (loading) return <Loading />
  if (!proyecto || !requisitos || requisitos.length === 0)
    return (
      <DashboardLayout>
        <Typography variant="h5" color="error">
          No se encontraron requisitos disponibles para este proyecto.
        </Typography>
      </DashboardLayout>
    )
    
     // Filtrar requisitos funcionales y no funcionales
     const requisitosFuncionales = requisitos.filter(
     (req) => req.identificador?.startsWith("RF") && req.identificador !== undefined
   )
   const requisitosNoFuncionales = requisitos.filter(
     (req) => req.identificador?.startsWith("RNF") && req.identificador !== undefined
   )
  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Analizar ambigüedad
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Seleccione los requisitos para analizar la presencia de ambigüedades
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Se presentan requisitos que todavía no han sido aprobados
        </Typography>

        {/* Tabla de Requisitos Funcionales */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Requisitos Funcionales (RF)
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "10%" }}>Identificador</TableCell>
                  <TableCell sx={{ width: "20%" }}>Nombre</TableCell>
                  <TableCell sx={{ width: "40%" }}>Descripción</TableCell>
                  <TableCell sx={{ width: "10%" }}>Prioridad</TableCell>
                  <TableCell sx={{ width: "10%" }}>Versión</TableCell>
                  <TableCell sx={{ width: "10%" }}>Revisado</TableCell>
                  <TableCell align="center" sx={{ width: "10%" }}>
                    Escoger
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requisitosFuncionales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No hay requisitos funcionales disponibles
                    </TableCell>
                  </TableRow>
                ) : (
                  requisitosFuncionales.map((req) => (
                    <TableRow key={req.documentId}>
                      <TableCell>{req.identificador ?? "Sin identificador"}</TableCell>
                      <TableCell>{req.requisito?.[0]?.nombre ?? "Sin nombre"}</TableCell>
                      <TableCell>{req.requisito?.[0]?.descripcion ?? "Sin descripción"}</TableCell>
                      <TableCell>
                        <Chip
                          label={req.requisito?.[0]?.prioridad ?? "Sin prioridad"}
                          color={req.requisito?.[0]?.prioridad === "ALTA" ? "error" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{req.requisito?.[0]?.version ?? "Sin versión"}</TableCell>
                      <TableCell>{req.requisito?.[0]?.estadoRevision === "REVISADO" ? "Rev." : "Pendiente"}</TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={selectedRequisitos.includes(req.documentId)}
                          onChange={() => handleToggleRequisito(req.documentId)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Tabla de Requisitos No Funcionales */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Requisitos No Funcionales (RNF)
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "10%" }}>Identificador</TableCell>
                  <TableCell sx={{ width: "20%" }}>Nombre</TableCell>
                  <TableCell sx={{ width: "40%" }}>Descripción</TableCell>
                  <TableCell sx={{ width: "10%" }}>Prioridad</TableCell>
                  <TableCell sx={{ width: "10%" }}>Versión</TableCell>
                  <TableCell sx={{ width: "10%" }}>Revisado</TableCell>
                  <TableCell align="center" sx={{ width: "10%" }}>
                    Escoger
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requisitosNoFuncionales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No hay requisitos no funcionales disponibles
                    </TableCell>
                  </TableRow>
                ) : (
                  requisitosNoFuncionales.map((req) => (
                    <TableRow key={req.documentId}>
                      <TableCell>{req.identificador ?? "Sin identificador"}</TableCell>
                      <TableCell>{req.requisito?.[0]?.nombre ?? "Sin nombre"}</TableCell>
                      <TableCell>{req.requisito?.[0]?.descripcion ?? "Sin descripción"}</TableCell>
                      <TableCell>
                        <Chip
                          label={req.requisito?.[0]?.prioridad ?? "Sin prioridad"}
                          color={req.requisito?.[0]?.prioridad === "ALTA" ? "error" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{req.requisito?.[0]?.version ?? "Sin versión"}</TableCell>
                      <TableCell>{req.requisito?.[0]?.estadoRevision === "REVISADO" ? "Rev." : "Pendiente"}</TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={selectedRequisitos.includes(req.documentId)}
                          onChange={() => handleToggleRequisito(req.documentId)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Botón de análisis */}
        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAnalizar}
            disabled={selectedRequisitos.length === 0}
          >
            Analizar
          </Button>
        </Box>
      </Container>
    </DashboardLayout>
  )
}